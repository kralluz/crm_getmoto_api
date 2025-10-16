import { z } from 'zod';
import { timestampsSchema, uuidSchema } from './common.schema';

// Input schemas
export const createCustomerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
  email: z.string().email('Email inválido').toLowerCase().optional().nullable(),
  phone: z.string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .max(15, 'Telefone muito longo')
    .regex(/^[0-9]+$/, 'Telefone deve conter apenas números'),
  cpf: z.string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^[0-9]+$/, 'CPF deve conter apenas números')
    .optional()
    .nullable(),
  address: z.string().max(500, 'Endereço muito longo').optional().nullable(),
  city: z.string().max(100, 'Cidade muito longa').optional().nullable(),
  state: z.string()
    .length(2, 'Estado deve ter 2 caracteres')
    .toUpperCase()
    .optional()
    .nullable(),
  zipCode: z.string()
    .regex(/^[0-9]{8}$/, 'CEP inválido (8 dígitos)')
    .optional()
    .nullable(),
  notes: z.string().max(1000, 'Notas muito longas').optional().nullable(),
  active: z.boolean().default(true),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo').optional(),
  email: z.string().email('Email inválido').toLowerCase().optional().nullable(),
  phone: z.string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .max(15, 'Telefone muito longo')
    .regex(/^[0-9]+$/, 'Telefone deve conter apenas números')
    .optional(),
  cpf: z.string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^[0-9]+$/, 'CPF deve conter apenas números')
    .optional()
    .nullable(),
  address: z.string().max(500, 'Endereço muito longo').optional().nullable(),
  city: z.string().max(100, 'Cidade muito longa').optional().nullable(),
  state: z.string()
    .length(2, 'Estado deve ter 2 caracteres')
    .toUpperCase()
    .optional()
    .nullable(),
  zipCode: z.string()
    .regex(/^[0-9]{8}$/, 'CEP inválido (8 dígitos)')
    .optional()
    .nullable(),
  notes: z.string().max(1000, 'Notas muito longas').optional().nullable(),
  active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Response schemas
export const customerResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  email: z.string().email().nullable(),
  phone: z.string(),
  cpf: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),
  notes: z.string().nullable(),
  active: z.boolean(),
}).merge(timestampsSchema);
