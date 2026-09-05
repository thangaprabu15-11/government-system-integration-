const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with automatic fallback to store for instant hackathon execution)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const consentRoutes = require('./routes/consentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const aiRoutes = require('./routes/aiRoutes');
const mockGovApis = require('./mock-government/mockGovernmentApis');

// API Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mapping', mappingRoutes);
app.use('/api/ai', aiRoutes);

// Mock Government APIs Layer
app.use('/mock-api', mockGovApis);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'CivicBridge AI Orchestration Platform',
    version: '1.0.0-PROTOTYPE',
    timestamp: new Date(),
    servicesConnected: 6,
    mockGovApisStatus: 'ACTIVE'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CivicBridge Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error in CivicBridge Layer',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏛  CivicBridge AI Backend Running on Port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🏛 Mock Gov APIs: http://localhost:${PORT}/mock-api`);
    console.log(`👤 Demo Citizen: demo@civicbridge.ai / Demo@123`);
    console.log(`👑 Demo Admin: admin@civicbridge.ai / Admin@123`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
