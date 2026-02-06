

## Objective

The goal of this assignment is to provision and configure a **managed PostgreSQL database** using a cloud provider (AWS RDS or Azure Database for PostgreSQL) and securely connect it to a **Next.js application**. This exercise focuses on understanding how production-ready databases are created, secured, connected, and maintained in real-world cloud environments.

Instead of managing raw database servers manually, this setup leverages managed services to handle backups, patching, monitoring, and scaling — allowing developers to focus on application logic.

---

## Why Managed Databases?

Managed database services abstract away operational complexity while providing enterprise-grade reliability.

Key benefits include:

* Automated backups and snapshots
* Built-in patch management and upgrades
* Monitoring and alerting
* Network-level security controls
* Easy vertical and horizontal scaling

### Service Comparison

| Provider | Service                       | Key Advantage                                          |
| -------- | ----------------------------- | ------------------------------------------------------ |
| AWS      | Amazon RDS (PostgreSQL)       | Deep integration with CloudWatch, autoscaling, and VPC |
| Azure    | Azure Database for PostgreSQL | Strong Azure IAM and networking integration            |

---

## Database Provisioning

### Option 1: AWS RDS (PostgreSQL)

**Configuration Used:**

* Engine: PostgreSQL
* Instance identifier: `nextjs-db`
* Instance class: Free tier / Dev-Test
* Region: Nearest available region
* Storage: Default (General Purpose SSD)
* Authentication: Username & password

**Steps Summary:**

1. AWS Console → RDS → Create Database
2. Select PostgreSQL engine
3. Choose Free Tier / Dev-Test template
4. Set database name, username, and password
5. Configure VPC and subnet group (default)
6. Enable public access (temporary, for testing only)
7. Create database and wait for provisioning

---

### Option 2: Azure Database for PostgreSQL

**Configuration Used:**

* Deployment: Single Server
* Server name: `nextjs-db-server`
* Compute tier: Basic / Free trial
* Region: Closest Azure region
* Authentication: Admin username & password

**Steps Summary:**

1. Azure Portal → Create Resource → Azure Database for PostgreSQL
2. Choose Single Server
3. Configure server name, region, admin credentials
4. Enable public access temporarily
5. Deploy and wait for completion

---

## Network & Security Configuration

### IP Allowlisting

To prevent unauthorized access, database connections were restricted using firewall rules:

* **AWS:** Security Group inbound rule

  * Type: PostgreSQL
  * Port: 5432
  * Source: My IP / App server IP

* **Azure:** PostgreSQL Firewall Rules

  * Allowed client IP addresses only

> ⚠️ Public access was enabled **only for testing**. In production, private VPC endpoints or service-to-service access should be used.

---

## Connecting PostgreSQL to Next.js

### Environment Configuration

The database connection string is stored securely using environment variables:

```
DATABASE_URL=postgresql://username:password@db-endpoint:5432/nextjsdb
```

* Stored in `.env.local`
* Excluded from version control via `.gitignore`

---

### Database Client Setup (pg)

```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query("SELECT NOW()");
  return Response.json({ serverTime: result.rows[0] });
}
```

This confirms:

* Environment variables are loaded correctly
* Network access is working
* PostgreSQL instance is reachable

---

## External Verification

To validate connectivity outside the application:

### Using psql CLI

```
psql -h <db-endpoint> -U admin -d nextjsdb
```

### Using Admin Tools

* pgAdmin
* Azure Data Studio

Successful connection confirmed the database was reachable and correctly configured.

---

## Backups & Maintenance Strategy

### AWS RDS

* Automated daily backups enabled
* Backup retention: 7 days
* Maintenance window configured

### Azure PostgreSQL

* Daily automated backups enabled
* Retention policy configured via portal

Optional future enhancements:

* Read replicas for scaling
* Multi-AZ / high availability setup
* Automated failover

---

## Security Best Practices Followed

* No credentials committed to GitHub
* Environment variables used for secrets
* IP-based access control enforced
* Strong passwords configured
* Public access limited to development only

---

## Reflection & Learnings

### Public vs Private Access

* Public access simplifies development but increases attack surface
* Private endpoints are recommended for production environments

### Cost Considerations

* Free tier suitable for development and testing
* Production workloads require careful sizing and monitoring

### Scalability & Future Improvements

* Introduce Prisma ORM for schema management
* Add read replicas for high-traffic workloads
* Move secrets to cloud secret managers
* Integrate monitoring and alerts

---
