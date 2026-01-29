This assignment implements Role-Based Access Control (RBAC) in a Next.js application using JWT authentication, Prisma, and Next.js middleware.
The goal is to restrict access to protected API routes based on authenticated user roles (e.g., admin, user) while following the least-privilege principle.

🧱 1. User Roles Design
🎯 Purpose
To ensure different users have different levels of access within the application.

🔑 User Roles
admin → Full access, including admin-only APIs

user → Limited access, cannot access admin routes

🧩 Prisma User Model
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  USER
}
🧪 Role Assignment
Roles are assigned in one of two ways:

During database seeding (recommended for testing)

During signup logic (default role = USER)

🛡️ 2. Authentication & Authorization Middleware
🎯 Purpose
To:

Verify the JWT token

Extract user role

Restrict or allow access based on route and role

📁 File Location
app/middleware.ts
🔧 Middleware Logic
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };

    const pathname = req.nextUrl.pathname;

    // Admin-only routes
    if (pathname.startsWith("/api/admin") && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
🔄 Middleware Flow Diagram
Client Request
      ↓
Authorization Header
      ↓
JWT Token Present?
   ❌ No → 401 Unauthorized
   ✅ Yes
      ↓
Verify Token
   ❌ Invalid → 401 Unauthorized
   ✅ Valid
      ↓
Check Role
   ❌ Insufficient Role → 403 Forbidden
   ✅ Allowed
      ↓
Route Handler Executes
🔌 3. Protected API Routes
👥 /api/users (All Authenticated Users)
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Users endpoint accessed",
  });
}
✅ Accessible to:

USER

ADMIN

🛠️ /api/admin (Admin Only)
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Admin endpoint accessed",
  });
}
✅ Accessible to:

ADMIN
❌ Blocked for:

USER

🧪 4. Testing with curl / Postman
✅ User Access (Allowed)
curl -X GET http://localhost:3000/api/users \
-H "Authorization: Bearer <USER_JWT>"
✅ Admin Access (Allowed)
curl -X GET http://localhost:3000/api/admin \
-H "Authorization: Bearer <ADMIN_JWT>"
❌ Admin Access (Denied for Regular User)
curl -X GET http://localhost:3000/api/admin \
-H "Authorization: Bearer <USER_JWT>"
❌ Expected Response
{
  "success": false,
  "message": "Access denied"
}
📸 Verification Evidence
Successful access logs for /api/users

Forbidden access logs for /api/admin (USER role)

Successful admin access logs

JWT verification logs

(Screenshots/logs attached in submission)

🔍 Security & Design Reflection
🔐 Least-Privilege Principle
Each user is granted only the minimum permissions required.
This reduces:

Accidental data exposure

Unauthorized access

Security attack surface

➕ Adding New Roles in the Future
New roles like EDITOR or MODERATOR can be added easily by:

Extending the Prisma Role enum

Adding route checks in middleware

Example:

if (decoded.role === "EDITOR") { ... }
⚠️ Risks Without Middleware
If role checks were missing:

Any authenticated user could access admin APIs

Sensitive operations could be exposed

Application would violate security best practices

Middleware ensures centralized, consistent authorization across all routes.

✅ Conclusion
This implementation provides:

Secure JWT-based authentication

Centralized role-based authorization

Scalable design for future roles

Clean separation of concerns

It demonstrates production-ready access control aligned with industry best practices.

