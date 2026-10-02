const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userroutes');
const newsRoutes = require('./routes/news');
const videoRoutes = require('./routes/videoRoutes');
const fs = require('fs-extra');
const path = require('path');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Request and Response Logger Middleware
app.use((req, res, next) => {
    const logFile = path.join(process.cwd(), 'error.log');
    const timestamp = new Date().toISOString();
    const reqInfo = `${timestamp} - [REQUEST] ${req.method} ${req.url} - Auth: ${req.headers.authorization ? 'Present' : 'None'}\n`;
    try {
        fs.appendFileSync(logFile, reqInfo);
    } catch (err) {}
    
    const originalSend = res.send;
    res.send = function (body) {
        let respInfo = `${new Date().toISOString()} - [RESPONSE] ${req.method} ${req.url} - Status: ${res.statusCode}\n`;
        try {
            respInfo += `Response Body: ${body.toString().substring(0, 1000)}\n`;
        } catch (e) {
            respInfo += `Response Error: ${e.message}\n`;
        }
        try {
            fs.appendFileSync(logFile, respInfo);
        } catch (err) {}
        return originalSend.apply(res, arguments);
    };
    next();
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
    }
}));



// Routes
app.use('/api', userRoutes);
app.use('/api', newsRoutes);
app.use('/api/video', videoRoutes);

// Ensure directories exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const tempFramesDir = path.join(process.cwd(), 'temp/frames');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(tempFramesDir);



// Root route
app.get('/', (req, res) => {
    res.send('StreetWatch API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});