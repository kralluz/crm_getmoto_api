import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateServiceOrderInput, UpdateServiceOrderInput } from '../interfaces/service.interface';

export class ServiceService {
  async create(data: CreateServiceOrderInput) {
    const service = await prisma.service_order.create({
      data: {
        ...data,
      },
      include: {
        service: {
          select: {
            service_category_id: true,
            service_category_name: true,
            service_cost: true,
          },
        },
        vehicles: {
          select: {
            vehicle_id: true,
            brand: true,
            model: true,
            plate: true,
            year: true,
          },
        },
      },
    });

    return service;
  }

  async getAll(status?: string, customer_name?: string) {
    const where: any = {
      is_active: true,
    };

    // Filtro por status
    if (status) {
      where.status = status;
    }

    // Filtro por nome do cliente (busca parcial case-insensitive)
    if (customer_name) {
      where.customer_name = {
        contains: customer_name,
        mode: 'insensitive',
      };
    }

    return await prisma.service_order.findMany({
      where,
      include: {
        service: {
          select: {
            service_category_id: true,
            service_category_name: true,
            service_cost: true,
          },
        },
        vehicles: {
          select: {
            vehicle_id: true,
            brand: true,
            model: true,
            plate: true,
            year: true,
            color: true,
          },
        },
        service_products: {
          where: {
            is_active: true,
          },
          include: {
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
          where: {
            is_active: true,
          },
          include: {
            service: {
              select: {
                service_category_id: true,
                service_category_name: true,
                service_cost: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getById(id: string) {
    const service = await prisma.service_order.findUnique({
      where: { service_order_id: BigInt(id) },
      include: {
        service: {
          select: {
            service_category_id: true,
            service_category_name: true,
            service_cost: true,
          },
        },
        vehicles: {
          select: {
            vehicle_id: true,
            brand: true,
            model: true,
            plate: true,
            year: true,
            color: true,
          },
        },
        service_products: {
          where: {
            is_active: true,
          },
          include: {
            products: {
              select: {
                product_id: true,
                product_name: true,
                buy_price: true,
                sell_price: true,
              },
            },
          },
        },
        services_realized: {
          where: {
            is_active: true,
          },
          include: {
            service: {
              select: {
                service_category_id: true,
                service_category_name: true,
                service_cost: true,
              },
            },
          },
        },
        cash_flow: {
          where: {
            is_active: true,
          },
          select: {
            cash_flow_id: true,
            amount: true,
            direction: true,
            occurred_at: true,
            note: true,
          },
        },
      },
    });

    if (!service) {
      throw new AppError('Ordem de serviço não encontrada', 404);
    }

    return service;
  }

  async update(id: string, data: UpdateServiceOrderInput) {
    await this.getById(id);

    return await prisma.service_order.update({
      where: { service_order_id: BigInt(id) },
      data: {
        ...data,
      },
      include: {
        service: {
          select: {
            service_category_id: true,
            service_category_name: true,
            service_cost: true,
          },
        },
        vehicles: {
          select: {
            vehicle_id: true,
            brand: true,
            model: true,
            plate: true,
            year: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);

    // Soft delete - marca como inativo
    await prisma.service_order.update({
      where: { service_order_id: BigInt(id) },
      data: { is_active: false },
    });
  }
}
