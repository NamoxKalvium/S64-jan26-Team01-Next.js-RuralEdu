This assignment demonstrates how to design, organize, and implement RESTful API routes using file-based routing in Next.js (App Router).
The goal is to build predictable, maintainable, and scalable backend endpoints under the /api directory by following REST conventions, consistent naming, proper HTTP methods, and clear error handling.

A well-structured API reduces integration errors, improves team collaboration, and makes the backend almost self-documenting.

🛠️ Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

API Style: RESTful

Testing Tools: Postman / curl

📂 Folder Structure

Next.js uses file-based routing, where each folder inside app/api represents an endpoint.

app/
└── api/
    ├── users/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    ├── orders/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts

Key Rules Followed

All routes are inside app/api/

Folder names are lowercase and plural

Dynamic routes use [id]

Each route.ts file exports HTTP method handlers

🔁 RESTful Route Design

Routes are named using nouns, not verbs, and rely on HTTP methods to define actions.

Users API
Method	Route	Description
GET	/api/users	Fetch all users
POST	/api/users	Create a new user
GET	/api/users/:id	Fetch a user by ID
PUT / PATCH	/api/users/:id	Update user details
DELETE	/api/users/:id	Delete a user
Orders API (Example of another resource)
Method	Route	Description
GET	/api/orders	Fetch all orders
POST	/api/orders	Create a new order
GET	/api/orders/:id	Fetch order by ID
🧩 Example API Implementation
app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(
    { message: 'User created successfully', data },
    { status: 201 }
  );
}

🔢 Pagination Support

For large datasets, pagination is implemented using query parameters.

Example: /api/users?page=1&limit=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  return NextResponse.json({
    page,
    limit,
    data: []
  });
}

❗ Error Handling & Status Codes

Meaningful HTTP status codes are returned for better client-side handling.

if (!data) {
  return NextResponse.json(
    { error: 'Resource not found' },
    { status: 404 }
  );
}

Status Codes Used
Code	Meaning	When Used
200	OK	Successful GET
201	Created	Resource creation
400	Bad Request	Invalid input
404	Not Found	Resource not found
500	Internal Server Error	Unexpected errors
🧪 API Testing
Using curl
# Get all users
curl -X GET http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Charlie"}'

Using Postman

Verified all CRUD operations

Checked correct status codes

Validated JSON responses

Tested pagination and error cases

📸 Screenshots of Postman test results are included as evidence.

📘 Documentation Summary

This README documents:

API route hierarchy under /api

RESTful naming conventions

HTTP verbs and their usage

Pagination logic

Error handling strategy

Example requests and responses

🧠 Reflection

Consistent API naming and structure greatly improve maintainability and usability.
When routes follow predictable patterns:

Developers can guess endpoints without documentation

Frontend-backend integration becomes faster

Debugging and scaling the application is easier

By adhering to REST principles and Next.js file-based routing, the backend remains clean, intuitive, and scalable.