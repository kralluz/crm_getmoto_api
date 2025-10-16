import { CreateCashFlowInput, UpdateCashFlowInput } from '../interfaces/cashflow.interface';
export declare class CashFlowService {
    create(data: CreateCashFlowInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        payment: {
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
        } | null;
    } & {
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: string;
        category: string;
        paymentId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getAll(type?: string, startDate?: string, endDate?: string, category?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        payment: {
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
        } | null;
    } & {
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: string;
        category: string;
        paymentId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getById(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        payment: ({
            service: {
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
            };
        } & {
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
        }) | null;
    } & {
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: string;
        category: string;
        paymentId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, data: UpdateCashFlowInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        payment: {
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
        } | null;
    } & {
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: string;
        category: string;
        paymentId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    delete(id: string): Promise<void>;
    getSummary(startDate?: string, endDate?: string): Promise<{
        incomes: {
            total: number;
            count: number;
        };
        expenses: {
            total: number;
            count: number;
        };
        balance: number;
    }>;
    getCategorySummary(startDate?: string, endDate?: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CashFlowGroupByOutputType, ("type" | "category")[]> & {
        _count: number;
        _sum: {
            amount: import("@prisma/client/runtime/library").Decimal | null;
        };
    })[]>;
}
//# sourceMappingURL=cashflow.service.d.ts.map