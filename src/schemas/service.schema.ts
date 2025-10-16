import { z } from 'zod';

export const ServiceStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'WAITING_PARTS']);

export const createServiceSchema = z.object({
  customerId: z.string().uuid('Customer ID inválido'),
  motorcycleId: z.string().uuid('Motorcycle ID inválido'),
  userId: z.string().uuid('User ID inválido'),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  diagnosis: z.string().optional().nullable(),
  status: ServiceStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  estimatedEndDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  laborCost: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional(),
  notes: z.string().optional().nullable(),
});

export const updateServiceSchema = z.object({
  customerId: z.string().uuid('Customer ID inválido').optional(),
  motorcycleId: z.string().uuid('Motorcycle ID inválido').optional(),
  userId: z.string().uuid('User ID inválido').optional(),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional(),
  diagnosis: z.string().optional().nullable(),
  status: ServiceStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  estimatedEndDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  laborCost: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional(),
  notes: z.string().optional().nullable(),
});

export const createServiceItemSchema = z.object({
  serviceId: z.string().uuid('Service ID inválido'),
  productId: z.string().uuid('Product ID inválido').optional().nullable(),
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser positivo'),
  totalPrice: z.number().min(0, 'Preço total deve ser positivo'),
  isLabor: z.boolean().optional(),
});
