import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import serviceRoutes from "./Routes/serviceRoutes.js";
import providerRoutes from "./Routes/providerRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send("HyperLSP API is running")
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`JWT_SECRET exists: ${!!process.env.JWT_SECRET}`)
});