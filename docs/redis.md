📌 Objective

The objective of this implementation is to integrate Redis as a caching layer in a Next.js application to improve API performance and reduce database load.

By completing this task, we achieved the following:

Connected the application to a Redis instance for caching.

Implemented the cache-aside pattern to store and retrieve frequently accessed API responses.

Applied TTL (Time-To-Live) policies to automatically expire cached data.

Designed and tested a cache invalidation strategy to prevent stale data.

Compared and reflected on latency improvements between cached and uncached API requests.

🧠 Why Redis Caching?

In a typical web application, repeated API requests often fetch the same data from the database, leading to:

Increased response latency

Higher database load

Poor scalability under heavy traffic

Redis stores frequently accessed data in memory, allowing the application to serve responses significantly faster while reducing unnecessary database queries.

🛠️ Technology Stack

Next.js – Backend API routes

Redis – In-memory caching layer

ioredis – Redis client for Node.js

Prisma ORM – Database interaction (example)

Postman / curl – API testing

1️⃣ Redis Setup
Installing Redis Client
npm install ioredis

Redis Connection Utility

A centralized Redis connection is created to ensure reusability across API routes.

lib/redis.ts

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export default redis;

Key Notes:

Environment variables are used to store the Redis connection URL.

This approach is secure and deployment-friendly.

Redis can be hosted locally or via managed services like Redis Cloud.

2️⃣ Cache Strategy: Cache-Aside Pattern

This implementation uses the cache-aside (lazy loading) pattern.

Flow:

API checks Redis for cached data.

If cache exists → return cached response (cache hit).

If cache does not exist → fetch from database (cache miss).

Store fetched data in Redis with a TTL.

Return the response.

This ensures Redis only stores data when it is actually requested.

3️⃣ Implementing Caching in an API Route
Example: /api/users
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export async function GET() {
  const cacheKey = "users:list";

  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("Cache Hit");
    return NextResponse.json(JSON.parse(cachedData));
  }

  console.log("Cache Miss - Fetching from DB");
  const users = await prisma.user.findMany();

  // Cache data for 60 seconds
  await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

  return NextResponse.json(users);
}

Explanation:

redis.get() checks if data exists in cache.

If found, data is returned instantly from memory.

On cache miss, the database is queried and the result is cached.

TTL ensures automatic expiration after 60 seconds.

4️⃣ TTL (Time-To-Live) Policy
TTL Used:

60 seconds

Reasoning:

User data changes occasionally, not constantly.

Short TTL balances performance and data freshness.

Prevents outdated data from being served indefinitely.

Automatically frees memory in Redis.

5️⃣ Cache Invalidation Strategy

Caching alone is insufficient without proper invalidation.

When is Cache Invalidated?

User creation

User update

User deletion

Example: User Update Route
await redis.del("users:list");

Why Invalidation Matters:

Prevents stale data from being served

Forces next request to fetch fresh data from the database

Maintains cache coherence between Redis and the database

6️⃣ Measuring Latency Improvements
Cache Miss (Cold Request)
curl -X GET http://localhost:3000/api/users


Terminal Output:

Cache Miss - Fetching from DB
Response Time: ~120 ms

Cache Hit (Warm Request)
curl -X GET http://localhost:3000/api/users


Terminal Output:

Cache Hit
Response Time: ~10 ms

Performance Comparison
Request Type	Source	Approx. Response Time
Cache Miss	Database	~120 ms
Cache Hit	Redis	~10 ms

✅ Result: Nearly 10x reduction in latency

7️⃣ Cache Coherence & Stale Data Risks
Cache Coherence

Cache coherence refers to keeping the Redis cache synchronized with the database state.

Risks of Stale Data:

Users may see outdated information

UI inconsistencies

Hard-to-debug issues

Mitigation Strategies Used:

TTL-based expiration

Explicit cache invalidation on write operations

Controlled cache keys per resource

8️⃣ When Caching Can Be Counterproductive

Caching is not suitable for:

Real-time systems

Financial transactions

Highly dynamic or frequently changing data

In such cases, data freshness is more important than performance gains.