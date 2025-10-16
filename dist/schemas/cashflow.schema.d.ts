import { z } from 'zod';
export declare const TransactionTypeEnum: z.ZodEnum<{
    INCOME: "INCOME";
    EXPENSE: "EXPENSE";
}>;
export declare const createCashFlowSchema: z.ZodObject<{
    paymentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    userId: z.ZodString;
    type: z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    category: z.ZodString;
    amount: z.ZodNumber;
    description: z.ZodString;
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCashFlowSchema: z.ZodObject<{
    paymentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    userId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=cashflow.schema.d.ts.map