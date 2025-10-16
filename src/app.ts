import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { errorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rate-limit.middleware';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();

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
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CRM API GetMoto is running' });
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
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import customerRoutes from './routes/customer.routes';
import serviceRoutes from './routes/service.routes';
import productRoutes from './routes/product.routes';
import cashFlowRoutes from './routes/cashflow.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cashflow', cashFlowRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
