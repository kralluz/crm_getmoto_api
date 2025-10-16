"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.createPaymentSchema = exports.PaymentStatusEnum = exports.PaymentMethodEnum = void 0;
const zod_1 = require("zod");
exports.PaymentMethodEnum = zod_1.z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'CHECK']);
exports.PaymentStatusEnum = zod_1.z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']);
exports.createPaymentSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid('Service ID inválido'),
    amount: zod_1.z.number().min(0, 'Valor deve ser positivo'),
    method: exports.PaymentMethodEnum,
    status: exports.PaymentStatusEnum.optional(),
    dueDate: zod_1.z.string().datetime().optional().nullable(),
    paymentDate: zod_1.z.string().datetime().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.updatePaymentSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid('Service ID inválido').optional(),
    amount: zod_1.z.number().min(0, 'Valor deve ser positivo').optional(),
    method: exports.PaymentMethodEnum.optional(),
    status: exports.PaymentStatusEnum.optional(),
    dueDate: zod_1.z.string().datetime().optional().nullable(),
    paymentDate: zod_1.z.string().datetime().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
//# sourceMappingURL=payment.schema.js.map