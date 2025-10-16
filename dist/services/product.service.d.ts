import { CreateProductInput, UpdateProductInput, CreateStockMovementInput } from '../interfaces/product.interface';
export declare class ProductService {
    create(data: CreateProductInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        code: string | null;
        description: string | null;
        brand: string | null;
        barcode: string | null;
        category: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        salePrice: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        minStock: number;
        maxStock: number | null;
        unit: string;
    }>;
    getAll(active?: boolean, lowStock?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        code: string | null;
        description: string | null;
        brand: string | null;
        barcode: string | null;
        category: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        salePrice: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        minStock: number;
        maxStock: number | null;
        unit: string;
    }[]>;
    getById(id: string): Promise<{
        stockMovements: {
            type: import(".prisma/client").$Enums.StockMovementType;
            id: string;
            date: Date;
            createdAt: Date;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal | null;
            totalPrice: import("@prisma/client/runtime/library").Decimal | null;
            reason: string | null;
            reference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        code: string | null;
        description: string | null;
        brand: string | null;
        barcode: string | null;
        category: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        salePrice: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        minStock: number;
        maxStock: number | null;
        unit: string;
    }>;
    update(id: string, data: UpdateProductInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        active: boolean;
        code: string | null;
        description: string | null;
        brand: string | null;
        barcode: string | null;
        category: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        salePrice: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        minStock: number;
        maxStock: number | null;
        unit: string;
    }>;
    delete(id: string): Promise<void>;
    addStockMovement(data: CreateStockMovementInput): Promise<{
        type: import(".prisma/client").$Enums.StockMovementType;
        id: string;
        date: Date;
        createdAt: Date;
        productId: string;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal | null;
        totalPrice: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        reference: string | null;
    }>;
    getStockMovements(productId?: string, startDate?: string, endDate?: string): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            active: boolean;
            code: string | null;
            description: string | null;
            brand: string | null;
            barcode: string | null;
            category: string | null;
            costPrice: import("@prisma/client/runtime/library").Decimal;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            stockQuantity: number;
            minStock: number;
            maxStock: number | null;
            unit: string;
        };
    } & {
        type: import(".prisma/client").$Enums.StockMovementType;
        id: string;
        date: Date;
        createdAt: Date;
        productId: string;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal | null;
        totalPrice: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        reference: string | null;
    })[]>;
}
//# sourceMappingURL=product.service.d.ts.map