import { UpdateUserInput } from '../interfaces/user.interface';
export declare class UserService {
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        active: boolean;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        active: boolean;
    }>;
    update(id: string, data: UpdateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        active: boolean;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map