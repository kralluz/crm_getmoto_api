import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateProductInput, UpdateProductInput, CreateStockMoveInput } from '../interfaces/product.interface';

export class ProductService {
  async create(data: CreateProductInput) {
    // Verificar se categoria existe
    const category = await prisma.product_category.findUnique({
      where: { product_category_id: BigInt(data.category_id) },
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    return await prisma.products.create({
      data: {
        category_id: BigInt(data.category_id),
        product_name: data.product_name,
        quantity: data.quantity || 0,
        quantity_alert: data.quantity_alert || 0,
        buy_price: data.buy_price || 0,
        sell_price: data.sell_price || 0,
        is_active: data.is_active ?? true,
      },
      include: {
        product_category: true,
      },
    });
  }

  async getAll(is_active?: boolean, low_stock?: boolean) {
    const where: any = {};

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (low_stock) {
      where.quantity = { lte: prisma.products.fields.quantity_alert };
    }

    return await prisma.products.findMany({
      where,
      include: {
        product_category: true,
      },
      orderBy: { product_name: 'asc' },
    });
  }

  async getById(product_id: bigint | number) {
    const product = await prisma.products.findUnique({
      where: { product_id: BigInt(product_id) },
      include: {
        product_category: true,
        stock_move: {
          orderBy: { created_at: 'desc' },
          take: 20,
          include: {
            users: {
              select: {
                user_id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return product;
  }

  async update(product_id: bigint | number, data: UpdateProductInput) {
    await this.getById(product_id);

    // Se está alterando a categoria, verificar se ela existe
    if (data.category_id !== undefined) {
      const category = await prisma.product_category.findUnique({
        where: { product_category_id: BigInt(data.category_id) },
      });

      if (!category) {
        throw new AppError('Categoria não encontrada', 404);
      }
    }

    const updateData: any = {};
    if (data.category_id !== undefined) updateData.category_id = BigInt(data.category_id);
    if (data.product_name !== undefined) updateData.product_name = data.product_name;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.quantity_alert !== undefined) updateData.quantity_alert = data.quantity_alert;
    if (data.buy_price !== undefined) updateData.buy_price = data.buy_price;
    if (data.sell_price !== undefined) updateData.sell_price = data.sell_price;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return await prisma.products.update({
      where: { product_id: BigInt(product_id) },
      data: updateData,
      include: {
        product_category: true,
      },
    });
  }

  async delete(product_id: bigint | number) {
    await this.getById(product_id);

    // Soft delete - apenas marca como inativo
    return await prisma.products.update({
      where: { product_id: BigInt(product_id) },
      data: { is_active: false },
    });
  }

  async addStockMove(data: CreateStockMoveInput) {
    const product = await this.getById(data.product_id);

    let newQuantity = Number(product.quantity);

    if (data.move_type === 'ENTRY') {
      newQuantity += data.quantity;
    } else if (data.move_type === 'EXIT') {
      if (newQuantity < data.quantity) {
        throw new AppError('Quantidade insuficiente em estoque', 400);
      }
      newQuantity -= data.quantity;
    } else if (data.move_type === 'ADJUSTMENT') {
      newQuantity = data.quantity;
    }

    const movement = await prisma.stock_move.create({
      data: {
        product_id: BigInt(data.product_id),
        user_id: data.user_id ? BigInt(data.user_id) : null,
        move_type: data.move_type,
        quantity: data.quantity,
        notes: data.notes || null,
        is_active: true,
      },
      include: {
        products: true,
        users: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.products.update({
      where: { product_id: BigInt(data.product_id) },
      data: { quantity: newQuantity },
    });

    return movement;
  }

  async getStockMoves(product_id?: bigint | number, startDate?: string, endDate?: string) {
    const where: any = {};

    if (product_id) {
      where.product_id = BigInt(product_id);
    }

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = new Date(startDate);
      if (endDate) where.created_at.lte = new Date(endDate);
    }

    return await prisma.stock_move.findMany({
      where,
      include: {
        products: true,
        users: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getLowStockProducts() {
    return await prisma.products.findMany({
      where: {
        is_active: true,
        quantity: {
          lte: prisma.products.fields.quantity_alert,
        },
      },
      include: {
        product_category: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }
}
