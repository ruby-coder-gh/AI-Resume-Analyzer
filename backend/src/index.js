import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeRouter } from './routes/analyze.js';

// Load .env with override to take precedence over shell env vars
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---

// CORS — allow the frontend dev server
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/analyze', limiter);

// --- Routes ---
app.use('/api/analyze', analyzeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[ErrorHandler]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`\n🚀 Resume Analyzer API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
