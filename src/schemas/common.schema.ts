import { z } from 'zod';

// Schema comum para UUID em params
export const uuidSchema = z.string().uuid('ID deve ser um UUID válido');

export const idParamSchema = z.object({
  id: uuidSchema,
});

// Schema de paginação
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Schema de resposta de sucesso genérico
export const successResponseSchema = z.object({
  status: z.literal('success'),
  data: z.any(),
});

// Schema de resposta de erro
export const errorResponseSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

// Schema base de timestamps
export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
