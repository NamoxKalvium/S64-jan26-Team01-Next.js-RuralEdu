# Database Setup Guide - PostgreSQL with Prisma

## Prerequisites
- PostgreSQL installed and running on your system
- Node.js and npm installed

## Step 1: Create PostgreSQL Database

1. **Open PostgreSQL command line or pgAdmin**

2. **Create a new database:**
   ```sql
   CREATE DATABASE ruraledu;
   ```

3. **Verify database was created:**
   ```sql
   \l
   ```
   (You should see `ruraledu` in the list)

## Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your PostgreSQL credentials:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ruraledu?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   NODE_ENV="development"
   ```

   **Replace:**
   - `username` - Your PostgreSQL username (usually `postgres`)
   - `password` - Your PostgreSQL password
   - `localhost:5432` - Your PostgreSQL host and port (default is 5432)
   - `ruraledu` - Database name (should match what you created)

   **Example:**
   ```env
   DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/ruraledu?schema=public"
   JWT_SECRET="my-super-secret-jwt-key-12345"
   ```

## Step 3: Generate Prisma Client

```bash
npm run db:generate
```

This creates the Prisma Client based on your schema.

## Step 4: Push Schema to Database

```bash
npm run db:push
```

This creates the `User` table in your PostgreSQL database.

**OR use migrations (recommended for production):**
```bash
npm run db:migrate
```
This will prompt you to name your migration (e.g., "init_user_schema")

## Step 5: Verify Setup

1. **Open Prisma Studio to view your database:**
   ```bash
   npm run db:studio
   ```
   This opens a web interface at `http://localhost:5555` where you can see your tables and data.

2. **Or check via PostgreSQL:**
   ```sql
   \c ruraledu
   \dt
   ```
   You should see the `User` table.

## Step 6: Test the API

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected Route)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Endpoints

### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional, defaults to "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/auth/login`
Login and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Troubleshooting

### Error: "Can't reach database server"
- Check if PostgreSQL is running: `pg_isready` or check services
- Verify connection string in `.env`
- Check if port 5432 is correct

### Error: "relation does not exist"
- Run `npm run db:push` to create tables
- Or run `npm run db:migrate` for migrations

### Error: "password authentication failed"
- Double-check your PostgreSQL username and password in `.env`
- Try resetting PostgreSQL password if needed

### Error: "database does not exist"
- Create the database: `CREATE DATABASE ruraledu;`
- Or change database name in `.env`

## Database Schema

### User Table
- `id` (String, Primary Key) - Unique user ID
- `name` (String) - User's full name
- `email` (String, Unique) - User's email address
- `password` (String) - Hashed password (bcrypt)
- `role` (String) - User role: "student" or "teacher"
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Next Steps

1. ✅ Database is set up
2. ✅ User authentication is working
3. 🔄 Integrate with frontend login/signup forms
4. 🔄 Add protected routes
5. 🔄 Add more models (Course, Lesson, Progress, etc.)

## Useful Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# View database in terminal
psql -U postgres -d ruraledu
```
