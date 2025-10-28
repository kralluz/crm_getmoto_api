import { Request, Response } from 'express';
import { ProductCategoryService } from '../services/product-category.service';
import { CreateProductCategoryInput, UpdateProductCategoryInput } from '../interfaces/product.interface';

const productCategoryService = new ProductCategoryService();

export class ProductCategoryController {
  /**
   * @swagger
   * /api/product-categories:
   *   post:
   *     summary: Criar nova categoria de produto
   *     tags: [Product Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - product_category_name
   *             properties:
   *               product_category_name:
   *                 type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Categoria criada com sucesso
   *       409:
   *         description: Categoria já existe
   */
  async create(req: Request, res: Response) {
    const data: CreateProductCategoryInput = req.body;
    const category = await productCategoryService.create(data);
    return res.status(201).json(category);
  }

  /**
   * @swagger
   * /api/product-categories:
   *   get:
   *     summary: Listar todas as categorias de produtos
   *     tags: [Product Categories]
   *     parameters:
   *       - in: query
   *         name: is_active
   *         schema:
   *           type: boolean
   *         description: Filtrar por status ativo/inativo
   *     responses:
   *       200:
   *         description: Lista de categorias
   */
  async getAll(req: Request, res: Response) {
    const { is_active } = req.query;
    const isActive = is_active === 'true' ? true : is_active === 'false' ? false : undefined;
    const categories = await productCategoryService.getAll(isActive);
    return res.status(200).json(categories);
  }

  /**
   * @swagger
   * /api/product-categories/{id}:
   *   get:
   *     summary: Buscar categoria por ID
   *     tags: [Product Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Categoria encontrada
   *       404:
   *         description: Categoria não encontrada
   */
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await productCategoryService.getById(BigInt(id));
    return res.status(200).json(category);
  }

  /**
   * @swagger
   * /api/product-categories/{id}/stats:
   *   get:
   *     summary: Buscar categoria com estatísticas de produtos
   *     tags: [Product Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Categoria com estatísticas
   *       404:
   *         description: Categoria não encontrada
   */
  async getWithStats(req: Request, res: Response) {
    const { id } = req.params;
    const categoryWithStats = await productCategoryService.getWithStats(BigInt(id));
    return res.status(200).json(categoryWithStats);
  }

  /**
   * @swagger
   * /api/product-categories/{id}:
   *   put:
   *     summary: Atualizar categoria de produto
   *     tags: [Product Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               product_category_name:
   *                 type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Categoria atualizada
   *       404:
   *         description: Categoria não encontrada
   *       409:
   *         description: Nome já existe
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data: UpdateProductCategoryInput = req.body;
    const category = await productCategoryService.update(BigInt(id), data);
    return res.status(200).json(category);
  }

  /**
   * @swagger
   * /api/product-categories/{id}:
   *   delete:
   *     summary: Deletar (desativar) categoria de produto
   *     tags: [Product Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Categoria deletada
   *       400:
   *         description: Categoria possui produtos vinculados
   *       404:
   *         description: Categoria não encontrada
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await productCategoryService.delete(BigInt(id));
    return res.status(200).json({ message: 'Categoria deletada com sucesso' });
  }
}
