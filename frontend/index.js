import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// TEST route (optional)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ STEP 5 — INSERT ROUTE
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
