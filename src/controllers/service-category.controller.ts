import { Request, Response } from 'express';
import { ServiceCategoryService } from '../services/service-category.service';
import { CreateServiceCategoryInput, UpdateServiceCategoryInput } from '../interfaces/service.interface';

const serviceCategoryService = new ServiceCategoryService();

export class ServiceCategoryController {
  /**
   * @swagger
   * /api/service-categories:
   *   post:
   *     summary: Criar nova categoria de serviço
   *     tags: [Service Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - service_category_name
   *               - service_cost
   *             properties:
   *               service_category_name:
   *                 type: string
   *               service_cost:
   *                 type: number
   *               is_active:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Categoria criada com sucesso
   *       409:
   *         description: Categoria já existe
   */
  async create(req: Request, res: Response) {
    const data: CreateServiceCategoryInput = req.body;
    const category = await serviceCategoryService.create(data);
    return res.status(201).json(category);
  }

  /**
   * @swagger
   * /api/service-categories:
   *   get:
   *     summary: Listar todas as categorias de serviços
   *     tags: [Service Categories]
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
    const categories = await serviceCategoryService.getAll(isActive);
    return res.status(200).json(categories);
  }

  /**
   * @swagger
   * /api/service-categories/{id}:
   *   get:
   *     summary: Buscar categoria por ID
   *     tags: [Service Categories]
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
    const category = await serviceCategoryService.getById(BigInt(id));
    return res.status(200).json(category);
  }

  /**
   * @swagger
   * /api/service-categories/{id}/stats:
   *   get:
   *     summary: Buscar categoria com estatísticas de serviços
   *     tags: [Service Categories]
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
    const categoryWithStats = await serviceCategoryService.getWithStats(BigInt(id));
    return res.status(200).json(categoryWithStats);
  }

  /**
   * @swagger
   * /api/service-categories/{id}:
   *   put:
   *     summary: Atualizar categoria de serviço
   *     tags: [Service Categories]
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
   *               service_category_name:
   *                 type: string
   *               service_cost:
   *                 type: number
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
    const data: UpdateServiceCategoryInput = req.body;
    const category = await serviceCategoryService.update(BigInt(id), data);
    return res.status(200).json(category);
  }

  /**
   * @swagger
   * /api/service-categories/{id}:
   *   delete:
   *     summary: Deletar (desativar) categoria de serviço
   *     tags: [Service Categories]
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
   *         description: Categoria possui serviços vinculados
   *       404:
   *         description: Categoria não encontrada
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await serviceCategoryService.delete(BigInt(id));
    return res.status(200).json({ message: 'Categoria deletada com sucesso' });
  }
}
