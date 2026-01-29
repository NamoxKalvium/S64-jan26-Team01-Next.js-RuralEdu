📖 Overview

Modern web applications are complex systems that interact with APIs, databases, authentication services, and third-party platforms. Because of this, failures are inevitable — ranging from simple validation issues to serious backend crashes.

To handle these failures properly, this project implements a centralized error handling middleware in a Next.js application.

Instead of writing separate error logic inside every API route, we create a reusable error handler that:

Catches errors consistently

Logs them in a structured format

Prevents sensitive information from leaking in production

Improves debugging and monitoring

✅ Why Centralized Error Handling Matters

Without centralized error handling:

Every route returns errors differently

Logs become inconsistent and difficult to trace

Debugging becomes slower

Production users may accidentally see stack traces (security risk)

A centralized error handler ensures:

⭐ Key Benefits
Benefit	Explanation
Consistency	All API errors follow the same response format
Security	Stack traces and sensitive data are hidden in production
Observability	Structured logs make monitoring and debugging easier
Reusability	Same handler can be used across all routes
🌍 Development vs Production Behavior

Error handling should behave differently depending on the environment:

Environment	User Response	Logging
Development	Full error message + stack trace	Full error details
Production	Minimal safe message	Full internal logs (stack redacted for user)
📂 Project Structure

The project uses a dedicated folder for error management:

app/
 ├── api/
 │    ├── users/
 │    │    ├── route.ts
 ├── lib/
 │    ├── logger.ts
 │    ├── errorHandler.ts

Purpose of Each File

logger.ts → Structured logging utility

errorHandler.ts → Centralized error formatting + response

route.ts → API route using the centralized handler

🪵 Implementing Structured Logging (logger.ts)

To make debugging easier, we log errors in a structured JSON format instead of plain console messages.

📌 File: lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        meta,
        timestamp: new Date(),
      })
    );
  },

  error: (message: string, meta?: any) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        meta,
        timestamp: new Date(),
      })
    );
  },
};

✅ Why Structured Logging?

Structured logs are easier to:

Search in cloud tools like AWS CloudWatch

Filter by severity (info, error)

Track metadata such as route name or stack trace

🚨 Creating a Centralized Error Handler (errorHandler.ts)

The core of this assignment is the reusable error handler.

📌 File: lib/errorHandler.ts
import { NextResponse } from "next/server";
import { logger } from "./logger";

export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  const errorResponse = {
    success: false,

    message: isProd
      ? "Something went wrong. Please try again later."
      : error.message || "Unknown error",

    ...(isProd ? {} : { stack: error.stack }),
  };

  logger.error(`Error in ${context}`, {
    message: error.message,
    stack: isProd ? "REDACTED" : error.stack,
  });

  return NextResponse.json(errorResponse, { status: 500 });
}

🔑 Key Ideas in the Error Handler
✅ Environment Awareness

In development → full stack trace

In production → safe user message

✅ Secure Responses

Production users never see:

Database errors

Internal file paths

Stack traces

✅ Central Logging

Errors are always logged with:

Context (GET /api/users)

Error message

Stack trace (hidden in production response)

🔄 Using the Handler in API Routes

Instead of repeating try/catch logic everywhere, routes simply call handleError().

📌 File: app/api/users/route.ts
import { handleError } from "@/lib/errorHandler";

export async function GET() {
  try {
    // Simulate failure
    throw new Error("Database connection failed!");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}

🧪 Testing the Error Handler
✅ Development Mode Output

Run:

npm run dev


Test route:

curl -X GET http://localhost:3000/api/users

Response:
{
  "success": false,
  "message": "Database connection failed!",
  "stack": "Error: Database connection failed! at ..."
}


✔ Developers get full debugging details.

✅ Production Mode Output

Run:

NODE_ENV=production npm start

Response:
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}


✔ Users get a safe and clean response.

📜 Example Error Log Output

Even though production hides stack traces from users, logs still contain details:

{
  "level": "error",
  "message": "Error in GET /api/users",
  "meta": {
    "message": "Database connection failed!",
    "stack": "REDACTED"
  },
  "timestamp": "2025-10-29T16:45:00Z"
}

✍️ Reflection
🔍 How Structured Logs Aid Debugging

Structured JSON logs provide:

Clear categorization of errors

Route-level tracing

Easier debugging in distributed systems

Instead of searching random console output, developers can filter logs efficiently.

🔐 Why Redacting Sensitive Data Builds User Trust

Showing stack traces publicly can expose:

Database names

Internal server paths

Security vulnerabilities

By returning safe messages in production, we protect both the system and the user.