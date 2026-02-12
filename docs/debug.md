# 🐞 Debugging Reflection – Sprint 1

## 📌 Overview

This document analyzes a **real-world debugging issue** encountered during Sprint 1. The goal is not just to describe how the bug was fixed, but to explain **why it occurred**, **how it was investigated**, and **what lessons were learned** to prevent similar issues in the future.

Debugging is treated as a structured engineering process involving hypothesis, verification, and reflection.

---

## 🎯 Goal of This Reflection

* Develop systematic debugging habits
* Improve problem analysis and reasoning skills
* Document learnings for future contributors
* Move from trial-and-error to root-cause understanding

---

## 🚨 Identified Critical Issue

### Issue Title

**Signup/Login API Working Locally but Failing for Teammates**

### Why This Issue Was Chosen

* Blocked team progress
* Required multiple debugging attempts
* Involved environment configuration, backend, and database understanding
* Highlighted the difference between local and shared environments

---

## 🧠 Context & Symptoms

### Feature Being Worked On

User authentication system (Signup & Login) using **Next.js API routes + PostgreSQL**.

### Environment

* ✅ Working on my local machine
* ❌ Failing on teammate’s local setup

### Observed Symptoms

* Signup API failed with **500 Internal Server Error**
* Login API returned authentication failure
* Database connection errors appeared only on teammate’s system

### Example Error Message

```
PrismaClientInitializationError: Can't reach database server at `localhost:5432`
```

---

## 🔍 Debugging Process (Step-by-Step)

| Step | Action Taken                       | Observation / Outcome                       |
| ---- | ---------------------------------- | ------------------------------------------- |
| 1    | Checked backend logs               | Error indicated database connection failure |
| 2    | Verified PostgreSQL service        | DB was not running on teammate’s system     |
| 3    | Checked `.env` configuration       | Database credentials mismatched             |
| 4    | Verified Prisma schema             | Schema was correct, not the issue           |
| 5    | Tested DB connection manually      | Connection failed due to wrong password     |
| 6    | Updated `.env` with correct values | API started working                         |
| 7    | Restarted backend server           | Signup & login succeeded                    |

---

## 🧩 Root Cause Analysis

The root cause was **environment inconsistency**:

* PostgreSQL service was not running on the teammate’s machine
* `.env` file had incorrect database credentials
* Assumption that “it works on my machine” led to delayed diagnosis

This issue was **not caused by code**, but by **missing infrastructure setup**.

---

## 🛠️ Implemented Fix & Reasoning

### Fix Applied

* Ensured PostgreSQL service was running
* Updated `.env` file with correct database credentials
* Verified database connectivity before running the app

### Why This Fix Was Chosen

* Logs clearly indicated a database connectivity issue
* Prisma schema and API logic were already validated locally
* Manual DB testing confirmed credentials mismatch

### Alternative Considered

* Rewriting Prisma configuration ❌ (not needed)
* Reinstalling PostgreSQL ❌ (service was present)

---

## 📘 What I Learned (Reflection)

### Key Takeaways

* Environment issues can mimic code bugs
* Logs are the most reliable starting point for debugging
* Always verify external dependencies (DB, ports, services)

### Most Useful Debugging Tools

* Backend logs
* Prisma error messages
* Manual database connection testing

### What I’ll Do Differently Next Time

* Create a **setup checklist** for teammates
* Validate environment variables before debugging code
* Document common setup errors in README

### Prevention Strategies

* Add `.env.example` file
* Include database setup steps in documentation
* Use Docker in future sprints to standardize environments

---

## 🤝 Team Collaboration

Team communication played a key role:

* Shared error logs via chat
* Screen-sharing helped identify missing services
* Collaborative debugging reduced resolution time

---

## ✅ Final Outcome

* Signup/Login system works consistently across all team members
* Improved onboarding documentation
* Stronger understanding of environment-based bugs

---

## 📌 Conclusion

This debugging experience reinforced that **great debugging is about understanding systems**, not guessing fixes. By documenting this issue, future contributors can avoid similar blockers and resolve problems faster with a structured approach.

Debugging is no longer just about fixing errors — it’s about learning from them.
