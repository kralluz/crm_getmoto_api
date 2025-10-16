import { z } from 'zod';
import { createUserSchema, updateUserSchema, loginSchema } from '../schemas/user.schema';
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}
//# sourceMappingURL=user.interface.d.ts.map