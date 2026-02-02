📌 Overview

This project demonstrates how to integrate a transactional email service into a Next.js application using either:

AWS Simple Email Service (SES)
or

SendGrid

Transactional emails are essential for modern applications because they automatically notify users about critical events such as:

Signup confirmations

Password reset links

Payment receipts

Security alerts

By the end of this implementation, the application contains a fully functional email-sending API route, reusable templates, and documentation on handling real-world email delivery issues like sandbox mode, rate limits, and bounce tracking.

🚀 Why Transactional Emails Matter

Transactional emails improve user trust and engagement by providing instant communication during important actions.

Application Event	Transactional Email Type
User registers	Welcome Email
Password reset requested	Reset Link Email
Payment success	Invoice Confirmation
Suspicious login	Security Alert Email

Unlike marketing emails, transactional emails are:

✅ Trigger-based
✅ Sent automatically
✅ Required for account security and usability

⚙️ Provider Selection

This project supports two providers:

Feature	AWS SES	SendGrid
Pricing	Pay-per-email	Free tier (100/day)
Setup	Requires domain/email verification	Easier with API key
Best For	Backend automation, scalability	Rapid development
🛠 Setup & Configuration
✅ Option A: AWS SES Setup
Step 1: Verify Email or Domain

AWS SES requires verification before sending emails.

Go to AWS SES Console

Verify either:

Sender Email Address

Domain Name

Note: Sandbox accounts can only send emails to verified recipients.

Step 2: Add Environment Variables

Create a .env.local file:

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
SES_EMAIL_SENDER=no-reply@yourdomain.com

Step 3: Install SES SDK
npm install @aws-sdk/client-ses

✅ Option B: SendGrid Setup
Step 1: Create Account & API Key

Register at https://sendgrid.com

Go to Settings → API Keys

Generate a key with Full Access

Step 2: Verify Sender Email

Go to:

Settings → Sender Authentication

Verify the email address you will send from.

Step 3: Add Environment Variables
SENDGRID_API_KEY=your-api-key
SENDGRID_SENDER=no-reply@yourdomain.com

Step 4: Install SendGrid SDK
npm install @sendgrid/mail

📌 Email API Implementation

A Next.js API route was created to send transactional emails:

File Location
app/api/email/route.ts

AWS SES Implementation
import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: message } },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: process.env.SES_EMAIL_SENDER!,
    };

    const response = await ses.send(new SendEmailCommand(params));

    console.log("Email sent:", response.MessageId);

    return NextResponse.json({
      success: true,
      messageId: response.MessageId,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

SendGrid Implementation
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    await sendgrid.send({
      to,
      from: process.env.SENDGRID_SENDER!,
      subject,
      html: message,
    });

    console.log("Email successfully sent!");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

✉️ Email Template Example

A reusable welcome email template was created:

export const welcomeTemplate = (userName: string) => `
  <h2>Welcome to Kalvium, ${userName}!</h2>
  <p>We’re thrilled to have you onboard 🎉</p>
  <p>
    Start exploring here:
    <a href="https://app.kalvium.community">Kalvium Portal</a>
  </p>
  <hr/>
  <small>This is an automated email. Please do not reply.</small>
`;

🧪 Testing the Email API
Test Using Curl / Postman
curl -X POST http://localhost:3000/api/email \
-H "Content-Type: application/json" \
-d '{
  "to":"student@example.com",
  "subject":"Welcome!",
  "message":"<h3>Hello from Kalvium 🚀</h3>"
}'

Expected Response
{
  "success": true,
  "messageId": "01010189b2example123"
}

Console Output Proof
Email sent: 01010189b2example123


📸 Screenshot or log output should be included in submission as proof.

⚠️ Common Issues & Handling
Issue	Solution
Email not delivered	Check spam folder or sandbox restrictions
AWS SES Sandbox Mode	Verify recipient emails or request production access
Rate limit exceeded	Implement retry logic or queue system
Bounced emails	Monitor SES/SendGrid bounce dashboards
Slow response time	Avoid sending emails synchronously for high volume
📈 Rate Limits & Retry Strategy

AWS SES and SendGrid both enforce sending limits.

In production apps, email sending should use:

✅ Background jobs
✅ Message queues (BullMQ, SQS)
✅ Exponential backoff retries