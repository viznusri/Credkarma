const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

admin.initializeApp();

const app = express();

// Connect to MongoDB
connectDB().catch(console.error);

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins in Firebase Functions
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const behaviorRoutes = require('./routes/behaviors');
const rewardRoutes = require('./routes/rewards');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/behaviors', behaviorRoutes);
app.use('/api/rewards', rewardRoutes);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);