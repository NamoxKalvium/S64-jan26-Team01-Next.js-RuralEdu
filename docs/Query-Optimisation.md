Overview

As part of this assignment, advanced database practices were implemented in a Prisma ORM–based backend to improve data integrity, consistency, and performance as the application scales.

The work focuses on:

Using database transactions to ensure atomic operations

Implementing rollback logic to prevent partial writes

Optimizing Prisma queries to reduce over-fetching and latency

Adding database indexes for frequently queried fields

Measuring performance before and after optimization

Tech Stack

Backend ORM: Prisma

Database: PostgreSQL

Runtime: Node.js

Tools: Prisma Studio, Prisma Migrate, Query Logs

1. Database Transactions in Prisma
Why Transactions?

A transaction guarantees that multiple related database operations succeed or fail together.
This prevents inconsistent states such as:

An order created without inventory updates

A payment recorded without an associated order

Transaction Use Case: Order Placement

When a user places an order:

Create an order record

Update product inventory

(Optionally) record payment details

All steps must succeed together.

Prisma Transaction Example
const [order, inventory] = await prisma.$transaction([
  prisma.order.create({
    data: {
      userId,
      amount,
    },
  }),
  prisma.product.update({
    where: { id: productId },
    data: {
      stock: { decrement: 1 },
    },
  }),
]);

console.log("Transaction successful:", order, inventory);

Outcome

If any operation fails, Prisma automatically rolls back all changes

Prevents partial writes and corrupted data

2. Transaction Rollbacks & Error Handling
Why Rollbacks Matter

Without rollback logic:

Partial data may persist

Manual cleanup becomes necessary

Application state becomes unreliable

Transaction with Explicit Error Handling
try {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name: "Alice" },
    });

    await tx.order.create({
      data: {
        userId: user.id,
        total: 500,
      },
    });
  });
} catch (error) {
  console.error("Transaction failed. Rolling back.", error);
}

Rollback Verification

To test rollback behavior:

Invalid or incomplete data was intentionally introduced

Database state was verified after failure

No partial records were found in any table

✅ Confirms transactional atomicity.

3. Query Optimization Techniques
3.1 Avoiding Over-Fetching
Inefficient Query (Over-fetching)
const users = await prisma.user.findMany({
  include: {
    posts: true,
    orders: true,
  },
});

Optimized Query
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});


Benefit:

Reduced payload size

Faster response time

Lower memory usage

3.2 Batch Operations
Before (Multiple Inserts)
await prisma.user.create({ data: { name: "Alice" } });
await prisma.user.create({ data: { name: "Bob" } });

After (Batch Insert)
await prisma.user.createMany({
  data: [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
  ],
});


Benefit:

Fewer database round trips

Improved throughput

3.3 Pagination for Large Datasets
const users = await prisma.user.findMany({
  skip: 0,
  take: 10,
  orderBy: {
    createdAt: "desc",
  },
});


Benefit:

Prevents loading entire tables into memory

Essential for scalable APIs

4. Adding Indexes for Faster Queries
Why Indexes?

Indexes significantly improve:

Filtering (WHERE)

Sorting (ORDER BY)

Lookups on frequently queried columns

Prisma Schema with Indexes
model Order {
  id        Int      @id @default(autoincrement())
  userId    Int
  status    String
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([status])
}

Migration Command
npx prisma migrate dev --name add_indexes

Indexed Query Benefits
Query Type	Before Index	After Index
Filter by userId	Full table scan	Index scan
Filter by status	Slow	Optimized
Sorting by date	Costly	Faster
5. Monitoring & Performance Benchmarking
Enable Prisma Query Logs
DEBUG="prisma:query" npm run dev

Performance Comparison

Before Indexes

Full table scans

Higher query execution time

After Indexes

Index scans

Reduced execution time

📸 Logs and execution timing screenshots are included in the submission.

Optional Monitoring Tools

Prisma Studio

PostgreSQL EXPLAIN ANALYZE

PgHero

AWS RDS Performance Insights / Azure Query Performance

6. Anti-Patterns Avoided

❌ N+1 query problem

❌ Over-fetching related models

❌ Full table scans on high-traffic endpoints

❌ Multiple sequential writes instead of transactions

7. Production Monitoring Strategy (Reflection)

In a production environment, I would monitor:

Query latency (P95 / P99)

Slow queries via database logs

Error rates in transactions

Index usage and unused indexes

Database connection pool health

Alerts would be set up for:

Long-running queries

Transaction failures

Sudden increases in query time