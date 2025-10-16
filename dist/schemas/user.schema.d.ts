import { z } from 'zod';
export declare const UserRoleEnum: z.ZodEnum<{
    ADMIN: "ADMIN";
    MANAGER: "MANAGER";
    MECHANIC: "MECHANIC";
    ATTENDANT: "ATTENDANT";
}>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        MECHANIC: "MECHANIC";
        ATTENDANT: "ATTENDANT";
    }>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        MECHANIC: "MECHANIC";
        ATTENDANT: "ATTENDANT";
    }>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const userResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        MECHANIC: "MECHANIC";
        ATTENDANT: "ATTENDANT";
    }>;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const authResponseSchema: z.ZodObject<{
    token: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            MECHANIC: "MECHANIC";
            ATTENDANT: "ATTENDANT";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const userWithoutPasswordSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        MECHANIC: "MECHANIC";
        ATTENDANT: "ATTENDANT";
    }>;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=user.schema.d.ts.map