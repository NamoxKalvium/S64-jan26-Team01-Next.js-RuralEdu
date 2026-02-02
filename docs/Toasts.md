This assignment focuses on secure environment variable management in a Next.js application.
Environment variables are critical for storing secrets, configuration values, and environment‑specific settings without exposing them in source code.

In this task, we:

Created environment configuration files

Safely accessed variables in server and client code

Prevented accidental secret leaks

Documented best practices for security and scalability

Project Setup
Environment Files Created
We added the following files at the project root:

.env.local
.env.example
Purpose of Each File
File	Purpose
.env.local	Stores real secrets for local development (never committed)
.env.example	Stores placeholder values and documentation for teammates
.env.local (Ignored by Git)
This file contains real credentials and secrets.

Example:

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Authentication
JWT_SECRET=super_secret_jwt_key_123

# Cloud Storage
AWS_ACCESS_KEY_ID=AKIAxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=my-app-uploads

# Public Variables
NEXT_PUBLIC_APP_NAME=My Next App
⚠️ Important:
.env.local is listed in .gitignore, ensuring secrets are never pushed to GitHub.

.env.example (Committed to Repo)
This file contains dummy values and explanations to help other developers set up the project safely.

Example:

# Database connection string
DATABASE_URL=your_database_connection_url_here

# JWT secret used for signing tokens
JWT_SECRET=your_jwt_secret_here

# AWS credentials for S3 uploads
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Public environment variables (safe for browser)
NEXT_PUBLIC_APP_NAME=Your App Name
✅ This file allows:

Easy onboarding

No secret exposure

Clear documentation of required config

Accessing Environment Variables Safely
Server‑Side Usage
Server‑only variables are accessed using process.env:

const jwtSecret = process.env.JWT_SECRET;
Used in:

API routes

Middleware

Database connections

Authentication logic

These variables never reach the browser.

Client‑Side Usage (Public Variables)
Client‑accessible variables must be prefixed with:

NEXT_PUBLIC_
Example:

const appName = process.env.NEXT_PUBLIC_APP_NAME;
✅ This ensures:

Only intended values are exposed

Sensitive secrets remain private

Preventing Accidental Secret Leaks
1. .gitignore Protection
Confirmed .env.local is ignored:

.env.local
.env.*.local
This prevents:

Accidental commits

Credential leaks

Security incidents

2. Strict Naming Convention
Variable Type	Prefix	Accessible
Server‑only	No prefix	Server only
Client‑safe	NEXT_PUBLIC_	Browser
This makes exposure intentional, not accidental.

3. No Secrets in Code
Secrets were never hardcoded in:

API routes

Middleware

Components

Utilities

All sensitive values are read from environment variables.

Environment Variable Reference
Variable	Type	Description
DATABASE_URL	Server	PostgreSQL connection string
JWT_SECRET	Server	JWT signing secret
AWS_ACCESS_KEY_ID	Server	AWS access key
AWS_SECRET_ACCESS_KEY	Server	AWS secret key
AWS_REGION	Server	AWS region
AWS_BUCKET_NAME	Server	S3 bucket name
NEXT_PUBLIC_APP_NAME	Client	App display name
Security Best Practices Followed
✅ Secrets stored outside source code

✅ .env.local never committed

✅ Public variables explicitly prefixed

✅ Environment‑specific configs supported

✅ Easy secret rotation without code changes

Reflection
Using environment variables correctly is a foundational security practice.

Why This Matters
Prevents credential leaks

Enables safe collaboration

Supports multiple environments (dev, staging, prod)

Makes deployments safer and faster

Key Learnings
Not all environment variables should be public

Naming conventions are a powerful safety mechanism

.env.example is essential for team scalability

Security is strongest when enforced by structure, not memory

A secure app doesn’t rely on developers remembering rules — it enforces them by design.

Conclusion
This setup ensures:

Secure handling of secrets

Clean separation of public vs private config

Easy onboarding for new developers

Production‑ready configuration management

The project now follows industry‑standard environment variable practices suitable for real‑world applications.