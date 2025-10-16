import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
    static badRequest(message: string): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(message?: string): AppError;
    static conflict(message: string): AppError;
    static internal(message?: string): AppError;
}
export declare const errorHandler: (error: Error | AppError | ZodError, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.middleware.d.ts.map