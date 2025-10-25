import { z } from 'zod';

// Baseado nas tabelas products e stock_move do Prisma
// model Product {
//   product_id       BigInt
//   category_id      BigInt
//   product_name     String
//   quantity         Decimal @db.Decimal(12, 3)
//   quantity_alert   Decimal @db.Decimal(12, 3)
//   buy_price        Decimal @db.Decimal(12, 2)
//   sell_price       Decimal @db.Decimal(12, 2)
//   is_active        Boolean
//   created_at       DateTime
//   updated_at       DateTime
// }

// ck_stock_move_type IN ('ENTRY', 'EXIT', 'ADJUSTMENT')
export const StockMovementTypeEnum = z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT']);

// Input schemas
export const createProductSchema = z.object({
  category_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da categoria deve ser positivo')),
  product_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  quantity: z.coerce.number().min(0, 'Quantidade deve ser positiva').default(0),
  quantity_alert: z.coerce.number().min(0, 'Quantidade de alerta deve ser positiva').default(0),
  buy_price: z.coerce.number().min(0, 'Preço de compra deve ser positivo'),
  sell_price: z.coerce.number().min(0, 'Preço de venda deve ser positivo'),
  is_active: z.boolean().default(true),
}).refine((data) => data.sell_price >= data.buy_price, {
  message: 'Preço de venda deve ser maior ou igual ao preço de compra',
  path: ['sell_price'],
});

export const updateProductSchema = z.object({
  category_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da categoria deve ser positivo')).optional(),
  product_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional(),
  quantity: z.coerce.number().min(0, 'Quantidade deve ser positiva').optional(),
  quantity_alert: z.coerce.number().min(0, 'Quantidade de alerta deve ser positiva').optional(),
  buy_price: z.coerce.number().min(0, 'Preço de compra deve ser positivo').optional(),
  sell_price: z.coerce.number().min(0, 'Preço de venda deve ser positivo').optional(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

export const createStockMovementSchema = z.object({
  product_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do produto deve ser positivo')),
  user_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do usuário deve ser positivo')).optional().nullable(),
  move_type: StockMovementTypeEnum, // ck_stock_move_type IN ('ENTRY', 'EXIT', 'ADJUSTMENT')
  quantity: z.coerce.number().min(0.001, 'Quantidade deve ser maior que zero'), // ck_stock_move_qty > 0
  notes: z.string().max(500, 'Notas muito longas').optional().nullable(),
});

// Product Category schemas
export const createProductCategorySchema = z.object({
  product_category_name: z.string().min(3, 'Nome da categoria deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  is_active: z.boolean().default(true),
});

export const updateProductCategorySchema = z.object({
  product_category_name: z.string().min(3, 'Nome da categoria deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo').optional(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Response schemas
export const productResponseSchema = z.object({
  product_id: z.bigint().or(z.number()),
  category_id: z.bigint().or(z.number()),
  product_name: z.string(),
  quantity: z.number(),
  quantity_alert: z.number(),
  buy_price: z.number(),
  sell_price: z.number(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const productCategoryResponseSchema = z.object({
  product_category_id: z.bigint().or(z.number()),
  product_category_name: z.string(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const stockMovementResponseSchema = z.object({
  stock_move_id: z.bigint().or(z.number()),
  product_id: z.bigint().or(z.number()),
  user_id: z.bigint().or(z.number()).nullable(),
  move_type: StockMovementTypeEnum,
  quantity: z.number(),
  notes: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// Types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductCategoryResponse = z.infer<typeof productCategoryResponseSchema>;
export type StockMovementResponse = z.infer<typeof stockMovementResponseSchema>;
