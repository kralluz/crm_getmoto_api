"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const hash_util_1 = require("../utils/hash.util");
class UserService {
    async getAll() {
        return await prisma_1.default.user.findMany({
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
    }
    async getById(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
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
            throw new error_middleware_1.AppError('Usuário não encontrado', 404);
        }
        return user;
    }
    async update(id, data) {
        const user = await this.getById(id);
        if (data.email && data.email !== user.email) {
            const emailExists = await prisma_1.default.user.findUnique({
                where: { email: data.email },
            });
            if (emailExists) {
                throw new error_middleware_1.AppError('Email já está em uso', 400);
            }
        }
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await (0, hash_util_1.hashPassword)(data.password);
        }
        return await prisma_1.default.user.update({
            where: { id },
            data: updateData,
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
    }
    async delete(id) {
        await this.getById(id);
        await prisma_1.default.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map