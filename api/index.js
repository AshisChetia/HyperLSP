import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../Backend/config/db.js";
import authRoutes from "../Backend/Routes/authRoutes.js";
import serviceRoutes from "../Backend/Routes/serviceRoutes.js";
import providerRoutes from "../Backend/Routes/providerRoutes.js";
import bookingRoutes from "../Backend/Routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Routes
app.get('/api', (req, res) => {
    res.json({ message: "HyperLSP API is running" });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
});

export default app;
