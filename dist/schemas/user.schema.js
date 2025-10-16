"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithoutPasswordSchema = exports.authResponseSchema = exports.userResponseSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = exports.UserRoleEnum = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.UserRoleEnum = zod_1.z.enum(['ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT']);
// Input schemas
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
    email: zod_1.z.string().email('Email inválido').toLowerCase(),
    password: zod_1.z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(100, 'Senha muito longa'),
    role: exports.UserRoleEnum.default('ATTENDANT'),
    active: zod_1.z.boolean().default(true),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo').optional(),
    email: zod_1.z.string().email('Email inválido').toLowerCase().optional(),
    password: zod_1.z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(100, 'Senha muito longa')
        .optional(),
    role: exports.UserRoleEnum.optional(),
    active: zod_1.z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').toLowerCase(),
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
// Response schemas
exports.userResponseSchema = zod_1.z.object({
    id: common_schema_1.uuidSchema,
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: exports.UserRoleEnum,
    active: zod_1.z.boolean(),
}).merge(common_schema_1.timestampsSchema);
exports.authResponseSchema = zod_1.z.object({
    token: zod_1.z.string(),
    user: zod_1.z.object({
        id: common_schema_1.uuidSchema,
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        role: exports.UserRoleEnum,
    }),
});
// Para uso sem senha
exports.userWithoutPasswordSchema = exports.userResponseSchema;
//# sourceMappingURL=user.schema.js.map