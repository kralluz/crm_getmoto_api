import { z } from 'zod';
import { timestampsSchema, uuidSchema } from './common.schema';

export const StockMovementTypeEnum = z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT']);

// Input schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional().nullable(),
  brand: z.string().max(100, 'Marca muito longa').optional().nullable(),
  code: z.string().max(50, 'Código muito longo').optional().nullable(),
  barcode: z.string().max(50, 'Código de barras muito longo').optional().nullable(),
  category: z.string().max(100, 'Categoria muito longa').optional().nullable(),
  costPrice: z.coerce.number().min(0, 'Preço de custo deve ser positivo'),
  salePrice: z.coerce.number().min(0, 'Preço de venda deve ser positivo'),
  stockQuantity: z.coerce.number().int().min(0, 'Quantidade em estoque deve ser positiva').default(0),
  minStock: z.coerce.number().int().min(0, 'Estoque mínimo deve ser positivo').default(0),
  maxStock: z.coerce.number().int().min(0, 'Estoque máximo deve ser positivo').optional().nullable(),
  unit: z.string().max(10, 'Unidade muito longa').default('UN'),
  active: z.boolean().default(true),
}).refine((data) => data.salePrice >= data.costPrice, {
  message: 'Preço de venda deve ser maior ou igual ao preço de custo',
  path: ['salePrice'],
});

export const updateProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo').optional(),
  description: z.string().max(1000, 'Descrição muito longa').optional().nullable(),
  brand: z.string().max(100, 'Marca muito longa').optional().nullable(),
  code: z.string().max(50, 'Código muito longo').optional().nullable(),
  barcode: z.string().max(50, 'Código de barras muito longo').optional().nullable(),
  category: z.string().max(100, 'Categoria muito longa').optional().nullable(),
  costPrice: z.coerce.number().min(0, 'Preço de custo deve ser positivo').optional(),
  salePrice: z.coerce.number().min(0, 'Preço de venda deve ser positivo').optional(),
  stockQuantity: z.coerce.number().int().min(0, 'Quantidade em estoque deve ser positiva').optional(),
  minStock: z.coerce.number().int().min(0, 'Estoque mínimo deve ser positivo').optional(),
  maxStock: z.coerce.number().int().min(0, 'Estoque máximo deve ser positivo').optional().nullable(),
  unit: z.string().max(10, 'Unidade muito longa').optional(),
  active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

export const createStockMovementSchema = z.object({
  productId: uuidSchema,
  type: StockMovementTypeEnum,
  quantity: z.coerce.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
  unitPrice: z.coerce.number().min(0, 'Preço unitário deve ser positivo').optional().nullable(),
  totalPrice: z.coerce.number().min(0, 'Preço total deve ser positivo').optional().nullable(),
  reason: z.string().max(500, 'Motivo muito longo').optional().nullable(),
  reference: z.string().max(100, 'Referência muito longa').optional().nullable(),
  date: z.coerce.date().optional(),
});

// Response schemas
export const productResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  description: z.string().nullable(),
  brand: z.string().nullable(),
  code: z.string().nullable(),
  barcode: z.string().nullable(),
  category: z.string().nullable(),
  costPrice: z.number(),
  salePrice: z.number(),
  stockQuantity: z.number().int(),
  minStock: z.number().int(),
  maxStock: z.number().int().nullable(),
  unit: z.string(),
  active: z.boolean(),
}).merge(timestampsSchema);

export const stockMovementResponseSchema = z.object({
  id: uuidSchema,
  productId: uuidSchema,
  type: StockMovementTypeEnum,
  quantity: z.number().int(),
  unitPrice: z.number().nullable(),
  totalPrice: z.number().nullable(),
  reason: z.string().nullable(),
  reference: z.string().nullable(),
  date: z.date(),
  createdAt: z.date(),
});
