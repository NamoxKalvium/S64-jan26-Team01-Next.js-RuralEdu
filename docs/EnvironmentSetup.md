This assignment demonstrates how to securely manage sensitive configuration values using a cloud-based secrets manager instead of hardcoding secrets or storing them directly in .env files.

By completing this task, we achieved the following:

Centralized storage of sensitive credentials (DB URLs, JWT secrets, API keys)

Secure runtime retrieval of secrets in a Next.js application

Least-privilege access using IAM roles / Managed Identities

Improved security posture with secret rotation and encryption

Clear documentation of secret lifecycle and access control

🧠 Why Use a Secrets Manager?
Hardcoding secrets or committing .env files can lead to:

Credential leaks

Accidental exposure in version control

Difficult rotation and auditing

Cloud secret managers solve this by:

Encrypting secrets at rest and in transit

Restricting access using fine-grained IAM policies

Supporting automated rotation

Providing audit logs for access tracking

☁️ Chosen Service
✅ AWS Secrets Manager
(Same approach applies to Azure Key Vault with equivalent concepts)

AWS Secrets Manager was used to securely store and retrieve application secrets at runtime.

🧩 Secrets Stored
The following secrets were stored as key-value pairs:

{
  "DATABASE_URL": "postgresql://admin:password@db.example.com:5432/nextjsdb",
  "JWT_SECRET": "supersecuretokenkey"
}
Secret Metadata
Secret Name: nextjs/app-secrets

Encryption: AWS-managed KMS key (default)

Region: Same region as application runtime

🔐 Access Control (Least Privilege)
IAM Policy Used
Access to secrets is restricted using an IAM role or user with minimum required permissions.

{
  "Effect": "Allow",
  "Action": "secretsmanager:GetSecretValue",
  "Resource": "arn:aws:secretsmanager:<region>:<account-id>:secret:nextjs/app-secrets-*"
}
Key Principles Applied
Only GetSecretValue permission granted

Access limited to a single secret ARN

No write, delete, or list permissions granted

This ensures that even if credentials are compromised, the blast radius remains minimal.

⚙️ Runtime Secret Retrieval
Secrets are fetched dynamically at runtime using the AWS SDK.

Installation
npm install aws-sdk
Secret Fetch Utility
import AWS from "aws-sdk";

const client = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
});

export async function getSecrets() {
  const response = await client
    .getSecretValue({
      SecretId: process.env.SECRET_ARN!,
    })
    .promise();

  return JSON.parse(response.SecretString as string);
}
🧪 Using Secrets in the App
const secrets = await getSecrets();

const databaseUrl = secrets.DATABASE_URL;
const jwtSecret = secrets.JWT_SECRET;
✅ Secrets are never hardcoded
✅ No sensitive values logged or exposed
✅ Secrets exist only in memory at runtime

🧪 Runtime Validation
Verified by:
Running the app locally / in cloud environment

Confirming successful DB connection using secret-based credentials

Logging only non-sensitive confirmation messages

Evidence Captured:
AWS Secrets Manager dashboard showing stored secrets

Application logs confirming successful retrieval

Functional API routes using injected secrets

(Screenshots attached in submission)

🔁 Secret Rotation Strategy
Recommended Rotation Interval
Every 30–60 days for:

JWT secrets

Database credentials

Third-party API keys

Automation Options
AWS Lambda rotation function

Scheduled credential regeneration

Zero-downtime rotation by updating dependent services automatically

Benefits of Rotation
Limits exposure window if secrets are leaked

Meets security compliance standards

Encourages proactive security hygiene

🛡️ Security Benefits Summary
Risk	Mitigation
Hardcoded secrets	Centralized cloud storage
Git leaks	Secrets never committed
Unauthorized access	IAM least privilege
Manual rotation errors	Automated rotation
Audit gaps	Cloud access logs
🧠 Reflection
Why Centralized Secrets Matter
Using AWS Secrets Manager significantly improves application security by separating code from configuration. Developers can safely deploy applications without ever knowing actual secret values.

Least Privilege in Practice
Restricting access to only the necessary secret and action ensures that even if an application is compromised, attackers cannot escalate privileges or access unrelated resources.

Scalability
As the application grows (microservices, staging/production environments), secrets can be managed independently without code changes.

