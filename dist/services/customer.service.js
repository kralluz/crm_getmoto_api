"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
class CustomerService {
    async create(data) {
        if (data.email) {
            const emailExists = await prisma_1.default.customer.findUnique({
                where: { email: data.email },
            });
            if (emailExists) {
                throw new error_middleware_1.AppError('Email já cadastrado', 400);
            }
        }
        if (data.cpf) {
            const cpfExists = await prisma_1.default.customer.findUnique({
                where: { cpf: data.cpf },
            });
            if (cpfExists) {
                throw new error_middleware_1.AppError('CPF já cadastrado', 400);
            }
        }
        return await prisma_1.default.customer.create({
            data,
            include: { motorcycles: true },
        });
    }
    async getAll(active) {
        return await prisma_1.default.customer.findMany({
            where: active !== undefined ? { active } : undefined,
            include: { motorcycles: true },
            orderBy: { name: 'asc' },
        });
    }
    async getById(id) {
        const customer = await prisma_1.default.customer.findUnique({
            where: { id },
            include: {
                motorcycles: true,
                services: {
                    include: {
                        motorcycle: true,
                        payments: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!customer) {
            throw new error_middleware_1.AppError('Cliente não encontrado', 404);
        }
        return customer;
    }
    async update(id, data) {
        await this.getById(id);
        if (data.email) {
            const emailExists = await prisma_1.default.customer.findFirst({
                where: { email: data.email, id: { not: id } },
            });
            if (emailExists) {
                throw new error_middleware_1.AppError('Email já está em uso', 400);
            }
        }
        if (data.cpf) {
            const cpfExists = await prisma_1.default.customer.findFirst({
                where: { cpf: data.cpf, id: { not: id } },
            });
            if (cpfExists) {
                throw new error_middleware_1.AppError('CPF já está em uso', 400);
            }
        }
        return await prisma_1.default.customer.update({
            where: { id },
            data,
            include: { motorcycles: true },
        });
    }
    async delete(id) {
        await this.getById(id);
        await prisma_1.default.customer.delete({ where: { id } });
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map