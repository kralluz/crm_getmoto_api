import { CreateCustomerInput, UpdateCustomerInput } from '../interfaces/customer.interface';
export declare class CustomerService {
    create(data: CreateCustomerInput): Promise<{
        motorcycles: {
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
        }[];
    } & {
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
    }>;
    getAll(active?: boolean): Promise<({
        motorcycles: {
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
        }[];
    } & {
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
    })[]>;
    getById(id: string): Promise<{
        services: ({
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
        })[];
        motorcycles: {
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
        }[];
    } & {
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
    }>;
    update(id: string, data: UpdateCustomerInput): Promise<{
        motorcycles: {
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
        }[];
    } & {
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
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=customer.service.d.ts.map