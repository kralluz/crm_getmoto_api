import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateCashFlowInput, UpdateCashFlowInput } from '../interfaces/cashflow.interface';
import { MoneyUtils } from '../utils/money.util';

export class CashFlowService {
  /**
   * Transforma cash flow do banco para resposta da API (usando reais)
   */
  private transformCashFlowResponse(cashFlow: any) {
    if (!cashFlow) return cashFlow;
    
    // Remove campo interno de centavos da resposta
    const { amount_cents, ...cashFlowData } = cashFlow;
    
    // Garante que o amount está em reais (usando o campo Decimal como fonte da verdade)
    return {
      ...cashFlowData,
      amount: cashFlow.amount ? Number(cashFlow.amount) : 0,
    };
  }

  async create(data: CreateCashFlowInput) {
    const cashFlow = await prisma.cash_flow.create({
      data: {
        ...data,
        amount_cents: MoneyUtils.reaisToCents(data.amount),
      },
      include: {
        service_order: {
          select: {
            service_order_id: true,
            customer_name: true,
            service_description: true,
          },
        },
        service_products: {
          select: {
            service_product_id: true,
            product_qtd: true,
            products: {
              select: {
                product_name: true,
              },
            },
          },
        },
        services_realized: {
          select: {
            services_realized_id: true,
            service_qtd: true,
            service: {
              select: {
                service_name: true,
              },
            },
          },
        },
      },
    });

    return this.transformCashFlowResponse(cashFlow);
  }

  async getAll(direction?: string, startDate?: string, endDate?: string) {
    const where: any = {
      is_active: true,
    };

    // Filtro por direção (entrada/saida)
    if (direction && (direction === 'entrada' || direction === 'saida')) {
      where.direction = direction;
    }

    // Filtro por intervalo de datas
    if (startDate || endDate) {
      where.occurred_at = {};
      if (startDate) {
        where.occurred_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.occurred_at.lte = new Date(endDate);
      }
    }

    const cashFlows = await prisma.cash_flow.findMany({
      where,
      include: {
        service_order: {
          select: {
            service_order_id: true,
            customer_name: true,
            service_description: true,
          },
        },
        service_products: {
          select: {
            service_product_id: true,
            product_qtd: true,
            products: {
              select: {
                product_name: true,
              },
            },
          },
        },
        services_realized: {
          select: {
            services_realized_id: true,
            service_qtd: true,
            service: {
              select: {
                service_name: true,
              },
            },
          },
        },
      },
      orderBy: { occurred_at: 'desc' },
    });

    return cashFlows.map(cashFlow => this.transformCashFlowResponse(cashFlow));
  }

  async getById(id: string) {
    const cashFlow = await prisma.cash_flow.findUnique({
      where: { cash_flow_id: BigInt(id) },
      include: {
        service_order: {
          select: {
            service_order_id: true,
            customer_name: true,
            service_description: true,
            status: true,
          },
        },
        service_products: {
          select: {
            service_product_id: true,
            product_qtd: true,
            products: {
              select: {
                product_id: true,
                product_name: true,
                sell_price: true,
              },
            },
          },
        },
        services_realized: {
          select: {
            services_realized_id: true,
            service_qtd: true,
            service: {
              select: {
                service_id: true,
                service_name: true,
                service_cost: true,
              },
            },
          },
        },
      },
    });

    if (!cashFlow) {
      throw new AppError('Registro de fluxo de caixa não encontrado', 404);
    }

    return this.transformCashFlowResponse(cashFlow);
  }

  async update(id: string, data: UpdateCashFlowInput) {
    await this.getById(id);

    const updateData: any = { ...data };
    if (data.amount !== undefined) {
      updateData.amount_cents = MoneyUtils.reaisToCents(data.amount);
    }

    const updatedCashFlow = await prisma.cash_flow.update({
      where: { cash_flow_id: BigInt(id) },
      data: updateData,
      include: {
        service_order: {
          select: {
            service_order_id: true,
            customer_name: true,
            service_description: true,
          },
        },
      },
    });

    return this.transformCashFlowResponse(updatedCashFlow);
  }

  async delete(id: string) {
    await this.getById(id);

    // Soft delete - marca como inativo
    await prisma.cash_flow.update({
      where: { cash_flow_id: BigInt(id) },
      data: { is_active: false },
    });
  }

  async getSummary(startDate?: string, endDate?: string) {
    const where: any = {
      is_active: true,
    };

    // Filtro por intervalo de datas
    if (startDate || endDate) {
      where.occurred_at = {};
      if (startDate) {
        where.occurred_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.occurred_at.lte = new Date(endDate);
      }
    }

    const incomes = await prisma.cash_flow.aggregate({
      where: { ...where, direction: 'entrada' },
      _sum: { amount: true },
      _count: true,
    });

    const expenses = await prisma.cash_flow.aggregate({
      where: { ...where, direction: 'saida' },
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
      incomeCount: incomes._count,
      expenseCount: expenses._count,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
  }

  /**
   * Retorna resumo financeiro agrupado por categoria de serviço
   * Como não há campo 'category' na tabela cash_flow, agrupamos por:
   * - Serviços realizados (via service_realized_id)
   * - Produtos vendidos (via service_product_id)
   */
  async getCategorySummary(startDate?: string, endDate?: string) {
    const where: any = {
      is_active: true,
    };

    // Filtro por intervalo de datas
    if (startDate || endDate) {
      where.occurred_at = {};
      if (startDate) {
        where.occurred_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.occurred_at.lte = new Date(endDate);
      }
    }

    // Resumo por serviços realizados
    const serviceFlows = await prisma.cash_flow.findMany({
      where: {
        ...where,
        service_realized_id: { not: null },
      },
      include: {
        services_realized: {
          include: {
            service: true,
          },
        },
      },
    });

    // Resumo por produtos vendidos
    const productFlows = await prisma.cash_flow.findMany({
      where: {
        ...where,
        service_product_id: { not: null },
      },
      include: {
        service_products: {
          include: {
            products: true,
          },
        },
      },
    });

    // Agrupar serviços por categoria
    const serviceSummary = serviceFlows.reduce((acc: any, flow: any) => {
      if (!flow.services_realized?.service) return acc;

      const categoryName = flow.services_realized.service.service_name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          type: 'Serviço',
          direction: flow.direction,
          total: 0,
          count: 0,
        };
      }
      acc[categoryName].total += Number(flow.amount);
      acc[categoryName].count += 1;
      return acc;
    }, {});

    // Agrupar produtos
    const productSummary = productFlows.reduce((acc: any, flow: any) => {
      if (!flow.service_products?.products) return acc;

      const productName = flow.service_products.products.product_name;
      const categoryKey = `Produto: ${productName}`;
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          category: productName,
          type: 'Produto',
          direction: flow.direction,
          total: 0,
          count: 0,
        };
      }
      acc[categoryKey].total += Number(flow.amount);
      acc[categoryKey].count += 1;
      return acc;
    }, {});

    // Combinar e retornar resultados
    const results = [
      ...Object.values(serviceSummary),
      ...Object.values(productSummary),
    ];

    return results;
  }
}
