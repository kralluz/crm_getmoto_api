import { z } from 'zod';

// Schema comum para IDs (BigInt no banco, mas aceita number na API)
export const idSchema = z.coerce.bigint().or(z.coerce.number().int().positive('ID deve ser um número positivo'));

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número positivo'),
});

// Schema de paginação
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Página deve ser no mínimo 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limite deve ser no mínimo 1').max(100, 'Limite máximo é 100').default(10),
});

// Schema de query params para filtros
export const filterActiveSchema = z.object({
  is_active: z.coerce.boolean().optional(),
});

// Schema de resposta de sucesso genérico
export const successResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string().optional(),
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

// Schema base de timestamps (padrão do Prisma)
export const timestampsSchema = z.object({
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// Schema de resposta paginada
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
  data: z.array(itemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});
