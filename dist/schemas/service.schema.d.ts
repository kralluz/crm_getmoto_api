import { z } from 'zod';
export declare const ServiceStatusEnum: z.ZodEnum<{
    PENDING: "PENDING";
    IN_PROGRESS: "IN_PROGRESS";
    COMPLETED: "COMPLETED";
    CANCELLED: "CANCELLED";
    WAITING_PARTS: "WAITING_PARTS";
}>;
export declare const createServiceSchema: z.ZodObject<{
    customerId: z.ZodString;
    motorcycleId: z.ZodString;
    userId: z.ZodString;
    description: z.ZodString;
    diagnosis: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        WAITING_PARTS: "WAITING_PARTS";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    estimatedEndDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    laborCost: z.ZodOptional<z.ZodNumber>;
    totalCost: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateServiceSchema: z.ZodObject<{
    customerId: z.ZodOptional<z.ZodString>;
    motorcycleId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    diagnosis: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        WAITING_PARTS: "WAITING_PARTS";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    estimatedEndDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    laborCost: z.ZodOptional<z.ZodNumber>;
    totalCost: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const createServiceItemSchema: z.ZodObject<{
    serviceId: z.ZodString;
    productId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    totalPrice: z.ZodNumber;
    isLabor: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=service.schema.d.ts.map