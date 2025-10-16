"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCashFlowSchema = exports.createCashFlowSchema = exports.TransactionTypeEnum = void 0;
const zod_1 = require("zod");
exports.TransactionTypeEnum = zod_1.z.enum(['INCOME', 'EXPENSE']);
exports.createCashFlowSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid('Payment ID inválido').optional().nullable(),
    userId: zod_1.z.string().uuid('User ID inválido'),
    type: exports.TransactionTypeEnum,
    category: zod_1.z.string().min(3, 'Categoria deve ter no mínimo 3 caracteres'),
    amount: zod_1.z.number().min(0, 'Valor deve ser positivo'),
    description: zod_1.z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
    date: zod_1.z.string().datetime().optional(),
});
exports.updateCashFlowSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid('Payment ID inválido').optional().nullable(),
    userId: zod_1.z.string().uuid('User ID inválido').optional(),
    type: exports.TransactionTypeEnum.optional(),
    category: zod_1.z.string().min(3, 'Categoria deve ter no mínimo 3 caracteres').optional(),
    amount: zod_1.z.number().min(0, 'Valor deve ser positivo').optional(),
    description: zod_1.z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional(),
    date: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=cashflow.schema.js.map