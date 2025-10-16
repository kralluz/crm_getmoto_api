import { CreateServiceInput, UpdateServiceInput } from '../interfaces/service.interface';
export declare class ServiceService {
    create(data: CreateServiceInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            active: boolean;
            phone: string;
            cpf: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            notes: string | null;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            notes: string | null;
            customerId: string;
            brand: string;
            model: string;
            year: number;
            plate: string;
            color: string | null;
            mileage: number | null;
        };
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            serviceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            dueDate: Date | null;
            paymentDate: Date | null;
        }[];
        serviceItems: {
            id: string;
            description: string;
            serviceId: string;
            productId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            isLabor: boolean;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        notes: string | null;
        customerId: string;
        motorcycleId: string;
        userId: string;
        diagnosis: string | null;
        startDate: Date;
        estimatedEndDate: Date | null;
        endDate: Date | null;
        laborCost: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
    }>;
    getAll(status?: string, customerId?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            active: boolean;
            phone: string;
            cpf: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            notes: string | null;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            notes: string | null;
            customerId: string;
            brand: string;
            model: string;
            year: number;
            plate: string;
            color: string | null;
            mileage: number | null;
        };
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            serviceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            dueDate: Date | null;
            paymentDate: Date | null;
        }[];
        serviceItems: {
            id: string;
            description: string;
            serviceId: string;
            productId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            isLabor: boolean;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        notes: string | null;
        customerId: string;
        motorcycleId: string;
        userId: string;
        diagnosis: string | null;
        startDate: Date;
        estimatedEndDate: Date | null;
        endDate: Date | null;
        laborCost: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getById(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            active: boolean;
            phone: string;
            cpf: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            notes: string | null;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            notes: string | null;
            customerId: string;
            brand: string;
            model: string;
            year: number;
            plate: string;
            color: string | null;
            mileage: number | null;
        };
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            serviceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            dueDate: Date | null;
            paymentDate: Date | null;
        }[];
        serviceItems: ({
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
            } | null;
        } & {
            id: string;
            description: string;
            serviceId: string;
            productId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            isLabor: boolean;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        notes: string | null;
        customerId: string;
        motorcycleId: string;
        userId: string;
        diagnosis: string | null;
        startDate: Date;
        estimatedEndDate: Date | null;
        endDate: Date | null;
        laborCost: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, data: UpdateServiceInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            active: boolean;
            phone: string;
            cpf: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            notes: string | null;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            notes: string | null;
            customerId: string;
            brand: string;
            model: string;
            year: number;
            plate: string;
            color: string | null;
            mileage: number | null;
        };
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            serviceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            dueDate: Date | null;
            paymentDate: Date | null;
        }[];
        serviceItems: {
            id: string;
            description: string;
            serviceId: string;
            productId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            isLabor: boolean;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        notes: string | null;
        customerId: string;
        motorcycleId: string;
        userId: string;
        diagnosis: string | null;
        startDate: Date;
        estimatedEndDate: Date | null;
        endDate: Date | null;
        laborCost: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=service.service.d.ts.map