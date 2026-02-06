# Cloud Object Storage Integration (AWS S3 / Azure Blob)

## Overview
This project demonstrates how to configure **cloud-based object storage** using either **AWS S3** or **Azure Blob Storage** for secure file uploads and downloads in a **Next.js application**.

The implementation follows security best practices by:
- Keeping storage resources private
- Using **presigned URLs (AWS)** or **SAS URLs (Azure)**
- Applying least-privilege access control
- Validating file type and size before upload

---

## Object Storage Basics

Object storage is designed to store unstructured data such as images, videos, and documents at scale.

| Provider | Service | Structure | Secure Access |
|--------|--------|-----------|---------------|
| AWS | S3 | Bucket → Object | Presigned URL |
| Azure | Blob Storage | Container → Blob | SAS URL |

Each stored file is identified by a **unique key** and accessed securely via time-limited URLs instead of public exposure.

---

## Storage Resource Setup

### Option 1: AWS S3

1. Navigate to **AWS Console → S3 → Create Bucket**
2. Configure:
   - **Bucket name**: `kalvium-app-storage`
   - **Region**: Preferred region
   - **Block all public access**: Enabled
   - **Bucket versioning**: Optional
3. Create the bucket

### Option 2: Azure Blob Storage

1. Go to **Azure Portal → Storage Accounts → Create**
2. Configure:
   - **Storage account name**: `kalviumstorage123`
   - **Performance**: Standard
   - **Redundancy**: LRS
3. After creation:
   - Open **Containers**
   - Create container named `uploads`
   - Set **Public access level** to `Private`

---

## Access Permissions & Security

### AWS IAM Configuration

1. Go to **IAM → Users → Create User**
2. Attach minimal policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": ["arn:aws:s3:::kalvium-app-storage/*"]
    }
  ]
}
Generate Access Key ID and Secret Access Key

Store credentials securely in .env.local

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_BUCKET_NAME=kalvium-app-storage
Azure Blob Access (SAS)
Open Storage Account → Access Keys

Generate a Shared Access Signature (SAS)

Restrict permissions:

Read

Write

List

Set expiry time to minimize exposure

Principle of Least Privilege:
Only grant permissions required for uploads/downloads — never admin access.

Presigned URL Upload Flow
Why Presigned URLs?
Presigned (AWS) or SAS (Azure) URLs allow clients to upload files directly to cloud storage without exposing credentials.

AWS S3 – API Route
// pages/api/upload-url.js
import aws from 'aws-sdk';

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  const { fileName, fileType } = req.query;

  const uploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  });

  res.status(200).json({ uploadUrl });
}
Frontend Upload Logic
const res = await fetch(
  `/api/upload-url?fileName=${file.name}&fileType=${file.type}`
);
const { uploadUrl } = await res.json();

await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
});
Azure Blob Upload (Concept)
Generate SAS URL server-side using @azure/storage-blob

Upload from client using fetch() or axios

SAS token expires automatically

File Validation
Client-side validation ensures:

Reduced cloud costs

Improved security

Better user experience

if (!['image/png', 'image/jpeg'].includes(file.type)) {
  alert('Only PNG or JPEG files are allowed');
}

if (file.size > 2 * 1024 * 1024) {
  alert('File size exceeds 2MB');
}