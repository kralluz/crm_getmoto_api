import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import logger from '../config/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = 'Não autorizado') {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Acesso negado') {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Recurso não encontrado') {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static internal(message: string = 'Erro interno do servidor') {
    return new AppError(message, 500, false);
  }
}

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return {
    statusCode: 400,
    message: 'Erro de validação',
    errors,
  };
};

const handlePrismaError = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const field = error.meta?.target as string[] | undefined;
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

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Erro de validação dos dados',
    };
  }

  return null;
};

const handleJWTError = (error: any) => {
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

export const errorHandler = (
  error: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // AppError - erro esperado da aplicação
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // ZodError - erro de validação
  if (error instanceof ZodError) {
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
  logger.error('Unhandled error', {
    name: error.name,
    message: error.message,
    stack: error.stack,
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
