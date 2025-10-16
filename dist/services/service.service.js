"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
class ServiceService {
    async create(data) {
        const service = await prisma_1.default.service.create({
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: {
                customer: true,
                motorcycle: true,
                user: { select: { id: true, name: true, email: true, role: true } },
                serviceItems: true,
                payments: true,
            },
        });
        return service;
    }
    async getAll(status, customerId) {
        return await prisma_1.default.service.findMany({
            where: {
                status: status ? status : undefined,
                customerId,
            },
            include: {
                customer: true,
                motorcycle: true,
                user: { select: { id: true, name: true, email: true, role: true } },
                serviceItems: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id) {
        const service = await prisma_1.default.service.findUnique({
            where: { id },
            include: {
                customer: true,
                motorcycle: true,
                user: { select: { id: true, name: true, email: true, role: true } },
                serviceItems: { include: { product: true } },
                payments: true,
            },
        });
        if (!service) {
            throw new error_middleware_1.AppError('Serviço não encontrado', 404);
        }
        return service;
    }
    async update(id, data) {
        await this.getById(id);
        return await prisma_1.default.service.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: {
                customer: true,
                motorcycle: true,
                user: { select: { id: true, name: true, email: true, role: true } },
                serviceItems: true,
                payments: true,
            },
        });
    }
    async delete(id) {
        await this.getById(id);
        await prisma_1.default.service.delete({ where: { id } });
    }
}
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map