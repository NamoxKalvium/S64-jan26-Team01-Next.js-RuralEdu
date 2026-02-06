# Multi-Environment Configuration & Secure Secrets Management

## 📌 Overview

This assignment demonstrates how to configure **multi-environment deployments** for a Next.js application while securely managing sensitive data such as API keys, database credentials, and tokens. The setup follows real-world DevOps best practices by separating **development**, **staging**, and **production** environments to ensure safe, predictable, and reliable deployments.

The implementation focuses on **environment-aware builds**, **secure secret storage**, and **CI/CD readiness**, ensuring no sensitive data is ever exposed in the codebase.

---

## 🎯 Objectives

* Configure environment-specific builds (development, staging, production)
* Securely manage secrets using cloud-based secret managers
* Prevent sensitive data from being committed to version control
* Verify correct environment behavior during build and runtime
* Reflect on how multi-environment setups improve deployment reliability

---

## 🌍 Environment-Aware Build Setup

### Environment Files

Separate `.env` files were created for each deployment environment:

```
.env.development
.env.staging
.env.production
```

Each file contains only variables relevant to that environment.

### Example Variables

```env
NEXT_PUBLIC_API_URL=https://staging.api.example.com
DATABASE_URL=postgres://user:pass@db:5432/appdb
```

📌 **Important Notes:**

* `NEXT_PUBLIC_` variables are exposed to the browser
* Sensitive secrets (DB passwords, tokens) are server-only
* Real values are never committed to the repository

---

## 📄 Environment Variable Management

### .env.example (Tracked in Git)

A template file documents required variables without exposing secrets:

```env
NEXT_PUBLIC_API_URL=
DATABASE_URL=
JWT_SECRET=
```

This ensures developers know which variables are required while keeping real values secure.

### .gitignore Configuration

```gitignore
.env*
```

This guarantees no environment files are accidentally committed.

---

## 🔐 Secure Secret Management

Actual secrets are stored using **secure cloud mechanisms**, not in the repository.

### GitHub Secrets

Secrets such as database URLs and API keys are stored in:

```
Repository → Settings → Secrets and variables → Actions
```

Example secrets:

* `DATABASE_URL_STAGING`
* `DATABASE_URL_PRODUCTION`
* `JWT_SECRET`

These secrets are injected into the CI/CD pipeline during build and deployment.

---

### Cloud Secret Managers (Optional Extension)

Depending on deployment infrastructure, secrets can also be stored in:

* **AWS Systems Manager Parameter Store**
* **Azure Key Vault**

Benefits:

* Centralized secret rotation
* Fine-grained access control
* Audit logging for secret access

---

## ⚙️ Environment-Specific Build Scripts

Custom build scripts ensure the correct environment configuration is used.

```json
"scripts": {
  "build:dev": "next build",
  "build:staging": "NODE_ENV=staging next build",
  "build:production": "NODE_ENV=production next build"
}
```

During deployment, CI/CD pipelines inject the appropriate secrets based on the environment.

---

## 🧪 Verification & Testing

Each environment was tested independently:

```bash
npm run build:staging
npm run build:production
```

### Verification Checks

* Correct API endpoints loaded per environment
* Correct database connections
* No runtime errors due to missing variables
* Console logs confirm environment-specific values

📸 Screenshots and logs are included as evidence.

---

## 🧠 Common Challenges & Solutions

| Challenge                    | Solution                            |
| ---------------------------- | ----------------------------------- |
| Missing env variables        | Added validation and `.env.example` |
| Accidentally exposed secrets | Audited `NEXT_PUBLIC_` usage        |
| Wrong backend used           | Verified build-time variables       |

---

## 🧠 Reflection: Why Multi-Environment Setup Matters

Multi-environment configurations significantly improve **CI/CD reliability**:

* Prevents accidental production outages
* Enables safe testing in staging
* Improves debugging and rollback confidence
* Aligns development workflows with real-world DevOps practices

I