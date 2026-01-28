Overview

In this task, the entire application stack — Next.js frontend, PostgreSQL database, and Redis cache — was containerized using Docker and Docker Compose.

The objective of this setup is to create a consistent local development environment that closely mirrors production and eliminates the common “it works on my machine” issue. With Docker, every team member can run the same stack with a single command, regardless of their local OS or configuration.

Tech Stack

Frontend: Next.js (Node.js 20)

Database: PostgreSQL 15

Cache: Redis 7

Containerization: Docker & Docker Compose

1. Dockerfile for Next.js Application

A Dockerfile was created in the project root to define how the Next.js app is built and run inside a container.

Dockerfile
# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build the app
COPY . .
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]

Explanation

Base Image (node:20-alpine)
Lightweight Node.js image optimized for production use.

WORKDIR /app
All application files and commands run inside this directory.

Dependency Installation
Copies only package.json and package-lock.json first to leverage Docker layer caching.

Build Step
Compiles the Next.js application using npm run build.

Port Exposure
Exposes port 3000, which is used by the Next.js server.

Startup Command
Runs the production server using npm run start.

2. Docker Compose Configuration

A docker-compose.yml file was created to orchestrate all services together.

docker-compose.yml
version: '3.9'

services:
  app:
    build: .
    container_name: nextjs_app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - localnet

  db:
    image: postgres:15-alpine
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - localnet

  redis:
    image: redis:7-alpine
    container_name: redis_cache
    ports:
      - "6379:6379"
    networks:
      - localnet

networks:
  localnet:
    driver: bridge

volumes:
  db_data:

3. Service Breakdown
3.1 Next.js App Service (app)

Builds the app using the local Dockerfile

Runs on port 3000

Uses environment variables to connect to PostgreSQL and Redis

Depends on database and cache services to start first

3.2 PostgreSQL Service (db)

Uses the official postgres:15-alpine image

Credentials and database name are set via environment variables

Data is persisted using a named Docker volume (db_data)

Exposes port 5432 for local access and debugging

3.3 Redis Service (redis)

Uses the lightweight redis:7-alpine image

Exposes port 6379

Acts as a cache/session store for the application

4. Networks & Volumes
Network (localnet)

A custom bridge network allows containers to communicate using service names (db, redis)

Improves isolation and avoids port conflicts

Volume (db_data)

Persists PostgreSQL data across container restarts

Prevents data loss when containers are rebuilt

5. Running the Application
Build and Start Containers
docker-compose up --build

Verification Steps

Application: http://localhost:3000

PostgreSQL: running on port 5432

Redis: running on port 6379

To confirm containers are running:

docker ps


📸 Screenshots or terminal logs showing:

Successful build

All containers running
are included in the submission.