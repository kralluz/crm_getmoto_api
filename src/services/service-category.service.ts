import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateServiceCategoryInput, UpdateServiceCategoryInput } from '../interfaces/service.interface';

export class ServiceCategoryService {
  async create(data: CreateServiceCategoryInput) {
    // Verificar se nome já existe
    const existingCategory = await prisma.service.findUnique({
      where: { service_category_name: data.service_category_name },
    });

    if (existingCategory) {
      throw new AppError('Categoria de serviço já cadastrada com este nome', 409);
    }

    return await prisma.service.create({
      data: {
        service_category_name: data.service_category_name,
        service_cost: data.service_cost,
        is_active: data.is_active ?? true,
      },
    });
  }

  async getAll(is_active?: boolean) {
    const where: any = {};

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    return await prisma.service.findMany({
      where,
      orderBy: { service_category_name: 'asc' },
    });
  }

  async getById(service_category_id: bigint | number) {
    const category = await prisma.service.findUnique({
      where: { service_category_id: BigInt(service_category_id) },
      include: {
        service_order: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          take: 10,
        },
        services_realized: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    });

    if (!category) {
      throw new AppError('Categoria de serviço não encontrada', 404);
    }

    return category;
  }

  async update(service_category_id: bigint | number, data: UpdateServiceCategoryInput) {
    await this.getById(service_category_id);

    // Se está alterando o nome, verificar se já existe outro com o mesmo nome
    if (data.service_category_name) {
      const existingCategory = await prisma.service.findFirst({
        where: {
          service_category_name: data.service_category_name,
          service_category_id: { not: BigInt(service_category_id) },
        },
      });

      if (existingCategory) {
        throw new AppError('Já existe outra categoria com este nome', 409);
      }
    }

    const updateData: any = {};
    if (data.service_category_name !== undefined) updateData.service_category_name = data.service_category_name;
    if (data.service_cost !== undefined) updateData.service_cost = data.service_cost;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return await prisma.service.update({
      where: { service_category_id: BigInt(service_category_id) },
      data: updateData,
    });
  }

  async delete(service_category_id: bigint | number) {
    await this.getById(service_category_id);

    // Verificar se há ordens de serviço ou serviços realizados vinculados
    const ordersCount = await prisma.service_order.count({
      where: {
        service_category_id: BigInt(service_category_id),
        is_active: true,
      },
    });

    const servicesCount = await prisma.services_realized.count({
      where: {
        service_category_id: BigInt(service_category_id),
        is_active: true,
      },
    });

    if (ordersCount > 0 || servicesCount > 0) {
      throw new AppError(
        'Não é possível excluir esta categoria pois existem ordens de serviço ou serviços vinculados a ela',
        400
      );
    }

    // Soft delete - apenas marca como inativo
    return await prisma.service.update({
      where: { service_category_id: BigInt(service_category_id) },
      data: { is_active: false },
    });
  }

  async getWithStats(service_category_id: bigint | number) {
    const category = await this.getById(service_category_id);

    const ordersCount = await prisma.service_order.count({
      where: {
        service_category_id: BigInt(service_category_id),
        is_active: true,
      },
    });

    const servicesRealizedCount = await prisma.services_realized.count({
      where: {
        service_category_id: BigInt(service_category_id),
        is_active: true,
      },
    });

    const totalRevenue = await prisma.services_realized.aggregate({
      where: {
        service_category_id: BigInt(service_category_id),
        is_active: true,
      },
      _sum: {
        service_qtd: true,
      },
    });

    const estimatedRevenue = Number(totalRevenue._sum.service_qtd || 0) * Number(category.service_cost);

    return {
      ...category,
      stats: {
        total_orders: ordersCount,
        total_services_realized: servicesRealizedCount,
        estimated_revenue: estimatedRevenue,
      },
    };
  }
}
