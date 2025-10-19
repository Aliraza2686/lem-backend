import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import sgMail from "@sendgrid/mail";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Routes
app.use("/api", contactRoutes); // all routes in contactRoutes will be prefixed with /api

// Test route
app.get("/test", (req, res) => {
  res.json({ test: "running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
