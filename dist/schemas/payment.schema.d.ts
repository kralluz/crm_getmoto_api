import { z } from 'zod';
export declare const PaymentMethodEnum: z.ZodEnum<{
    CASH: "CASH";
    CREDIT_CARD: "CREDIT_CARD";
    DEBIT_CARD: "DEBIT_CARD";
    PIX: "PIX";
    BANK_TRANSFER: "BANK_TRANSFER";
    CHECK: "CHECK";
}>;
export declare const PaymentStatusEnum: z.ZodEnum<{
    PENDING: "PENDING";
    CANCELLED: "CANCELLED";
    PAID: "PAID";
    OVERDUE: "OVERDUE";
}>;
export declare const createPaymentSchema: z.ZodObject<{
    serviceId: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodEnum<{
        CASH: "CASH";
        CREDIT_CARD: "CREDIT_CARD";
        DEBIT_CARD: "DEBIT_CARD";
        PIX: "PIX";
        BANK_TRANSFER: "BANK_TRANSFER";
        CHECK: "CHECK";
    }>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        CANCELLED: "CANCELLED";
        PAID: "PAID";
        OVERDUE: "OVERDUE";
    }>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    paymentDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updatePaymentSchema: z.ZodObject<{
    serviceId: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    method: z.ZodOptional<z.ZodEnum<{
        CASH: "CASH";
        CREDIT_CARD: "CREDIT_CARD";
        DEBIT_CARD: "DEBIT_CARD";
        PIX: "PIX";
        BANK_TRANSFER: "BANK_TRANSFER";
        CHECK: "CHECK";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        CANCELLED: "CANCELLED";
        PAID: "PAID";
        OVERDUE: "OVERDUE";
    }>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    paymentDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=payment.schema.d.ts.map