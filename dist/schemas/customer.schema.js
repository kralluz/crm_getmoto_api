"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerResponseSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
// Input schemas
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
    email: zod_1.z.string().email('Email inválido').toLowerCase().optional().nullable(),
    phone: zod_1.z.string()
        .min(10, 'Telefone deve ter no mínimo 10 dígitos')
        .max(15, 'Telefone muito longo')
        .regex(/^[0-9]+$/, 'Telefone deve conter apenas números'),
    cpf: zod_1.z.string()
        .length(11, 'CPF deve ter 11 dígitos')
        .regex(/^[0-9]+$/, 'CPF deve conter apenas números')
        .optional()
        .nullable(),
    address: zod_1.z.string().max(500, 'Endereço muito longo').optional().nullable(),
    city: zod_1.z.string().max(100, 'Cidade muito longa').optional().nullable(),
    state: zod_1.z.string()
        .length(2, 'Estado deve ter 2 caracteres')
        .toUpperCase()
        .optional()
        .nullable(),
    zipCode: zod_1.z.string()
        .regex(/^[0-9]{8}$/, 'CEP inválido (8 dígitos)')
        .optional()
        .nullable(),
    notes: zod_1.z.string().max(1000, 'Notas muito longas').optional().nullable(),
    active: zod_1.z.boolean().default(true),
});
exports.updateCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo').optional(),
    email: zod_1.z.string().email('Email inválido').toLowerCase().optional().nullable(),
    phone: zod_1.z.string()
        .min(10, 'Telefone deve ter no mínimo 10 dígitos')
        .max(15, 'Telefone muito longo')
        .regex(/^[0-9]+$/, 'Telefone deve conter apenas números')
        .optional(),
    cpf: zod_1.z.string()
        .length(11, 'CPF deve ter 11 dígitos')
        .regex(/^[0-9]+$/, 'CPF deve conter apenas números')
        .optional()
        .nullable(),
    address: zod_1.z.string().max(500, 'Endereço muito longo').optional().nullable(),
    city: zod_1.z.string().max(100, 'Cidade muito longa').optional().nullable(),
    state: zod_1.z.string()
        .length(2, 'Estado deve ter 2 caracteres')
        .toUpperCase()
        .optional()
        .nullable(),
    zipCode: zod_1.z.string()
        .regex(/^[0-9]{8}$/, 'CEP inválido (8 dígitos)')
        .optional()
        .nullable(),
    notes: zod_1.z.string().max(1000, 'Notas muito longas').optional().nullable(),
    active: zod_1.z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
});
// Response schemas
exports.customerResponseSchema = zod_1.z.object({
    id: common_schema_1.uuidSchema,
    name: zod_1.z.string(),
    email: zod_1.z.string().email().nullable(),
    phone: zod_1.z.string(),
    cpf: zod_1.z.string().nullable(),
    address: zod_1.z.string().nullable(),
    city: zod_1.z.string().nullable(),
    state: zod_1.z.string().nullable(),
    zipCode: zod_1.z.string().nullable(),
    notes: zod_1.z.string().nullable(),
    active: zod_1.z.boolean(),
}).merge(common_schema_1.timestampsSchema);
//# sourceMappingURL=customer.schema.js.map