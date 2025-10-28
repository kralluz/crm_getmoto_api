import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateProductCategoryInput, UpdateProductCategoryInput } from '../interfaces/product.interface';

export class ProductCategoryService {
  /**
   * Transforma categoria do banco para resposta da API
   */
  private transformCategoryResponse(category: any) {
    if (!category) return category;
    return category;
  }

  async create(data: CreateProductCategoryInput) {
    // Verificar se nome já existe
    const existingCategory = await prisma.product_category.findUnique({
      where: { product_category_name: data.product_category_name },
    });

    if (existingCategory) {
      throw new AppError('Categoria de produto já cadastrada com este nome', 409);
    }

    const category = await prisma.product_category.create({
      data: {
        product_category_name: data.product_category_name,
        is_active: data.is_active ?? true,
      },
    });

    return this.transformCategoryResponse(category);
  }

  async getAll(is_active?: boolean) {
    const where: any = {};

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const categories = await prisma.product_category.findMany({
      where,
      orderBy: { product_category_name: 'asc' },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return categories.map(category => this.transformCategoryResponse(category));
  }

  async getById(product_category_id: bigint | number) {
    const category = await prisma.product_category.findUnique({
      where: { product_category_id: BigInt(product_category_id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Categoria de produto não encontrada', 404);
    }

    return this.transformCategoryResponse(category);
  }

  async update(product_category_id: bigint | number, data: UpdateProductCategoryInput) {
    await this.getById(product_category_id);

    // Se está alterando o nome, verificar se já existe
    if (data.product_category_name) {
      const existingCategory = await prisma.product_category.findFirst({
        where: {
          product_category_name: data.product_category_name,
          NOT: {
            product_category_id: BigInt(product_category_id),
          },
        },
      });

      if (existingCategory) {
        throw new AppError('Já existe uma categoria com este nome', 409);
      }
    }

    const updatedCategory = await prisma.product_category.update({
      where: { product_category_id: BigInt(product_category_id) },
      data: {
        product_category_name: data.product_category_name,
        is_active: data.is_active,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return this.transformCategoryResponse(updatedCategory);
  }

  async delete(product_category_id: bigint | number) {
    await this.getById(product_category_id);

    // Verificar se há produtos vinculados
    const productsCount = await prisma.products.count({
      where: {
        category_id: BigInt(product_category_id),
        is_active: true,
      },
    });

    if (productsCount > 0) {
      throw new AppError(
        `Não é possível deletar esta categoria. Existem ${productsCount} produto(s) ativo(s) vinculado(s).`,
        400
      );
    }

    // Soft delete - apenas marca como inativo
    return await prisma.product_category.update({
      where: { product_category_id: BigInt(product_category_id) },
      data: { is_active: false },
    });
  }

  async getWithStats(product_category_id: bigint | number) {
    const category = await this.getById(product_category_id);

    const productsCount = await prisma.products.count({
      where: {
        category_id: BigInt(product_category_id),
        is_active: true,
      },
    });

    const products = await prisma.products.findMany({
      where: {
        category_id: BigInt(product_category_id),
        is_active: true,
      },
      take: 10,
      orderBy: { created_at: 'desc' },
      select: {
        product_id: true,
        product_name: true,
        quantity: true,
        buy_price: true,
        sell_price: true,
      },
    });

    return {
      ...category,
      stats: {
        total_products: productsCount,
        recent_products: products,
      },
    };
  }
}
