const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const cruiseRoutes = require('./routes/cruiseRoutes');
const { connectDB } = require('./config/database');

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:4173', 'https://cruise-search-app.netlify.app', 'https://bucolic-bienenstitch-5bc00e.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
}));
app.use(express.json());

// Routes
app.use('/api', cruiseRoutes);
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/paymentToggle'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Initialize database and start server
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 