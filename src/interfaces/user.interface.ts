import { z } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  userResponseSchema,
  authResponseSchema
} from '../schemas/user.schema';

// Types inferidos dos schemas Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

// Interface para JWT Payload
export interface JwtPayload {
  userId: bigint | number;
  email: string;
  role: string;
}
