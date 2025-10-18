import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateCashFlowInput, UpdateCashFlowInput } from '../interfaces/cashflow.interface';

export class CashFlowService {
  async create(data: CreateCashFlowInput) {
    return await prisma.cashFlow.create({
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

  async getAll(type?: string, startDate?: string, endDate?: string, category?: string) {
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: 'insensitive' };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return await prisma.cashFlow.findMany({
      where,
      include: {
        payment: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getById(id: string) {
    const cashFlow = await prisma.cashFlow.findUnique({
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
      throw new AppError('Registro de fluxo de caixa não encontrado', 404);
    }

    return cashFlow;
  }

  async update(id: string, data: UpdateCashFlowInput) {
    await this.getById(id);

    return await prisma.cashFlow.update({
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

  async delete(id: string) {
    await this.getById(id);
    await prisma.cashFlow.delete({ where: { id } });
  }

  async getSummary(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const incomes = await prisma.cashFlow.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
      _count: true,
    });

    const expenses = await prisma.cashFlow.aggregate({
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

  async getCategorySummary(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const results = await prisma.cashFlow.groupBy({
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
