📌 Overview
In this assignment, we implemented a centralized API response handling utility to enforce consistent, predictable, and structured responses across all Next.js API routes.
This approach improves developer experience, debugging, logging, and frontend integration by standardizing success and error responses.

The utility is reusable across multiple routes and follows best practices for RESTful APIs.

📁 Folder Structure
src/
├── app/
│   └── api/
│       ├── users/
│       │   └── route.ts
│       └── tasks/
│           └── route.ts
├── lib/
│   ├── responseHandler.ts
│   └── errorCodes.ts
🛠️ Response Handler Utility
📄 lib/responseHandler.ts
This file defines two reusable functions:

sendSuccess() → for successful API responses

sendError() → for error responses

import { NextResponse } from "next/server";

export const sendSuccess = (
  data: any,
  message = "Success",
  status = 200
) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  details?: any
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code,
        details,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};
🚨 Common Error Codes (Optional Enhancement)
📄 lib/errorCodes.ts
To avoid magic strings and ensure consistency, common error codes are stored in a single file.

export const ERROR_CODES = {
  VALIDATION_ERROR: "E001",
  NOT_FOUND: "E002",
  DATABASE_FAILURE: "E003",
  INTERNAL_ERROR: "E500",
};
These codes are reused across all API routes.

🔌 Usage in API Routes
✅ Example 1: Users API Route
📄 app/api/users/route.ts

import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    return sendSuccess(users, "Users fetched successfully", 200);
  } catch (error) {
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
✅ Example 2: Tasks API Route
📄 app/api/tasks/route.ts

import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const tasks = [
      { id: 1, title: "Setup project", status: "completed" },
      { id: 2, title: "Create API handlers", status: "pending" },
    ];

    return sendSuccess(tasks, "Tasks retrieved successfully", 200);
  } catch (error) {
    return sendError(
      "Unable to fetch tasks",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      error
    );
  }
}
📤 Standard API Response Formats
✅ Success Response Example
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "timestamp": "2026-01-28T06:15:32.123Z"
}
❌ Error Response Example
{
  "success": false,
  "message": "Failed to fetch users",
  "error": {
    "code": "E500",
    "details": {}
  },
  "timestamp": "2026-01-28T06:16:10.456Z"
}
📈 Why This Approach Is Valuable
🔹 Consistency
All API responses follow the same structure, making frontend handling simple and predictable.

🔹 Better Debugging
Error codes and timestamps help quickly trace issues in logs and monitoring tools.

🔹 Improved Team Collaboration
Developers know exactly:

Where to add responses

How errors should look

Which status codes to use

🔹 Scalability
As the project grows, new APIs automatically follow the same response contract without duplication.

🧠 Reflection
Implementing a centralized response handler significantly improves code quality and maintainability.
It eliminates repeated boilerplate code, enforces best practices, and provides a single source of truth for API responses.

This pattern also prepares the application for:

API logging

Monitoring tools

Frontend error boundary handling

Production‑grade observability

