import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeRouter } from './routes/analyze.js';

// Load .env with override to take precedence over shell env vars
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV === 'development';

// ── Startup Validation ────────────────────────────────────────
if (process.env.DEMO_MODE !== 'true') {
  const hasOpenAI = process.env.OPENAI_API_KEY?.startsWith('sk-');
  const hasGemini = process.env.GEMINI_API_KEY?.length >= 10;
  if (!hasOpenAI && !hasGemini) {
    console.warn('⚠️  No valid AI API keys found. Set DEMO_MODE=true in .env for demo data, or configure OPENAI_API_KEY / GEMINI_API_KEY.');
  }
}

// ── Security Headers (helmet) ─────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: isDev ? false : undefined,
}));

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  maxAge: 86400,
}));

app.use(express.json({ limit: '1mb' }));

// ── Production Auth Middleware ─────────────────────────────────
const authMiddleware = (req, res, next) => {
  if (isDev) return next();
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ── Rate Limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/analyze', limiter);

// ── Routes ────────────────────────────────────────────────────
app.use('/api/analyze', authMiddleware, analyzeRouter);

// Health check (no auth required)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global Error Handler (sanitized) ──────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ErrorHandler]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: isDev ? err.message : 'An internal error occurred',
    ...(isDev && { stack: err.stack }),
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ResumeIQ AI API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.DEMO_MODE === 'true') {
    console.log('   🧪 Demo Mode: ON (mock analysis data)');
  }
  console.log('');
});
