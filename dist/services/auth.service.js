"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const hash_util_1 = require("../utils/hash.util");
const jwt_util_1 = require("../utils/jwt.util");
class AuthService {
    async register(data) {
        // Verificar se email já existe
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw error_middleware_1.AppError.conflict('Email já cadastrado');
        }
        // Hash da senha
        const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
        // Criar usuário
        const user = await prisma_1.default.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        // Gerar token JWT
        const token = (0, jwt_util_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async login(data) {
        // Buscar usuário por email
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        // Verificar se usuário existe
        if (!user) {
            throw error_middleware_1.AppError.unauthorized('Credenciais inválidas');
        }
        // Verificar se usuário está ativo
        if (!user.active) {
            throw error_middleware_1.AppError.unauthorized('Usuário inativo');
        }
        // Verificar senha
        const isPasswordValid = await (0, hash_util_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw error_middleware_1.AppError.unauthorized('Credenciais inválidas');
        }
        // Gerar token JWT
        const token = (0, jwt_util_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async me(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw error_middleware_1.AppError.notFound('Usuário não encontrado');
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map