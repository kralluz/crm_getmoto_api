import { z } from 'zod';
export declare const uuidSchema: z.ZodString;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const successResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"success">;
    data: z.ZodAny;
}, z.core.$strip>;
export declare const errorResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"error">;
    message: z.ZodString;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const timestampsSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=common.schema.d.ts.map