# Database Setup Instructions

## Current Status
✅ `.env` file has been updated with your database credentials
✅ Dependencies installed
✅ Prisma client generated

## Next Steps (Manual)

### Option 1: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server (localhost:5432)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `ruraledudb`
5. Click "Save"

### Option 2: Using psql (Command Line)
If you have psql in your PATH, run:
```bash
psql -U postgres
```
Then enter your password (`saanvi5698`) and run:
```sql
CREATE DATABASE ruraledudb;
\q
```

### Option 3: Using the provided script
After ensuring PostgreSQL is running, you can use:
```bash
node create-db.js
```

## After Database is Created

Once the database exists, run:
```bash
npm run db:push
```

This will create all the tables in your database.

## Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting

### "Authentication failed"
- Verify PostgreSQL is running (check Windows Services)
- Double-check the password in `.env` matches your PostgreSQL password
- Try connecting with pgAdmin to verify credentials

### "Database does not exist"
- Create the database using one of the options above

### "Connection refused"
- Ensure PostgreSQL service is running
- Check if port 5432 is correct
- Verify firewall settings
