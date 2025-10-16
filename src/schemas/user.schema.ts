import { z } from 'zod';
import { timestampsSchema, uuidSchema } from './common.schema';

export const UserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT']);

// Input schemas
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
  role: UserRoleEnum.default('ATTENDANT'),
  active: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo').optional(),
  email: z.string().email('Email inválido').toLowerCase().optional(),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa')
    .optional(),
  role: UserRoleEnum.optional(),
  active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Response schemas
export const userResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  active: z.boolean(),
}).merge(timestampsSchema);

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: uuidSchema,
    name: z.string(),
    email: z.string().email(),
    role: UserRoleEnum,
  }),
});

// Para uso sem senha
export const userWithoutPasswordSchema = userResponseSchema;
