import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import {
  CreateServiceOrderInput,
  UpdateServiceOrderInput,
  AddServiceToOrderInput,
  AddProductToOrderInput,
} from '../interfaces/service.interface';

export class ServiceOrderService {
  async create(data: CreateServiceOrderInput) {
    // Verificar se categoria de serviço existe (se fornecida)
    if (data.service_category_id) {
      const category = await prisma.service.findUnique({
        where: { service_category_id: BigInt(data.service_category_id) },
      });

      if (!category) {
        throw new AppError('Categoria de serviço não encontrada', 404);
      }
    }

    // Verificar se veículo existe (se fornecido)
    if (data.motorcycle_id) {
      const vehicle = await prisma.vehicles.findUnique({
        where: { vehicle_id: BigInt(data.motorcycle_id) },
      });

      if (!vehicle) {
        throw new AppError('Veículo não encontrado', 404);
      }
    }

    return await prisma.service_order.create({
      data: {
        service_category_id: data.service_category_id ? BigInt(data.service_category_id) : null,
        professional_name: data.professional_name || null,
        motorcycle_id: data.motorcycle_id ? BigInt(data.motorcycle_id) : null,
        customer_name: data.customer_name || null,
        service_description: data.service_description || null,
        diagnosis: data.diagnosis || null,
        status: data.status || 'draft',
        estimated_labor_cost: data.estimated_labor_cost || null,
        notes: data.notes || null,
        is_active: true,
      },
      include: {
        service: true,
        vehicles: true,
      },
    });
  }

