import { z } from 'zod';

// Baseado na tabela vehicles do Prisma
// model vehicles {
//   vehicle_id    BigInt
//   brand         String?
//   model         String?
//   color         String?
//   plate         String (unique)
//   year          Int?
//   is_active     Boolean
//   created_at    DateTime
//   updated_at    DateTime
// }

export const createVehicleSchema = z.object({
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres').max(100, 'Marca muito longa').optional().nullable(),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres').max(100, 'Modelo muito longo').optional().nullable(),
  color: z.string().min(2, 'Cor deve ter no mínimo 2 caracteres').max(50, 'Cor muito longa').optional().nullable(),
  plate: z.string().min(7, 'Placa deve ter no mínimo 7 caracteres').max(10, 'Placa muito longa'),
  year: z.coerce.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano no futuro não permitido').optional().nullable(),
  is_active: z.boolean().default(true),
});

export const updateVehicleSchema = z.object({
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres').max(100, 'Marca muito longa').optional().nullable(),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres').max(100, 'Modelo muito longo').optional().nullable(),
  color: z.string().min(2, 'Cor deve ter no mínimo 2 caracteres').max(50, 'Cor muito longa').optional().nullable(),
  plate: z.string().min(7, 'Placa deve ter no mínimo 7 caracteres').max(10, 'Placa muito longa').optional(),
  year: z.coerce.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano no futuro não permitido').optional().nullable(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Response schema
export const vehicleResponseSchema = z.object({
  vehicle_id: z.bigint().or(z.number()),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  color: z.string().nullable(),
  plate: z.string(),
  year: z.number().int().nullable(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// Types
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;
