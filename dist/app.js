"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("express-async-errors");
const error_middleware_1 = require("./middlewares/error.middleware");
const rate_limit_middleware_1 = require("./middlewares/rate-limit.middleware");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
// Security middlewares
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)(corsOptions));
// Rate limiting
app.use('/api/', rate_limit_middleware_1.apiLimiter);
// Body parsing middlewares
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'CRM API GetMoto is running' });
});
// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
    try {
        const swaggerDocument = require('./swagger-output.json');
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    }
    catch (error) {
        console.log('Swagger documentation not generated yet. Run: npm run swagger');
    }
}
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cashflow_routes_1 = __importDefault(require("./routes/cashflow.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cashflow', cashflow_routes_1.default);
// Error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map