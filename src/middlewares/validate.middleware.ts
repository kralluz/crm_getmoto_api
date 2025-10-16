import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Schema comum para validação de UUID em params
export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID deve ser um UUID válido'),
  }),
});

// Middleware de validação que usa o error handler global
export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      // Substitui os valores validados e parseados
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      // Passa o erro para o error handler global
      next(error);
    }
  };
};

// Middleware simplificado para validar apenas o body
export const validateBody = (schema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para validar params
export const validateParams = (schema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para validar query
export const validateQuery = (schema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
