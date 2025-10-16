import { z } from 'zod';

export const createMotorcycleSchema = z.object({
  customerId: z.string().uuid('Customer ID inválido'),
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(7, 'Placa deve ter no mínimo 7 caracteres'),
  color: z.string().optional().nullable(),
  mileage: z.number().int().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export const updateMotorcycleSchema = z.object({
  customerId: z.string().uuid('Customer ID inválido').optional(),
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres').optional(),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres').optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  plate: z.string().min(7, 'Placa deve ter no mínimo 7 caracteres').optional(),
  color: z.string().optional().nullable(),
  mileage: z.number().int().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().optional(),
});
