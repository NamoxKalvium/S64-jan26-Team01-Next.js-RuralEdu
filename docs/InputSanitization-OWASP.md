# Input Sanitization & Security Hardening (XSS + SQL Injection)

## Overview

Modern web applications constantly handle user-provided data — comments, forms, search inputs, URLs, headers, cookies, and more. If this data is not properly sanitized, validated, and encoded, it can become a serious security risk.

In this concept, we focus on **protecting the application against two of the most critical OWASP vulnerabilities**:

- **Cross-Site Scripting (XSS)**
- **SQL Injection (SQLi)**

By the end of this implementation, the application follows **OWASP best practices** to ensure that all user inputs are treated as untrusted, safely cleaned, and securely handled before storage or rendering.

---

## Learning Objectives

By completing this task, I learned how to:

- Understand OWASP and common web security threats
- Sanitize and validate user input before processing
- Encode output safely in the UI
- Prevent SQL Injection using parameterized queries
- Build reusable sanitization utilities and middleware
- Document security decisions and future improvements

---

## Understanding OWASP & Common Vulnerabilities

### What is OWASP?

**OWASP (Open Web Application Security Project)** is a global organization that publishes best practices and the **OWASP Top 10**, a list of the most critical security risks in web applications.

Two of the most common and dangerous vulnerabilities are:

| Vulnerability | Description | Example Attack |
|--------------|------------|----------------|
| **XSS (Cross-Site Scripting)** | Injecting malicious JavaScript into pages viewed by other users | `<script>alert("Hacked!")</script>` |
| **SQL Injection (SQLi)** | Injecting SQL commands to manipulate or leak database data | `' OR 1=1 --` |

### Core Security Principle

> **Never trust user input.**  
> Always sanitize, validate, and encode data **before storing** and **before rendering**.

---

## Implementing Input Sanitization

### Why Input Sanitization Matters

Unsanitized input can:
- Execute malicious scripts in the browser
- Steal cookies or authentication tokens
- Modify database queries
- Corrupt stored data

To prevent this, all user inputs must be cleaned before use.

---

### Installing a Sanitization Library

For this implementation, `sanitize-html` is used:

```bash
npm install sanitize-html
Creating a Sanitization Utility
A reusable utility ensures consistent sanitization across the application.

src/utils/sanitize.js
import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
Why This Works
Removes all HTML tags

Strips dangerous attributes (e.g., onClick, onError)

Prevents script injection at the input level

Can be customized later if limited HTML is required

Using Sanitization in API Handlers
All incoming request data is sanitized before saving to the database.

import { sanitizeInput } from '@/utils/sanitize';

export default async function handler(req, res) {
  const cleanComment = sanitizeInput(req.body.comment);

  await db.comments.create({
    data: {
      text: cleanComment,
    },
  });

  res.status(200).json({ message: 'Comment added safely!' });
}
✅ Result: Malicious scripts never reach storage or rendering layers.

Encoding Outputs in the UI
Why Output Encoding Is Still Required
Even sanitized input should always be safely rendered.
Encoding prevents unexpected script execution at display time.

Safe Rendering in React
React automatically escapes strings, making this safe by default:

<div>{sanitizeInput(userComment)}</div>
When dangerouslySetInnerHTML Is Required
This should be avoided whenever possible, but if needed:

import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userComment),
  }}
/>
Important Notes
React auto-escapes content — do not disable it

Never trust raw HTML from users

Always sanitize before injecting HTML

Preventing SQL Injection (SQLi)
What Is SQL Injection?
SQL Injection occurs when untrusted input is directly embedded into SQL queries, allowing attackers to manipulate database behavior.

Safe Approach: Parameterized Queries
Using ORM tools like Prisma, Sequelize, or Mongoose automatically prevents SQL Injection.

const user = await prisma.user.findFirst({
  where: {
    email: emailInput,
  },
});
Here:

Inputs are treated as data, not executable SQL

Queries are compiled safely by the ORM

❌ Vulnerable Example (Do NOT Do This)
const result = await db.query(
  `SELECT * FROM users WHERE name = '${req.body.name}'`
);
This allows attackers to inject SQL commands like:

' OR 1=1 --
OWASP Best Practice
Treat every external input (body, query params, headers, cookies) as untrusted until validated and sanitized.

Before & After Demonstration
Test Input (Malicious)
<script>alert("Hacked!")</script>
Before Sanitization
Script executes in the browser

User session is compromised

Application is vulnerable

After Sanitization
Script tags are removed

Safe text is displayed

No JavaScript execution occurs

SQL Injection Attempt
' OR 1=1 --
Before Protection
Returns all users

Authentication bypass possible

After Protection
Query fails safely

No data leakage

Database remains secure

Reflections & Learnings
Why These Measures Matter
Security vulnerabilities can lead to data breaches

Trust erosion and legal consequences

Even small apps are targets

Prevention is cheaper than recovery

Security Is a Continuous Process
This implementation is not a one-time fix. Ongoing practices include:

Regular dependency updates

Security audits

Code reviews focused on input handling

Monitoring OWASP Top 10 updates

Future Improvements
Planned enhancements include:

Content Security Policy (CSP)

Schema validation using Zod / Joi

Secure HTTP headers (helmet)

Rate limiting and brute-force protection

Centralized request validation middleware

Automated security testing

Deliverables Checklist
Sanitization utility implemented

XSS prevention verified with before/after examples

SQL Injection prevented using parameterized queries

Secure input handling applied across API and UI

Detailed documentation and reflections included

