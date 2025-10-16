"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMotorcycleSchema = exports.createMotorcycleSchema = void 0;
const zod_1 = require("zod");
exports.createMotorcycleSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid('Customer ID inválido'),
    brand: zod_1.z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
    model: zod_1.z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
    year: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1),
    plate: zod_1.z.string().min(7, 'Placa deve ter no mínimo 7 caracteres'),
    color: zod_1.z.string().optional().nullable(),
    mileage: zod_1.z.number().int().min(0).optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    active: zod_1.z.boolean().optional(),
});
exports.updateMotorcycleSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid('Customer ID inválido').optional(),
    brand: zod_1.z.string().min(2, 'Marca deve ter no mínimo 2 caracteres').optional(),
    model: zod_1.z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres').optional(),
    year: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    plate: zod_1.z.string().min(7, 'Placa deve ter no mínimo 7 caracteres').optional(),
    color: zod_1.z.string().optional().nullable(),
    mileage: zod_1.z.number().int().min(0).optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    active: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=motorcycle.schema.js.map