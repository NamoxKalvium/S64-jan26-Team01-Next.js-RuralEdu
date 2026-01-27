Prisma ORM Setup & Client Initialization
📌 Overview

This assignment focuses on integrating Prisma ORM into a Next.js application and connecting it with a PostgreSQL database. Prisma acts as a type-safe database toolkit that simplifies database access, improves query reliability, and enhances developer productivity. This setup forms the foundation for handling all database models and queries in the project.

🛠️ Technologies Used

Next.js

Prisma ORM

PostgreSQL

Node.js

🚀 Setup Process
1. Install and Initialize Prisma

From the project root, Prisma was installed and initialized using the following commands:

npm install prisma --save-dev
npx prisma init


This created:

A /prisma folder containing schema.prisma

An .env file with the database connection string

DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

2. Define Database Models

Database models were defined in prisma/schema.prisma based on the project schema.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  createdAt DateTime  @default(now())
  projects  Project[]
}

model Project {
  id        Int      @id @default(autoincrement())
  name      String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}

3. Generate Prisma Client

After saving the schema, the Prisma Client was generated using:

npx prisma generate


This client enables type-safe database queries throughout the application.

4. Prisma Client Initialization

To prevent multiple Prisma instances during development, a reusable Prisma client was created at src/lib/prisma.ts:

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

5. Testing the Database Connection

A simple query was used to verify the Prisma setup and database connection:

import { prisma } from '@/lib/prisma';

export async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(users);
}


Running the application with npm run dev successfully fetched data from the database, confirming that the Prisma client and PostgreSQL connection were working correctly.

✅ Deliverables Completed

Prisma installed and initialized successfully

Database models defined in schema.prisma

Prisma Client generated

Database connection tested and verified

Prisma client reuse implemented to avoid multiple instances

💡 Reflection

Using Prisma ORM significantly improves the development experience by providing:

Type safety, reducing runtime errors

Auto-generated queries, making database interactions simpler

Better maintainability with a single source of truth for the schema

Higher productivity due to clear models and predictable queries

Overall, Prisma makes database handling more reliable, scalable, and developer-friendly in full-stack applications.