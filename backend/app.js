
  import express from 'express';
  import bcrypt from 'bcryptjs';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
  import pool from './config/db.js'
  import authRoutes from './routes/auth.routes.js';

  dotenv.config();

  const app = express();
  app.use(express.json());

  // Auth Routes
app.use("/api/v1/auth", authRoutes);


  try {
      const result = await pool.query("SELECT NOW()");
      console.log("Database Connected");
      console.log(result.row[0]);

  } catch (e) {
      console.log(e);
  }

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
