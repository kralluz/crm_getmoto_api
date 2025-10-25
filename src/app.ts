import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { errorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rate-limit.middleware';
import swaggerUi from 'swagger-ui-express';
import logger, { stream } from './config/logger';

const app: Express = express();

// HTTP Request logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream }));
} else {
  app.use(morgan('dev', { stream }));
}

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
import prisma from './config/prisma';

app.get('/health', async (_req, res) => {
  try {
    // Verificar conexão com banco de dados
    await prisma.$queryRaw`SELECT 1`;

    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      message: 'CRM API GetMoto is running',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)} minutes`,
      database: 'connected',
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  try {
    const swaggerDocument = require('./swagger-output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.log('Swagger documentation not generated yet. Run: npm run swagger');
  }
}

// Routes
// NOTA: Algumas rotas estão comentadas pois as tabelas não existem no banco de dados
// Ver SCHEMA_SYNC_SUMMARY.md e ERRORS_TO_FIX.md para mais detalhes

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
// import customerRoutes from './routes/customer.routes'; // DESABILITADO: tabela customers não existe
import serviceRoutes from './routes/service.routes';
import productRoutes from './routes/product.routes';
import cashFlowRoutes from './routes/cashflow.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/customers', customerRoutes); // DESABILITADO: tabela não existe, usar service_order.customer_name
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cashflow', cashFlowRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
