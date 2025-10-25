import { z } from 'zod';

// Baseado na tabela users do Prisma (ATUALIZADO com campos de auth)
// model User {
//   user_id       BigInt
//   name          String
//   email         String? @unique
//   password_hash String?
//   role          String? @default("ATTENDANT")
//   position      String?
//   is_active     Boolean
//   created_at    DateTime
//   updated_at    DateTime
// }

export const UserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT']);

// Input schemas
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
  role: UserRoleEnum.default('ATTENDANT'),
  position: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres').max(100, 'Cargo muito longo').optional().nullable(),
  is_active: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional(),
  email: z.string().email('Email inválido').toLowerCase().optional(),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa')
    .optional(),
  role: UserRoleEnum.optional(),
  position: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres').max(100, 'Cargo muito longo').optional().nullable(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Response schemas
export const userResponseSchema = z.object({
  user_id: z.bigint().or(z.number()),
  name: z.string(),
  email: z.string().email().nullable(),
  role: UserRoleEnum.nullable(),
  position: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    user_id: z.bigint().or(z.number()),
    name: z.string(),
    email: z.string().email(),
    role: UserRoleEnum,
  }),
});

// Para uso sem senha
export const userWithoutPasswordSchema = userResponseSchema;

// Types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
