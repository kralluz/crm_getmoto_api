"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message) {
        return new AppError(message, 400);
    }
    static unauthorized(message = 'Não autorizado') {
        return new AppError(message, 401);
    }
    static forbidden(message = 'Acesso negado') {
        return new AppError(message, 403);
    }
    static notFound(message = 'Recurso não encontrado') {
        return new AppError(message, 404);
    }
    static conflict(message) {
        return new AppError(message, 409);
    }
    static internal(message = 'Erro interno do servidor') {
        return new AppError(message, 500, false);
    }
}
exports.AppError = AppError;
const handleZodError = (error) => {
    const errors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
    return {
        statusCode: 400,
        message: 'Erro de validação',
        errors,
    };
};
const handlePrismaError = (error) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                // Unique constraint violation
                const field = error.meta?.target;
                return {
                    statusCode: 409,
                    message: `${field ? field.join(', ') : 'Campo'} já existe`,
                };
            case 'P2025':
                // Record not found
                return {
                    statusCode: 404,
                    message: 'Registro não encontrado',
                };
            case 'P2003':
                // Foreign key constraint violation
                return {
                    statusCode: 400,
                    message: 'Referência inválida',
                };
            case 'P2014':
                // Invalid ID
                return {
                    statusCode: 400,
                    message: 'ID inválido',
                };
            default:
                return {
                    statusCode: 400,
                    message: 'Erro no banco de dados',
                };
        }
    }
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return {
            statusCode: 400,
            message: 'Erro de validação dos dados',
        };
    }
    return null;
};
const handleJWTError = (error) => {
    if (error.name === 'JsonWebTokenError') {
        return {
            statusCode: 401,
            message: 'Token inválido',
        };
    }
    if (error.name === 'TokenExpiredError') {
        return {
            statusCode: 401,
            message: 'Token expirado',
        };
    }
    return null;
};
const errorHandler = (error, _req, res, _next) => {
    // AppError - erro esperado da aplicação
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }
    // ZodError - erro de validação
    if (error instanceof zod_1.ZodError) {
        const { statusCode, message, errors } = handleZodError(error);
        return res.status(statusCode).json({
            status: 'error',
            message,
            errors,
        });
    }
    // Prisma errors
    const prismaError = handlePrismaError(error);
    if (prismaError) {
        return res.status(prismaError.statusCode).json({
            status: 'error',
            message: prismaError.message,
        });
    }
    // JWT errors
    const jwtError = handleJWTError(error);
    if (jwtError) {
        return res.status(jwtError.statusCode).json({
            status: 'error',
            message: jwtError.message,
        });
    }
    // Log de erro não tratado
    console.error('❌ Erro não tratado:', {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    // Erro genérico
    return res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development'
            ? error.message
            : 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map