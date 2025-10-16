import { z } from 'zod';
export declare const createMotorcycleSchema: z.ZodObject<{
    customerId: z.ZodString;
    brand: z.ZodString;
    model: z.ZodString;
    year: z.ZodNumber;
    plate: z.ZodString;
    color: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mileage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateMotorcycleSchema: z.ZodObject<{
    customerId: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    plate: z.ZodOptional<z.ZodString>;
    color: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mileage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=motorcycle.schema.d.ts.map