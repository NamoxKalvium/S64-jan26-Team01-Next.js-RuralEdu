# Containerized Deployment of a Next.js Application

## Overview

This project demonstrates how a Next.js application can be containerized using Docker and deployed to a managed cloud runtime. The goal of this assignment is to understand real-world deployment practices such as container orchestration, CI/CD automation, autoscaling, and operational considerations like cold starts, health checks, and resource sizing.

For this deployment, **AWS ECS with Fargate** was chosen as the cloud platform. However, the overall approach is equally applicable to Azure App Service for Containers.

---

## 1. Understanding Containerized Deployment

Containerization packages the application along with its runtime, dependencies, and configuration into a single, portable unit called a container. This ensures the application behaves consistently across development, testing, and production environments.

Using a managed container service such as AWS ECS or Azure App Service provides:

* Automated container scheduling and restarts
* Built-in health monitoring
* Easy horizontal scaling
* Simplified networking and load balancing

This approach reduces environment-specific issues and improves deployment reliability.

---

## 2. Dockerfile Configuration

A multi-stage Docker build was used to optimize image size and performance.

### Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Explanation

* **Builder stage** installs dependencies and builds the Next.js application.
* **Runtime stage** contains only the built application, reducing image size.
* Lightweight `node:alpine` images help minimize cold-start time and resource usage.

---

## 3. Building and Testing the Container Locally

The Docker image was built and tested locally before deploying to the cloud.

```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

The application was verified by accessing:

```
http://localhost:3000
```

This step ensured the app worked correctly inside a containerized environment.

---

## 4. Container Registry Setup (AWS ECR)

AWS Elastic Container Registry (ECR) was used to store the Docker image.

### Steps Performed

1. Created an ECR repository named `nextjs-app`.
2. Authenticated Docker with AWS ECR.
3. Tagged and pushed the Docker image.

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker tag nextjs-app:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest
```

---

## 5. Deployment to AWS ECS (Fargate)

### ECS Cluster

* Launch type: **Fargate**
* Serverless container execution (no EC2 management)

### Task Definition

* Container image: ECR image URL
* CPU: 0.25 vCPU
* Memory: 512 MB
* Port mapping: 3000

### Service Configuration

* Desired tasks: 1
* Auto-scaling: Enabled (min: 1, max: 3)
* Scaling policy: CPU utilization-based

Once deployed, the application was accessed through the ECS service endpoint / load balancer URL.

---

## 6. CI/CD Pipeline Configuration

A GitHub Actions workflow was used to automate the build and deployment process.

### CI/CD Flow

1. Code pushed to the repository
2. GitHub Actions triggers the workflow
3. Docker image is built
4. Image is pushed to AWS ECR
5. ECS service pulls the new image and redeploys tasks

### Example Workflow Snippet

```yaml
name: Deploy to AWS ECS
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Push Docker Image
        run: |
          docker build -t nextjs-app .
          docker tag nextjs-app ${{ secrets.ECR_REPO }}:latest
          docker push ${{ secrets.ECR_REPO }}:latest
```

This pipeline ensures consistent, repeatable, and automated deployments.

---

## 7. Validation and Monitoring

After deployment, the following validations were performed:

* Verified the public URL loads the application correctly
* Checked ECS task status and logs
* Monitored container health and restarts

Autoscaling behavior was tested by simulating increased traffic and observing task scaling within defined limits.

---

## 8. Deployment Considerations and Reflections

### Cold Starts

* Cold starts occur when new containers are launched during scaling.
* Optimizations used:

  * Lightweight base images
  * Smaller container size
  * Minimal runtime dependencies

### Health Checks

* ECS automatically replaces unhealthy containers.
* Proper port exposure and startup commands ensure reliable health reporting.

### Resource Sizing

* 0.25 vCPU and 512 MB memory provided a balance between performance and cost.
* Autoscaling prevents over-provisioning while handling traffic spikes.

### Real-World Learnings

* Containerization simplifies deployment consistency.
* CI/CD pipelines reduce manual errors and deployment time.
* Autoscaling and monitoring are essential for production-ready systems.

---

## Deliverables Summary

* Dockerfile with multi-stage build
* Container image stored in AWS ECR
* Deployed Next.js application on AWS ECS (Fargate)
* CI/CD pipeline using GitHub Actions
* Screenshots of ECS console and live application URL
* This README documenting deployment steps, scaling, and reflections

---

## Conclusion

This assignment highlights how modern web applications move from local development to cloud-native, production-ready systems. By combining Docker, managed container services, and CI/CD automation, the deployment becomes scalable, reliable, and maintainable, aligning closely with real-world industry practices.
