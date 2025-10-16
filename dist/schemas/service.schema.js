"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceItemSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.ServiceStatusEnum = void 0;
const zod_1 = require("zod");
exports.ServiceStatusEnum = zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'WAITING_PARTS']);
exports.createServiceSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid('Customer ID inválido'),
    motorcycleId: zod_1.z.string().uuid('Motorcycle ID inválido'),
    userId: zod_1.z.string().uuid('User ID inválido'),
    description: zod_1.z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
    diagnosis: zod_1.z.string().optional().nullable(),
    status: exports.ServiceStatusEnum.optional(),
    startDate: zod_1.z.string().datetime().optional(),
    estimatedEndDate: zod_1.z.string().datetime().optional().nullable(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    laborCost: zod_1.z.number().min(0).optional(),
    totalCost: zod_1.z.number().min(0).optional(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.updateServiceSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid('Customer ID inválido').optional(),
    motorcycleId: zod_1.z.string().uuid('Motorcycle ID inválido').optional(),
    userId: zod_1.z.string().uuid('User ID inválido').optional(),
    description: zod_1.z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional(),
    diagnosis: zod_1.z.string().optional().nullable(),
    status: exports.ServiceStatusEnum.optional(),
    startDate: zod_1.z.string().datetime().optional(),
    estimatedEndDate: zod_1.z.string().datetime().optional().nullable(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    laborCost: zod_1.z.number().min(0).optional(),
    totalCost: zod_1.z.number().min(0).optional(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.createServiceItemSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid('Service ID inválido'),
    productId: zod_1.z.string().uuid('Product ID inválido').optional().nullable(),
    description: zod_1.z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
    quantity: zod_1.z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
    unitPrice: zod_1.z.number().min(0, 'Preço unitário deve ser positivo'),
    totalPrice: zod_1.z.number().min(0, 'Preço total deve ser positivo'),
    isLabor: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=service.schema.js.map