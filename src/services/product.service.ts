import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateProductInput, UpdateProductInput, CreateStockMovementInput } from '../interfaces/product.interface';

export class ProductService {
  async create(data: CreateProductInput) {
    if (data.code) {
      const codeExists = await prisma.product.findUnique({ where: { code: data.code } });
      if (codeExists) {
        throw new AppError('Código já cadastrado', 400);
      }
    }

    if (data.barcode) {
      const barcodeExists = await prisma.product.findUnique({ where: { barcode: data.barcode } });
      if (barcodeExists) {
        throw new AppError('Código de barras já cadastrado', 400);
      }
    }

    return await prisma.product.create({ data });
  }

  async getAll(active?: boolean, lowStock?: boolean) {
    const where: any = {};
    if (active !== undefined) where.active = active;
    if (lowStock) where.stockQuantity = { lte: prisma.product.fields.minStock };

    return await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          orderBy: { date: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return product;
  }

  async update(id: string, data: UpdateProductInput) {
    await this.getById(id);

    if (data.code) {
      const codeExists = await prisma.product.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (codeExists) {
        throw new AppError('Código já está em uso', 400);
      }
    }

    if (data.barcode) {
      const barcodeExists = await prisma.product.findFirst({
        where: { barcode: data.barcode, id: { not: id } },
      });
      if (barcodeExists) {
        throw new AppError('Código de barras já está em uso', 400);
      }
    }

    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.product.delete({ where: { id } });
  }

  async addStockMovement(data: CreateStockMovementInput) {
    const product = await this.getById(data.productId);

    let newQuantity = product.stockQuantity;

    if (data.type === 'ENTRY') {
      newQuantity += data.quantity;
    } else if (data.type === 'EXIT') {
      if (newQuantity < data.quantity) {
        throw new AppError('Quantidade insuficiente em estoque', 400);
      }
      newQuantity -= data.quantity;
    } else if (data.type === 'ADJUSTMENT') {
      newQuantity = data.quantity;
    }

    const movement = await prisma.stockMovement.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    await prisma.product.update({
      where: { id: data.productId },
      data: { stockQuantity: newQuantity },
    });

    return movement;
  }

  async getStockMovements(productId?: string, startDate?: string, endDate?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return await prisma.stockMovement.findMany({
      where,
      include: { product: true },
      orderBy: { date: 'desc' },
    });
  }
}
