require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { sendSuccess, sendError } = require('./utils/response');
const { HTTP_STATUS } = require('./utils/constants');

// ─── Import Route Modules ───────────────────────────────────────────────────────
// Routes will be uncommented as each module is built
const authRoutes = require('./modules/auth/auth.routes');
const { serviceRouter, subRouter, rateCardRouter } = require('./modules/service/service.routes');
const userRoutes = require('./modules/user/user.routes');
const ustadRoutes = require('./modules/ustad/ustad.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const reviewRoutes = require('./modules/review/review.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const { paymentRouter, walletRouter } = require('./modules/payment/payment.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

// ─── Trust proxy (important for rate limiting behind reverse proxy) ──────────
app.set('trust proxy', 1);

// ─── Security Middleware ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS Configuration ─────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Request Logging ────────────────────────────────────────────────────────────
app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')
);

// ─── Body Parsers ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Global Rate Limiter ────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Health Check (Public) ──────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }, 'Ustad Online API is running');
});

// ─── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/sub-services', subRouter);
app.use('/api/v1/rate-cards', rateCardRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ustads', ustadRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── 404 Handler (Express 5 compatible — no wildcard needed) ───────────────────
app.use((req, res, next) => {
  sendError(
    res,
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`,
    'ROUTE_NOT_FOUND'
  );
});

// ─── Centralized Error Handler (must be last) ───────────────────────────────────
app.use(errorHandler);

module.exports = app;
