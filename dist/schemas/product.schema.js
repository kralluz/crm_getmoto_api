"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementResponseSchema = exports.productResponseSchema = exports.createStockMovementSchema = exports.updateProductSchema = exports.createProductSchema = exports.StockMovementTypeEnum = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.StockMovementTypeEnum = zod_1.z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT']);
// Input schemas
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
    description: zod_1.z.string().max(1000, 'Descrição muito longa').optional().nullable(),
    brand: zod_1.z.string().max(100, 'Marca muito longa').optional().nullable(),
    code: zod_1.z.string().max(50, 'Código muito longo').optional().nullable(),
    barcode: zod_1.z.string().max(50, 'Código de barras muito longo').optional().nullable(),
    category: zod_1.z.string().max(100, 'Categoria muito longa').optional().nullable(),
    costPrice: zod_1.z.coerce.number().min(0, 'Preço de custo deve ser positivo'),
    salePrice: zod_1.z.coerce.number().min(0, 'Preço de venda deve ser positivo'),
    stockQuantity: zod_1.z.coerce.number().int().min(0, 'Quantidade em estoque deve ser positiva').default(0),
    minStock: zod_1.z.coerce.number().int().min(0, 'Estoque mínimo deve ser positivo').default(0),
    maxStock: zod_1.z.coerce.number().int().min(0, 'Estoque máximo deve ser positivo').optional().nullable(),
    unit: zod_1.z.string().max(10, 'Unidade muito longa').default('UN'),
    active: zod_1.z.boolean().default(true),
}).refine((data) => data.salePrice >= data.costPrice, {
    message: 'Preço de venda deve ser maior ou igual ao preço de custo',
    path: ['salePrice'],
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo').optional(),
    description: zod_1.z.string().max(1000, 'Descrição muito longa').optional().nullable(),
    brand: zod_1.z.string().max(100, 'Marca muito longa').optional().nullable(),
    code: zod_1.z.string().max(50, 'Código muito longo').optional().nullable(),
    barcode: zod_1.z.string().max(50, 'Código de barras muito longo').optional().nullable(),
    category: zod_1.z.string().max(100, 'Categoria muito longa').optional().nullable(),
    costPrice: zod_1.z.coerce.number().min(0, 'Preço de custo deve ser positivo').optional(),
    salePrice: zod_1.z.coerce.number().min(0, 'Preço de venda deve ser positivo').optional(),
    stockQuantity: zod_1.z.coerce.number().int().min(0, 'Quantidade em estoque deve ser positiva').optional(),
    minStock: zod_1.z.coerce.number().int().min(0, 'Estoque mínimo deve ser positivo').optional(),
    maxStock: zod_1.z.coerce.number().int().min(0, 'Estoque máximo deve ser positivo').optional().nullable(),
    unit: zod_1.z.string().max(10, 'Unidade muito longa').optional(),
    active: zod_1.z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
});
exports.createStockMovementSchema = zod_1.z.object({
    productId: common_schema_1.uuidSchema,
    type: exports.StockMovementTypeEnum,
    quantity: zod_1.z.coerce.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
    unitPrice: zod_1.z.coerce.number().min(0, 'Preço unitário deve ser positivo').optional().nullable(),
    totalPrice: zod_1.z.coerce.number().min(0, 'Preço total deve ser positivo').optional().nullable(),
    reason: zod_1.z.string().max(500, 'Motivo muito longo').optional().nullable(),
    reference: zod_1.z.string().max(100, 'Referência muito longa').optional().nullable(),
    date: zod_1.z.coerce.date().optional(),
});
// Response schemas
exports.productResponseSchema = zod_1.z.object({
    id: common_schema_1.uuidSchema,
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    brand: zod_1.z.string().nullable(),
    code: zod_1.z.string().nullable(),
    barcode: zod_1.z.string().nullable(),
    category: zod_1.z.string().nullable(),
    costPrice: zod_1.z.number(),
    salePrice: zod_1.z.number(),
    stockQuantity: zod_1.z.number().int(),
    minStock: zod_1.z.number().int(),
    maxStock: zod_1.z.number().int().nullable(),
    unit: zod_1.z.string(),
    active: zod_1.z.boolean(),
}).merge(common_schema_1.timestampsSchema);
exports.stockMovementResponseSchema = zod_1.z.object({
    id: common_schema_1.uuidSchema,
    productId: common_schema_1.uuidSchema,
    type: exports.StockMovementTypeEnum,
    quantity: zod_1.z.number().int(),
    unitPrice: zod_1.z.number().nullable(),
    totalPrice: zod_1.z.number().nullable(),
    reason: zod_1.z.string().nullable(),
    reference: zod_1.z.string().nullable(),
    date: zod_1.z.date(),
    createdAt: zod_1.z.date(),
});
//# sourceMappingURL=product.schema.js.map