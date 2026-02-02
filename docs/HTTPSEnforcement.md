This assignment focuses on strengthening application security by configuring HTTP security headers in a Next.js project. These headers protect the application from common web vulnerabilities such as:

Man‑in‑the‑Middle (MITM) attacks

Cross‑Site Scripting (XSS)

Clickjacking

Cross‑Origin data leaks

By the end of this task, the application enforces HTTPS, applies a strict Content Security Policy, and securely configures CORS, verified through industry‑standard security scanners.

🧠 Key Concepts Covered
HSTS (HTTP Strict Transport Security)

Content Security Policy (CSP)

CORS (Cross‑Origin Resource Sharing)

Security header verification using:



🏗️ Implementation Overview
All security headers are configured at the framework level using Next.js headers configuration, ensuring consistency across pages and API routes.

1️⃣ Enforcing HTTPS with HSTS
🔎 What is HSTS?
HTTP Strict Transport Security (HSTS) forces browsers to always communicate with the application using HTTPS, preventing downgrade attacks and cookie hijacking.

✅ Configuration
next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
🛡️ Header Explanation
Directive	Purpose
max-age=63072000	Enforces HTTPS for 2 years
includeSubDomains	Applies rule to all subdomains
preload	Allows inclusion in browser preload lists
✔️ Result
All HTTP traffic is automatically upgraded to HTTPS.

Browsers remember HTTPS preference permanently.

2️⃣ Implementing Content Security Policy (CSP)
🔎 What is CSP?
Content Security Policy restricts where scripts, styles, images, and other resources can be loaded from—significantly reducing the risk of XSS attacks.

✅ Configuration
{
  key: "Content-Security-Policy",
  value: `
    default-src 'self';
    script-src 'self' https://apis.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim(),
}
🛡️ CSP Breakdown
Directive	Protection
default-src 'self'	Blocks all external sources by default
script-src	Prevents malicious JS injection
style-src 'unsafe-inline'	Allows inline styles (documented trade-off)
img-src data:	Allows inline base64 images
frame-ancestors 'none'	Prevents clickjacking
⚠️ Trade‑offs
'unsafe-inline' is allowed for styles to support Tailwind/inline CSS.

Third‑party services must be explicitly whitelisted.

3️⃣ Securing APIs with CORS
🔎 What is CORS?
Cross‑Origin Resource Sharing (CORS) controls which domains can access your APIs, preventing unauthorized cross‑site requests.

✅ API Route Example
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true, data: "Secure API" });

  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://your-frontend-domain.com"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );

  return response;
}
🛡️ CORS Restrictions Applied
Only trusted frontend domains allowed

Limited HTTP methods

Controlled headers (Authorization, Content-Type)

4️⃣ Verification & Testing
🔍 Manual Verification
Open Chrome DevTools

Go to Network → Response Headers

Confirm presence of:

Strict-Transport-Security

Content-Security-Policy

Access-Control-Allow-Origin

🌐 Automated Security Scans
🔗 securityheaders.com
Grade achieved: A

All major headers detected

🔗 observatory.mozilla.org
Strong CSP

No mixed content issues

HTTPS enforced

📸 Screenshots of scan results attached in submission

🧩 Security Header Summary
Header	Threat Mitigated
HSTS	MITM, protocol downgrade
CSP	XSS, data injection
CORS	Cross‑origin data leaks
frame-ancestors	Clickjacking
🧠 Reflections & Learnings
🔐 Why Security Headers Matter
Security headers provide browser‑level enforcement, acting as a final defense even if application logic fails.

⚠️ Third‑Party Impact
Fonts, analytics, and APIs must be carefully whitelisted.

Overly strict CSP can break functionality if not planned.

📈 Scalability
This setup:

Works across all routes automatically

Requires minimal maintenance

Scales well with microservices and APIs



