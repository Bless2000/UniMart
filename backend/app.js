
  import express from 'express';
  import bcrypt from 'bcryptjs';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
  import cors from 'cors';
  import pool from './config/db.js'
  import authRoutes from './routes/auth.routes.js';

  dotenv.config();

  const app = express();

  // CORS: allow the Vite frontend (dev origin) to reach the API
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());

  // Auth Routes
app.use("/api/v1/auth", authRoutes);


  try {
      const result = await pool.query("SELECT NOW()");
      console.log("Database Connected");
      console.log(result.rows[0]);

  } catch (e) {
      console.log(e);
  }

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

