# Complete Checklist: Signup & Login Setup

## ✅ What's Already Done

1. ✅ **Environment Variables** - `.env` file configured with database credentials
2. ✅ **Dependencies** - All npm packages installed (bcryptjs, prisma, jose, etc.)
3. ✅ **Prisma Client** - Generated and ready
4. ✅ **Code Fixes** - Fixed `verifyToken` function and `/api/auth/me` route
5. ✅ **Frontend Pages** - Login and signup pages are implemented

## 🔧 What You Need to Complete

### 1. **PostgreSQL Database Setup** ⚠️ CRITICAL

**Step 1: Ensure PostgreSQL is Running**
- Check Windows Services for "postgresql" service
- Start it if it's not running
- Verify it's listening on port 5432

**Step 2: Create the Database**
You have 3 options:

**Option A: Using pgAdmin (Easiest)**
1. Open pgAdmin
2. Connect to your PostgreSQL server (localhost:5432)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `ruraledudb`
5. Click "Save"

**Option B: Using Command Line**
```bash
# If psql is in your PATH
psql -U postgres
# Enter password: saanvi5698
CREATE DATABASE ruraledudb;
\q
```

**Option C: Using Node.js Script**
I can create a script to do this automatically if needed.

**Step 3: Push Prisma Schema to Database**
```bash
cd frontend
npm run db:push
```

This will create the `User` table with the following structure:
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `fullName` (String, Optional)
- `password` (String, Hashed)
- `role` (String: "LEARNER", "TEACHER", "PARENT")
- `dateOfBirth` (DateTime, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 2. **Verify Environment Variables**

Check that your `.env` file has:
```env
DATABASE_URL="postgresql://postgres:saanvi5698@localhost:5432/ruraledudb?schema=public"
JWT_SECRET="ruraledu-secret-key-change-in-production"
NODE_ENV="development"

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=saanvi5698
DB_NAME=ruraledudb
```

### 3. **Start the Development Server**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## 🧪 Testing Signup & Login

### Test Signup Flow:
1. Navigate to `http://localhost:3000/signup`
2. Click "I'm a learner"
3. Enter date of birth
4. Fill in:
   - Full Name
   - Email
   - Password
5. Click "Sign Up"
6. Should redirect to `/dashboard` after successful signup

### Test Login Flow:
1. Navigate to `http://localhost:3000/login`
2. Enter email and password
3. Click "Log In"
4. Should redirect to `/dashboard` after successful login

## 📋 API Endpoints

### POST `/api/auth/signup`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "LEARNER",
  "dateOfBirth": "2000-01-01"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "LEARNER",
  "dateOfBirth": "2000-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/auth/login`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "LEARNER",
  "dateOfBirth": "2000-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
*Note: Sets an HTTP-only cookie named "session" with JWT token*

### GET `/api/auth/me`
**Headers:** Automatically uses session cookie

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "LEARNER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/auth/logout`
**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## 🔒 Security Features

1. **Password Hashing** - Uses bcryptjs with salt rounds of 10
2. **JWT Tokens** - Session tokens stored in HTTP-only cookies
3. **Token Expiration** - Tokens expire after 2 hours
4. **Middleware Protection** - `/dashboard` and `/home` routes are protected

## 🐛 Troubleshooting

### Error: "Authentication failed against database server"
- **Solution:** Verify PostgreSQL is running and credentials are correct
- Check Windows Services → PostgreSQL
- Try connecting with pgAdmin to verify credentials

### Error: "Database does not exist"
- **Solution:** Create the database using one of the methods above
- Then run `npm run db:push`

### Error: "relation does not exist"
- **Solution:** Run `npm run db:push` to create tables

### Error: "Cannot find module 'bcryptjs'"
- **Solution:** Run `npm install` in the frontend directory

### Login works but redirects back to login
- **Solution:** Check that middleware.ts is correctly configured
- Verify JWT_SECRET is set in .env
- Check browser console for cookie issues

### Signup succeeds but login fails
- **Solution:** Check that password hashing is working
- Verify the login route is correctly comparing passwords
- Check server logs for errors

## 📝 Summary

**Minimum Requirements for Signup/Login to Work:**
1. ✅ PostgreSQL database `ruraledudb` exists
2. ✅ Database tables created (`npm run db:push`)
3. ✅ `.env` file configured correctly
4. ✅ Development server running (`npm run dev`)

**Current Status:**
- ✅ Code is ready and fixed
- ✅ Dependencies installed
- ⚠️ **Database needs to be created** (this is the blocker)
- ⚠️ **Schema needs to be pushed** (after database is created)

Once you complete the database setup, everything should work!
