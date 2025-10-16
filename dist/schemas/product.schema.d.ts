import { z } from 'zod';
export declare const StockMovementTypeEnum: z.ZodEnum<{
    ENTRY: "ENTRY";
    EXIT: "EXIT";
    ADJUSTMENT: "ADJUSTMENT";
}>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    brand: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    barcode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    costPrice: z.ZodCoercedNumber<unknown>;
    salePrice: z.ZodCoercedNumber<unknown>;
    stockQuantity: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    minStock: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    maxStock: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    unit: z.ZodDefault<z.ZodString>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    brand: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    barcode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    costPrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    salePrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    stockQuantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    minStock: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxStock: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    unit: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const createStockMovementSchema: z.ZodObject<{
    productId: z.ZodString;
    type: z.ZodEnum<{
        ENTRY: "ENTRY";
        EXIT: "EXIT";
        ADJUSTMENT: "ADJUSTMENT";
    }>;
    quantity: z.ZodCoercedNumber<unknown>;
    unitPrice: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    totalPrice: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reference: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const productResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brand: z.ZodNullable<z.ZodString>;
    code: z.ZodNullable<z.ZodString>;
    barcode: z.ZodNullable<z.ZodString>;
    category: z.ZodNullable<z.ZodString>;
    costPrice: z.ZodNumber;
    salePrice: z.ZodNumber;
    stockQuantity: z.ZodNumber;
    minStock: z.ZodNumber;
    maxStock: z.ZodNullable<z.ZodNumber>;
    unit: z.ZodString;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const stockMovementResponseSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    type: z.ZodEnum<{
        ENTRY: "ENTRY";
        EXIT: "EXIT";
        ADJUSTMENT: "ADJUSTMENT";
    }>;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNullable<z.ZodNumber>;
    totalPrice: z.ZodNullable<z.ZodNumber>;
    reason: z.ZodNullable<z.ZodString>;
    reference: z.ZodNullable<z.ZodString>;
    date: z.ZodDate;
    createdAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=product.schema.d.ts.map