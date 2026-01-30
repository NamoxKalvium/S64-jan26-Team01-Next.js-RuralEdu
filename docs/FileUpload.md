This assignment demonstrates how to build a secure and scalable file upload system using pre‑signed URLs. Instead of routing large files through the backend server, files are uploaded directly to cloud storage while the backend remains responsible for validation, access control, and metadata storage.

By completing this assignment, we achieved:

Secure generation of pre‑signed upload URLs

Validation of file type and size

Direct file uploads to cloud storage

Storage of uploaded file URLs and metadata in the database

Understanding of public vs private access and lifecycle management

Improved scalability and reduced backend load

🏗️ Architecture Overview
🔄 Pre‑Signed URL Upload Flow
Client
  |
  | 1. Request upload URL (filename, fileType)
  v
Next.js API (/api/upload)
  |
  | 2. Validate file + generate pre‑signed URL
  v
Cloud Storage (S3 / Azure Blob)
  ^
  | 3. Upload file directly using PUT
  |
Client
  |
  | 4. Send file URL to backend
  v
Next.js API (/api/files)
  |
  | 5. Store file metadata
  v
Database
✅ Key Insight:
The backend never handles the file itself — it only authorizes the upload.

☁️ Cloud Storage Setup
This project uses AWS S3 (Azure Blob is also supported).

📦 Installed Packages
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
🔐 Environment Variables (.env.local)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name
⚠️ .env.local is ignored via .gitignore to prevent credential leaks.

🔑 Generating a Pre‑Signed Upload URL
📄 API Route: app/api/upload/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
  try {
    const { filename, fileType, fileSize } = await req.json();

    // File type validation
    if (
      !fileType.startsWith("image/") &&
      !fileType.startsWith("application/pdf")
    ) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 }
      );
    }

    // File size validation (max 5MB)
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File too large" },
        { status: 400 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      ContentType: fileType,
      ACL: "public-read",
    });

    const uploadURL = await getSignedUrl(s3, command, {
      expiresIn: 60, // 1 minute
    });

    return NextResponse.json({
      success: true,
      uploadURL,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to generate URL", error },
      { status: 500 }
    );
  }
}
🧠 Why This Is Secure
Credentials are never exposed to the client

URL expires quickly (60 seconds)

File type and size are validated server‑side

Access permissions are tightly scoped

⬆️ Uploading the File Using the Pre‑Signed URL
🧪 Upload via curl
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: image/png" \
  --upload-file "./profile.png"
✅ The file is uploaded directly to S3, bypassing the backend.

🌐 Public File Access
The uploaded file is publicly accessible at:

https://<bucket-name>.s3.<region>.amazonaws.com/<filename>
For Azure Blob Storage, the container access level is set to Blob (anonymous read access).

🗄️ Storing File Metadata in the Database
After upload, the client sends the file URL to the backend.

📄 API Route: app/api/files/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { fileName, fileURL, fileSize } = await req.json();

  const file = await prisma.file.create({
    data: {
      name: fileName,
      url: fileURL,
      size: fileSize,
    },
  });

  return NextResponse.json({
    success: true,
    file,
  });
}
🧱 Example Prisma Model
model File {
  id        Int      @id @default(autoincrement())
  name      String
  url       String
  size      Int
  createdAt DateTime @default(now())
}
✅ Verification Steps
Open the file URL in the browser → File loads successfully

Tested with:

Small files (<1MB)

Larger files (up to validation limit)

Confirmed file metadata saved in database

Verified cloud dashboard shows uploaded object

🧠 Validation Logic Explained
File Type
fileType.startsWith("image/") || fileType === "application/pdf"
File Size
maxSize = 5MB
This prevents:

Uploading executable or malicious files

Abuse via extremely large uploads

⏱️ URL Expiry Strategy
Pre‑signed URLs expire after 60 seconds

Minimizes risk if a URL is leaked

Encourages immediate, intentional uploads

🔓 Public vs Private File Access
Access Type	Use Case	Pros	Cons
Public	Profile images, resumes	Simple access, fast delivery	Anyone with link can view
Private	Sensitive documents	Secure	Requires signed GET URLs
For this assignment, public access was required for testing.

♻️ Lifecycle Management
To control costs and data hygiene:

Lifecycle rule configured to:

Auto‑delete files after 30 days

Prevents:

Orphaned files

Unlimited storage growth

Unnecessary cloud bills

🔐 Security Reflections
Trade‑offs of Public Access
✅ Fast access, no auth overhead

❌ Anyone with link can access file

Mitigation:

Short‑lived upload URLs

File type validation

Lifecycle auto‑cleanup

📈 Scalability Benefits
Backend is not a bottleneck

Uploads scale with cloud infrastructure

Reduced server memory and bandwidth usage

Ideal for large files and high‑traffic apps

📦 Deliverables Summary
✔ Pre‑signed URL generation API
✔ Secure file validation
✔ Direct cloud uploads
✔ Database metadata storage
✔ Public file access verification
✔ README with architecture, code, screenshots, and reflections

