📌 Overview
This assignment demonstrates the design and implementation of a normalized relational database schema using Prisma ORM with PostgreSQL.
It covers:

Identifying core entities

Designing relationships and constraints

Running migrations

Seeding initial data

Verifying and documenting the workflow

The goal is to build a scalable, clean database structure that supports real‑world query patterns while following normalization principles.

🧩 Core Entities Identified
1. User
Represents a registered user of the application.

Responsibilities

Owns projects

Acts as the primary account entity

Key Fields

id (Primary Key)

name

email (Unique)

2. Project
Represents an ongoing or completed project created by a user.

Responsibilities

Groups multiple tasks

Belongs to a single user

Key Fields

id (Primary Key)

name

createdAt

userId (Foreign Key → User)

3. Task
Represents an individual task within a project.

Responsibilities

Tracks work items

Has a status

Belongs to a project

Key Fields

id (Primary Key)

title

status

projectId (Foreign Key → Project)

🗂️ Prisma Schema Design
model User {
  id       Int       @id @default(autoincrement())
  name     String
  email    String    @unique
  projects Project[]
}

model Project {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     Task[]
}

model Task {
  id        Int     @id @default(autoincrement())
  title     String
  status    String
  projectId Int
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
🔑 Keys, Relationships & Constraints
Primary Keys
Each table uses an auto‑incremented integer id

Foreign Keys
Project.userId → User.id

Task.projectId → Project.id

Constraints
User.email is UNIQUE

Foreign keys enforce referential integrity

onDelete: Cascade ensures dependent records are removed automatically

Indexing
Unique index on email

Implicit indexes on foreign keys for faster joins

🧠 Normalization (1NF, 2NF, 3NF)
1NF: All fields are atomic (no arrays or repeating groups)

2NF: No partial dependency on composite keys

3NF: No transitive dependencies (each field depends only on the primary key)

✅ This design avoids redundancy and ensures data consistency.

🚀 Running Migrations
Step 1: Generate Initial Migration
npx prisma migrate dev --name init_schema
What this does

Creates database tables

Applies constraints and relationships

Generates SQL files in prisma/migrations/

Step 2: Verify Migration
npx prisma studio
Use Prisma Studio to visually inspect tables and relationships.

Step 3: Adding Future Changes
When modifying the schema later:

npx prisma migrate dev --name add_new_table
Each change is tracked as a separate migration, preserving history.

♻️ Resetting the Database (Development Only)
npx prisma migrate reset
Purpose

Drops all tables

Reapplies migrations from scratch

Reruns seed scripts

⚠️ Never use this in production, as it deletes data.

🌱 Database Seeding
Seed Script (prisma/seed.ts)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ],
    skipDuplicates: true,
  })

  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      userId: 1,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: 'Design Schema', status: 'OPEN', projectId: project.id },
      { title: 'Run Migration', status: 'IN_PROGRESS', projectId: project.id },
    ],
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
Add Seed Command in package.json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
Run Seeding
npx prisma db seed
🔍 Verification
Open Prisma Studio:

npx prisma studio
Confirm:

Users exist

Projects are linked to users

Tasks are linked to projects

Idempotency Check
Re-run:

npx prisma db seed
✔ Data does not duplicate due to skipDuplicates

🔐 Production Safety Considerations
Migrations are version‑controlled

No destructive commands (reset) used in production

Schema changes are additive and reversible

Seed scripts are safe and idempotent

📈 Scalability & Query Patterns
Common Queries Supported
Fetch all projects for a user

Fetch tasks for a project

Filter tasks by status

Join users → projects → tasks efficiently

Why This Scales
Clear relational boundaries

Indexed foreign keys

No redundant data

Easy to extend (comments, teams, roles)

🧪 Challenges & Fixes
ESLint v9 migration issues were resolved by using eslint.config.js

Prisma migration conflicts were fixed by resetting local DB

Ensured seed scripts are safe to re-run






