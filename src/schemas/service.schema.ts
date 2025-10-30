import { z } from 'zod';

// Baseado nas tabelas service, service_order, services_realized e service_products do Prisma
// Tabela service é para serviços (ex: Troca de Pneu, Revisão)
// Tabela service_order é para ordens de serviço
// Tabela services_realized é para serviços realizados em uma ordem
// Tabela service_products é para produtos usados em uma ordem

// ck_service_order_status IN ('draft', 'in_progress', 'completed', 'cancelled')
export const ServiceStatusEnum = z.enum(['draft', 'in_progress', 'completed', 'cancelled']);

// Service (tabela service)
export const createServiceCategorySchema = z.object({
  service_name: z.string().min(3, 'Nome do serviço deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  service_cost: z.coerce.number().min(0, 'Custo do serviço deve ser positivo'),
  is_active: z.boolean().default(true),
});

export const updateServiceCategorySchema = z.object({
  service_name: z.string().min(3, 'Nome do serviço deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional(),
  service_cost: z.coerce.number().min(0, 'Custo do serviço deve ser positivo').optional(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Service Order (tabela service_order)
export const createServiceOrderSchema = z.object({
  service_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço deve ser positivo')).optional().nullable(),
  professional_name: z.string().min(3, 'Nome do profissional deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional().nullable(),
  vehicle_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do veículo deve ser positivo')).optional().nullable(),
  customer_name: z.string().min(3, 'Nome do cliente deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional().nullable(),
  service_description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  status: ServiceStatusEnum.default('draft'),
  estimated_labor_cost: z.coerce.number().min(0, 'Custo estimado deve ser positivo').optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateServiceOrderSchema = z.object({
  service_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço deve ser positivo')).optional().nullable(),
  professional_name: z.string().min(3, 'Nome do profissional deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional().nullable(),
  vehicle_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do veículo deve ser positivo')).optional().nullable(),
  customer_name: z.string().min(3, 'Nome do cliente deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional().nullable(),
  service_description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  status: ServiceStatusEnum.optional(),
  estimated_labor_cost: z.coerce.number().min(0, 'Custo estimado deve ser positivo').optional().nullable(),
  notes: z.string().optional().nullable(),
  finalized_at: z.coerce.date().optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Service Products (tabela service_products)
export const createServiceProductSchema = z.object({
  service_order_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da ordem de serviço deve ser positivo')),
  product_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do produto deve ser positivo')),
  product_qtd: z.coerce.number().min(0.001, 'Quantidade deve ser maior que zero'), // ck_service_products_qty > 0
});

// Services Realized (tabela services_realized)
export const createServiceRealizedSchema = z.object({
  service_order_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da ordem de serviço deve ser positivo')),
  service_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço deve ser positivo')),
  service_qtd: z.coerce.number().min(0.001, 'Quantidade deve ser maior que zero'), // ck_services_realized_qty > 0
});

// Response schemas
export const serviceCategoryResponseSchema = z.object({
  service_id: z.bigint().or(z.number()),
  service_name: z.string(),
  service_cost: z.number(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const serviceOrderResponseSchema = z.object({
  service_order_id: z.bigint().or(z.number()),
  service_id: z.bigint().or(z.number()).nullable(),
  professional_name: z.string().nullable(),
  vehicle_id: z.bigint().or(z.number()).nullable(),
  customer_name: z.string().nullable(),
  service_description: z.string().nullable(),
  diagnosis: z.string().nullable(),
  status: ServiceStatusEnum,
  finalized_at: z.date().or(z.string()).nullable(),
  estimated_labor_cost: z.number().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const serviceProductResponseSchema = z.object({
  service_product_id: z.bigint().or(z.number()),
  service_order_id: z.bigint().or(z.number()),
  product_id: z.bigint().or(z.number()),
  product_qtd: z.number(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const serviceRealizedResponseSchema = z.object({
  services_realized_id: z.bigint().or(z.number()),
  service_order_id: z.bigint().or(z.number()),
  service_id: z.bigint().or(z.number()),
  service_qtd: z.number(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// Types
export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;
export type UpdateServiceOrderInput = z.infer<typeof updateServiceOrderSchema>;
export type CreateServiceProductInput = z.infer<typeof createServiceProductSchema>;
export type CreateServiceRealizedInput = z.infer<typeof createServiceRealizedSchema>;
export type ServiceCategoryResponse = z.infer<typeof serviceCategoryResponseSchema>;
export type ServiceOrderResponse = z.infer<typeof serviceOrderResponseSchema>;
export type ServiceProductResponse = z.infer<typeof serviceProductResponseSchema>;
export type ServiceRealizedResponse = z.infer<typeof serviceRealizedResponseSchema>;
