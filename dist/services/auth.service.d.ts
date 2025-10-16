import { LoginInput, CreateUserInput, AuthResponse } from '../interfaces/user.interface';
export declare class AuthService {
    register(data: CreateUserInput): Promise<AuthResponse>;
    login(data: LoginInput): Promise<AuthResponse>;
    me(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        active: boolean;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map