import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import visitorRoutes from './routes/visitorRoutes.js';
import userRoutes from './routes/userRoutes.js';

import sgMail from "@sendgrid/mail";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
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