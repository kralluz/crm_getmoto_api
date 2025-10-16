import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodString;
    cpf: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    zipCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateCustomerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodString>;
    cpf: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    zipCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const customerResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    phone: z.ZodString;
    cpf: z.ZodNullable<z.ZodString>;
    address: z.ZodNullable<z.ZodString>;
    city: z.ZodNullable<z.ZodString>;
    state: z.ZodNullable<z.ZodString>;
    zipCode: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=customer.schema.d.ts.map