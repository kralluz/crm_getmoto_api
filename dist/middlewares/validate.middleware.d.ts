import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const uuidParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const validate: (schema: z.ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const validateBody: (schema: z.ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const validateParams: (schema: z.ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const validateQuery: (schema: z.ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middleware.d.ts.map