# Quick Start - Authentication Setup

## ✅ What's Been Set Up

1. **Prisma Schema** (`prisma/schema.prisma`)
   - User model with email, password, role
   - PostgreSQL database connection

2. **API Routes**
   - `POST /api/auth/signup` - Create new user
   - `POST /api/auth/login` - Login and get JWT token
   - `GET /api/auth/me` - Get current user (protected)

3. **Utilities**
   - Prisma Client (`src/lib/prisma.ts`)
   - JWT Auth helpers (`src/lib/auth.ts`)

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Database
```sql
CREATE DATABASE ruraledu;
```

### Step 2: Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ruraledu?schema=public"
```

### Step 3: Initialize Database
```bash
# Generate Prisma Client
npm run db:generate

# Create tables in database
npm run db:push
```

## 🧪 Test It

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get User (Protected)
```bash
# Replace YOUR_TOKEN with token from login response
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Next Steps

1. Create login/signup forms in frontend
2. Store JWT token in localStorage or httpOnly cookie
3. Add protected routes using the auth middleware
4. Integrate with existing home page

See `DATABASE_SETUP.md` for detailed instructions!
