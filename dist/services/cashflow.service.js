"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
class CashFlowService {
    async create(data) {
        return await prisma_1.default.cashFlow.create({
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
            include: {
                payment: true,
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async getAll(type, startDate, endDate, category) {
        const where = {};
        if (type)
            where.type = type;
        if (category)
            where.category = { contains: category, mode: 'insensitive' };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        return await prisma_1.default.cashFlow.findMany({
            where,
            include: {
                payment: true,
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getById(id) {
        const cashFlow = await prisma_1.default.cashFlow.findUnique({
            where: { id },
            include: {
                payment: {
                    include: {
                        service: {
                            include: {
                                customer: true,
                                motorcycle: true,
                            },
                        },
                    },
                },
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!cashFlow) {
            throw new error_middleware_1.AppError('Registro de fluxo de caixa não encontrado', 404);
        }
        return cashFlow;
    }
    async update(id, data) {
        await this.getById(id);
        return await prisma_1.default.cashFlow.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
            include: {
                payment: true,
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async delete(id) {
        await this.getById(id);
        await prisma_1.default.cashFlow.delete({ where: { id } });
    }
    async getSummary(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const incomes = await prisma_1.default.cashFlow.aggregate({
            where: { ...where, type: 'INCOME' },
            _sum: { amount: true },
            _count: true,
        });
        const expenses = await prisma_1.default.cashFlow.aggregate({
            where: { ...where, type: 'EXPENSE' },
            _sum: { amount: true },
            _count: true,
        });
        const totalIncome = incomes._sum.amount ? Number(incomes._sum.amount) : 0;
        const totalExpense = expenses._sum.amount ? Number(expenses._sum.amount) : 0;
        const balance = totalIncome - totalExpense;
        return {
            totalIncome,
            totalExpense,
            balance,
        };
    }
    async getCategorySummary(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const results = await prisma_1.default.cashFlow.groupBy({
            by: ['category', 'type'],
            where,
            _sum: { amount: true },
            _count: true,
        });
        return results.map((item) => ({
            category: item.category,
            type: item.type,
            total: Number(item._sum.amount || 0),
            count: item._count,
        }));
    }
}
exports.CashFlowService = CashFlowService;
//# sourceMappingURL=cashflow.service.js.map