  async getAll(status?: string, motorcycle_id?: bigint | number, is_active?: boolean) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (motorcycle_id) {
      where.motorcycle_id = BigInt(motorcycle_id);
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    return await prisma.service_order.findMany({
      where,
      include: {
        service: true,
        vehicles: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getById(service_order_id: bigint | number) {
    const order = await prisma.service_order.findUnique({
      where: { service_order_id: BigInt(service_order_id) },
      include: {
        service: true,
        vehicles: true,
        service_products: {
          where: { is_active: true },
          include: {
            products: {
              include: {
                product_category: true,
              },
            },
          },
        },
        services_realized: {
          where: { is_active: true },
          include: {
            service: true,
          },
        },
        cash_flow: {
          where: { is_active: true },
          orderBy: { occurred_at: 'desc' },
        },
      },
    });

    if (!order) {
      throw new AppError('Ordem de serviço não encontrada', 404);
    }

    return order;
  }

  async update(service_order_id: bigint | number, data: UpdateServiceOrderInput) {
    await this.getById(service_order_id);

    // Verificar se categoria de serviço existe (se fornecida)
    if (data.service_category_id) {
      const category = await prisma.service.findUnique({
        where: { service_category_id: BigInt(data.service_category_id) },
      });

      if (!category) {
        throw new AppError('Categoria de serviço não encontrada', 404);
      }
    }

    // Verificar se veículo existe (se fornecido)
    if (data.motorcycle_id) {
      const vehicle = await prisma.vehicles.findUnique({
        where: { vehicle_id: BigInt(data.motorcycle_id) },
      });

      if (!vehicle) {
        throw new AppError('Veículo não encontrado', 404);
      }
    }

    const updateData: any = {};
    if (data.service_category_id !== undefined)
      updateData.service_category_id = data.service_category_id ? BigInt(data.service_category_id) : null;
    if (data.professional_name !== undefined) updateData.professional_name = data.professional_name;
    if (data.motorcycle_id !== undefined) updateData.motorcycle_id = data.motorcycle_id ? BigInt(data.motorcycle_id) : null;
    if (data.customer_name !== undefined) updateData.customer_name = data.customer_name;
    if (data.service_description !== undefined) updateData.service_description = data.service_description;
    if (data.diagnosis !== undefined) updateData.diagnosis = data.diagnosis;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.estimated_labor_cost !== undefined) updateData.estimated_labor_cost = data.estimated_labor_cost;
    if (data.notes !== undefined) updateData.notes = data.notes;

    return await prisma.service_order.update({
      where: { service_order_id: BigInt(service_order_id) },
      data: updateData,
      include: {
        service: true,
        vehicles: true,
      },
    });
  }

  async delete(service_order_id: bigint | number) {
    await this.getById(service_order_id);

    // Soft delete - marca como inativo
    return await prisma.service_order.update({
      where: { service_order_id: BigInt(service_order_id) },
      data: { is_active: false },
    });
  }

  async addServiceToOrder(data: AddServiceToOrderInput) {
    // Verificar se a ordem de serviço existe
    await this.getById(data.service_order_id);

    // Verificar se a categoria de serviço existe
    const serviceCategory = await prisma.service.findUnique({
      where: { service_category_id: BigInt(data.service_category_id) },
    });

    if (!serviceCategory) {
      throw new AppError('Categoria de serviço não encontrada', 404);
    }

    // Verificar se já não existe um serviço desta categoria nesta ordem
    const existingService = await prisma.services_realized.findFirst({
      where: {
        service_order_id: BigInt(data.service_order_id),
        service_category_id: BigInt(data.service_category_id),
        is_active: true,
      },
    });

    if (existingService) {
      // Se já existe, atualiza a quantidade
      return await prisma.services_realized.update({
        where: { services_realized_id: existingService.services_realized_id },
        data: {
          service_qtd: Number(existingService.service_qtd) + data.service_qtd,
        },
        include: {
          service: true,
        },
      });
    }

    // Criar novo serviço realizado
    const serviceRealized = await prisma.services_realized.create({
      data: {
        service_category_id: BigInt(data.service_category_id),
        service_order_id: BigInt(data.service_order_id),
        service_qtd: data.service_qtd,
        is_active: true,
      },
      include: {
        service: true,
      },
    });

    // Criar entrada no fluxo de caixa
    const totalAmount = Number(serviceCategory.service_cost) * data.service_qtd;
    await prisma.cash_flow.create({
      data: {
        service_order_id: BigInt(data.service_order_id),
        service_realized_id: serviceRealized.services_realized_id,
        amount: totalAmount,
        direction: 'entrada',
        occurred_at: new Date(),
        note: `Serviço: ${serviceCategory.service_category_name} (${data.service_qtd}x)`,
        is_active: true,
      },
    });

    return serviceRealized;
  }

  async addProductToOrder(data: AddProductToOrderInput) {
    // Verificar se a ordem de serviço existe
    await this.getById(data.service_order_id);

    // Verificar se o produto existe e tem estoque suficiente
    const product = await prisma.products.findUnique({
      where: { product_id: BigInt(data.product_id) },
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    if (Number(product.quantity) < data.product_qtd) {
      throw new AppError('Estoque insuficiente para este produto', 400);
    }

    // Verificar se já não existe este produto nesta ordem
    const existingProduct = await prisma.service_products.findFirst({
      where: {
        service_order_id: BigInt(data.service_order_id),
        product_id: BigInt(data.product_id),
        is_active: true,
      },
    });

    if (existingProduct) {
      // Se já existe, atualiza a quantidade
      const newQuantity = Number(existingProduct.product_qtd) + data.product_qtd;

      // Verificar novamente o estoque com a nova quantidade
      if (Number(product.quantity) < newQuantity) {
        throw new AppError('Estoque insuficiente para este produto', 400);
      }

      return await prisma.service_products.update({
        where: { service_product_id: existingProduct.service_product_id },
        data: { product_qtd: newQuantity },
        include: {
          products: {
            include: {
              product_category: true,
            },
          },
        },
      });
    }

    // Criar novo produto na ordem
    const serviceProduct = await prisma.service_products.create({
      data: {
        product_id: BigInt(data.product_id),
        product_qtd: data.product_qtd,
        service_order_id: BigInt(data.service_order_id),
        is_active: true,
      },
      include: {
        products: {
          include: {
            product_category: true,
          },
        },
      },
    });

    // Atualizar estoque do produto
    await prisma.products.update({
      where: { product_id: BigInt(data.product_id) },
      data: { quantity: Number(product.quantity) - data.product_qtd },
    });

    // Criar entrada no fluxo de caixa
    const totalAmount = Number(product.sell_price) * data.product_qtd;
    await prisma.cash_flow.create({
      data: {
        service_order_id: BigInt(data.service_order_id),
        service_product_id: serviceProduct.service_product_id,
        amount: totalAmount,
        direction: 'entrada',
        occurred_at: new Date(),
        note: `Produto: ${product.product_name} (${data.product_qtd}x)`,
        is_active: true,
      },
    });

    // Criar movimentação de estoque
    await prisma.stock_move.create({
      data: {
        product_id: BigInt(data.product_id),
        user_id: null,
        move_type: 'EXIT',
        quantity: data.product_qtd,
        notes: `Saída para ordem de serviço #${data.service_order_id}`,
        is_active: true,
      },
    });

    return serviceProduct;
  }

  async getOrderWithDetails(service_order_id: bigint | number) {
    const order = await this.getById(service_order_id);

    // Calcular totais
    const productsTotal = order.service_products.reduce((sum, sp) => {
      return sum + Number(sp.products.sell_price) * Number(sp.product_qtd);
    }, 0);

    const servicesTotal = order.services_realized.reduce((sum, sr) => {
      return sum + Number(sr.service.service_cost) * Number(sr.service_qtd);
    }, 0);

    const laborCost = Number(order.estimated_labor_cost || 0);
    const grandTotal = productsTotal + servicesTotal + laborCost;

    return {
      ...order,
      summary: {
        products_total: productsTotal,
        services_total: servicesTotal,
        labor_cost: laborCost,
        grand_total: grandTotal,
        products_count: order.service_products.length,
        services_count: order.services_realized.length,
      },
    };
  }

  async finalizeOrder(service_order_id: bigint | number) {
    const order = await this.getById(service_order_id);

    if (order.status === 'completed') {
      throw new AppError('Esta ordem de serviço já foi finalizada', 400);
    }

    if (order.status === 'cancelled') {
      throw new AppError('Não é possível finalizar uma ordem cancelada', 400);
    }

    return await prisma.service_order.update({
      where: { service_order_id: BigInt(service_order_id) },
      data: {
        status: 'completed',
        finalized_at: new Date(),
      },
      include: {
        service: true,
        vehicles: true,
        service_products: {
          include: {
            products: true,
          },
        },
        services_realized: {
          include: {
            service: true,
          },
        },
      },
    });
  }
}
