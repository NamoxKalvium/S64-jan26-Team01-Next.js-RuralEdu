# Custom Domain & SSL (HTTPS) Configuration Guide

## Overview

This project demonstrates how to map a deployed application to a **custom domain** and secure it using **SSL/TLS encryption (HTTPS)**. The setup uses either:

* **AWS Route 53 + AWS Certificate Manager (ACM)**, or
* **Azure DNS + Azure App Service Certificates**

By completing this setup, the application is accessible via a custom domain (e.g., `https://myapp.com`) and served securely with a valid browser padlock icon (🔒).

This README documents the **DNS configuration**, **SSL certificate issuance**, **HTTPS enforcement**, and **verification steps**, along with key reflections on security and maintainability.

---

## Why Custom Domains & SSL Matter

* **Security**: SSL encrypts data between users and the application.
* **Trust**: The HTTPS padlock icon reassures users.
* **SEO**: Search engines prioritize HTTPS-enabled websites.
* **Professionalism**: Custom domains improve branding and credibility.

---

## Architecture Overview

| Component                | Purpose                                    | Example Services                         |
| ------------------------ | ------------------------------------------ | ---------------------------------------- |
| DNS (Domain Name System) | Maps domain names to application endpoints | AWS Route 53 / Azure DNS                 |
| SSL Certificate          | Encrypts traffic using HTTPS               | AWS ACM / Azure App Service Certificates |
| HTTPS Redirect           | Forces secure connections                  | Load Balancer / App Service Settings     |

---

## Step 1: Set Up or Connect a Domain

You can either:

* **Register a new domain** via:

  * AWS Route 53 → *Register Domain*
  * Azure App Service Domains → *Buy Domain*

**OR**

* **Connect an existing domain** from a registrar such as Namecheap or Google Domains.

### Actions Performed

1. Created a **Hosted Zone (AWS)** or **DNS Zone (Azure)**.
2. Copied the **Name Server (NS) records** provided by the cloud provider.
3. Updated these NS records in the domain registrar’s DNS settings.

> This step delegates DNS management to AWS or Azure.

---

## Step 2: Create DNS Records

Inside the hosted/DNS zone, the following records were created:

| Record Type | Name            | Value                         | Purpose             |
| ----------- | --------------- | ----------------------------- | ------------------- |
| A Record    | `myapp.com`     | Load Balancer DNS / Public IP | Root domain mapping |
| CNAME       | `www.myapp.com` | `myapp.com`                   | Subdomain redirect  |

### Verification Commands

```bash
nslookup myapp.com
ping myapp.com
```

> DNS propagation may take **10–15 minutes** (sometimes longer).

---

## Step 3: Request and Apply SSL Certificate

### Option A: AWS Certificate Manager (ACM)

1. Open **AWS Certificate Manager** → *Request Certificate*.
2. Choose **Public Certificate**.
3. Added domains:

   * `myapp.com`
   * `*.myapp.com`
4. Selected **DNS Validation**.
5. Added the generated **CNAME validation record** in Route 53.
6. Waited for certificate status to change to **Issued**.
7. Attached the certificate to:

   * Application Load Balancer / CloudFront / ECS Service.

### Option B: Azure App Service Certificate

1. Open **App Service → TLS/SSL Settings**.
2. Created an **App Service Managed Certificate**.
3. Added the custom domain under **Custom Domains**.
4. Bound the certificate under **TLS/SSL Bindings**.
5. Verified HTTPS activation.

> **Tip**: DNS validation is preferred because it supports automatic renewal with zero downtime.

---

## Step 4: Enforce HTTPS Redirects

### Platform-Level Enforcement

* **AWS**: Load Balancer Listener Rule

  * Redirect HTTP (Port 80) → HTTPS (Port 443)
* **Azure**: App Service → *HTTPS Only* → ON

### Application-Level (Next.js – Optional)

```js
module.exports = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'http' }],
        destination: 'https://myapp.com/:path*',
        permanent: true,
      },
    ];
  },
};
```

---

## Step 5: Verify SSL and Domain Mapping

Verification steps performed:

* Opened `https://myapp.com` in the browser
* Confirmed:

  * Padlock icon (🔒) in the address bar
  * Valid certificate details under **Connection → Certificate**
* Tested SSL configuration using **SSL Labs Test**

---

## Documentation & Evidence

The following evidence is included with this submission:

* Screenshots of:

  * Route 53 / Azure DNS record sets
  * SSL certificate status (**Issued**)
  * Browser showing HTTPS padlock icon
* Configuration summary of DNS records and SSL validation method

---

## Reflection & Learnings

* **Automated Renewal**: ACM and App Service certificates renew automatically, reducing operational overhead.
* **Environment Separation**: Using subdomains like `dev.myapp.com`, `api.myapp.com`, and `staging.myapp.com` improves scalability and clarity.
* **Cost Considerations**: Managed certificates are free, but hosted zones and traffic may incur minor costs.
* **Security Best Practice**: HTTPS-by-default is essential for compliance, trust, and production readiness.

---

## Deliverables Checklist

* Custom domain mapped to deployed application
* SSL/TLS certificate issued and applied
* HTTPS enforced with redirect from HTTP
* Browser shows valid HTTPS padlock (🔒)
* Updated README with documentation and reflections
* Short video demo showing DNS, SSL setup, and secure site access

---

## Final Note

A secure custom domain setup is more than branding—it’s a foundation for **trust, compliance, and professional cloud architecture**. Automating SSL renewals and maintaining clean DNS structures ensures long-term reliability and scalability.
