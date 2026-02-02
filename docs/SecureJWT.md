This assignment implements a secure authentication system using Access Tokens and Refresh Tokens with JWT (JSON Web Tokens).
The goal is to balance security, performance, and user experience by issuing short-lived access tokens and long-lived refresh tokens, while protecting against common web vulnerabilities like XSS and CSRF.

🎯 Objectives
By completing this assignment, we achieved the following:

Issued short-lived access tokens for API authentication

Issued long-lived refresh tokens to renew access tokens

Implemented automatic token refresh flow

Used secure HTTP-only cookies for token storage

Implemented refresh token rotation

Documented security risks and mitigations

Ensured best practices for modern authentication systems

🧠 Key Concepts
Authentication vs Authorization
Concept	Description	Example
Authentication	Verifies who the user is	Login with email & password
Authorization	Verifies what the user can access	Admin accessing /api/admin
This assignment focuses on authentication with token lifecycle management.

🔑 Token Types & Lifespan
1️⃣ Access Token
Purpose: Authenticate API requests

Lifespan: ~15 minutes

Usage: Sent automatically with requests (via cookies)

Storage: In-memory or HTTP-only cookie

2️⃣ Refresh Token
Purpose: Generate new access tokens

Lifespan: ~7 days

Usage: Used only when access token expires

Storage: Secure, HTTP-only cookie

🧩 Token Structure (JWT)
Each JWT consists of three parts:

HEADER.PAYLOAD.SIGNATURE
Example Payload
{
  "sub": "user_id_123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700000900
}
sub → User identifier

iat → Issued at

exp → Expiry time

📁 Project Structure
app/
 └── api/
      ├── auth/
      │    ├── login/
      │    │    └── route.ts
      │    ├── refresh/
      │    │    └── route.ts
      │    └── logout/
      │         └── route.ts
      └── users/
           └── route.ts
⚙️ Token Generation Logic
On Successful Login
Validate user credentials

Generate:

Access Token (15 minutes)

Refresh Token (7 days)

Store tokens securely in cookies

Example (Login API)
const accessToken = jwt.sign(
  { id: user.id, email: user.email },
  process.env.ACCESS_TOKEN_SECRET!,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { id: user.id },
  process.env.REFRESH_TOKEN_SECRET!,
  { expiresIn: "7d" }
);
🍪 Secure Token Storage Strategy
Why Cookies?
Storage Option	Risk
localStorage	❌ Vulnerable to XSS
sessionStorage	❌ JS-accessible
HTTP-only cookies	✅ Secure
Cookie Configuration
{
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/"
}
httpOnly → Prevents JavaScript access

secure → HTTPS only

sameSite=strict → Prevents CSRF attacks

🔄 Token Refresh Flow
When Access Token Expires
Client detects 401 Unauthorized

Client calls /api/auth/refresh

Server:

Validates refresh token

Issues new access token

Issues new refresh token (rotation)

Old refresh token is invalidated

Refresh API Example
const newAccessToken = jwt.sign(
  { id: user.id },
  process.env.ACCESS_TOKEN_SECRET!,
  { expiresIn: "15m" }
);
🔁 Refresh Token Rotation
Why rotation?

Prevents replay attacks

Limits damage if a refresh token is stolen

Flow
Old Refresh Token ❌
↓
Validated
↓
New Refresh Token ✅
↓
Old Token Invalidated
📸 Proof of rotation is logged in server logs during refresh requests.

🛡️ Security Threat Mitigation
🧨 XSS (Cross-Site Scripting)
Threat: Malicious JS stealing tokens
Mitigation:

No tokens in localStorage

HTTP-only cookies

🎯 CSRF (Cross-Site Request Forgery)
Threat: Unauthorized requests from other sites
Mitigation:

SameSite=Strict cookies

Access tokens not exposed to JS

🔁 Replay Attacks
Threat: Reusing stolen refresh tokens
Mitigation:

Refresh token rotation

Short access token lifespan

🔐 Protected Route Example
export async function GET(req: Request) {
  const token = getAccessTokenFromCookie(req);

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return NextResponse.json({ success: true, user: decoded });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
🧪 Testing the Flow
Login
POST /api/auth/login
Access Protected Route
GET /api/users
Access Token Expired
Automatically triggers refresh

Refresh Token
POST /api/auth/refresh
📸 Screenshots / Logs (To Attach)
✅ Successful login response

❌ Expired access token response

🔄 Refresh token request & rotation log

✅ New access token issued

🧠 Reflection & Learnings
Why Short-Lived Access Tokens?
Limits exposure window

Reduces damage from leaks

Why Refresh Tokens?
Better UX (no frequent re-login)

Secure long-term sessions

Trade-offs
Benefit	Cost
Strong security	Slightly more complexity
Better UX	More server logic
Token rotation	Extra DB or cache checks
🚀 Scalability Considerations
Can add Redis for refresh token storage

Can extend roles & permissions easily

Supports multi-device login with token tracking

✅ Deliverables Checklist
 Access token (short-lived)

 Refresh token (long-lived)

 Secure cookie storage

 Automatic refresh flow

 Refresh token rotation

 Protected API routes

 Security reflection & documentation

📚 References
JWT.io – JSON Web Tokens

OWASP Authentication Best Practices

Next.js Route Handlers Documentation

MDN: HTTP Cookies & Security






