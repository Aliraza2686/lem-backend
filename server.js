import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import visitorRoutes from './routes/visitorRoutes.js';
import userRoutes from './routes/userRoutes.js';

import sgMail from "@sendgrid/mail";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://admin.luminaearthminerals.com",
  "https://www.luminaearthminerals.com",
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Routes
app.use("/api", contactRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/users', userRoutes);

app.get("/test", (req, res) => {
  res.json({ test: "running" });
});

// ✅ Start server only after DB connects
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();