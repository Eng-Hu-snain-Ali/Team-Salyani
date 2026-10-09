require('dotenv').config();

const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// ─── Create HTTP Server ─────────────────────────────────────────────────────────
const httpServer = http.createServer(app);

// ─── Initialize Socket.io ───────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,     // 60s before considering client disconnected
  pingInterval: 25000,    // Send ping every 25s
});

// Attach io to app so modules can access it via req.app.get('io')
app.set('io', io);

// ─── Socket.io Handlers ────────────────────────────────────────────────────────
const initSocketHandlers = require('./src/socket');
initSocketHandlers(io);

// ─── Graceful Startup ───────────────────────────────────────────────────────────
const startServer = async () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║       USTAD ONLINE — BACKEND API         ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // Test DB connection before starting
  const dbOk = await testConnection();
  if (!dbOk) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Startup aborted: Could not connect to database');
      process.exit(1);
    } else {
      console.warn('⚠️  Database not connected — add your DATABASE_URL to .env to enable DB features');
      console.warn('⚠️  Server will start but database operations will fail');
    }
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Socket.io ready`);
    console.log(`💊 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API Base URL: http://localhost:${PORT}/api/v1`);
    console.log('');
  });
};

// ─── Graceful Shutdown ──────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received — shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// ─── Unhandled Errors ───────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
