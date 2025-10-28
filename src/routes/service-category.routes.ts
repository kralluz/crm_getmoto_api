import { Router } from 'express';
import { ServiceCategoryController } from '../controllers/service-category.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createServiceCategorySchema, updateServiceCategorySchema } from '../schemas/service.schema';

const router = Router();
const controller = new ServiceCategoryController();

/**
 * @swagger
 * /api/service-categories:
 *   post:
 *     summary: Criar nova categoria de serviço
 *     description: Cadastra uma nova categoria de serviço
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
 *                 minLength: 3
 *                 maxLength: 255
 *               service_cost:
 *                 type: number
 *                 minimum: 0
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       409:
 *         description: Categoria já existe
 */
router.post(
  '/',
  validateBody(createServiceCategorySchema),
  controller.create
);

/**
 * @swagger
 * /api/service-categories:
 *   get:
 *     summary: Listar todas as categorias de serviços
 *     description: Retorna lista de categorias de serviços
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
router.get(
  '/',
  controller.getAll
);

/**
 * @swagger
 * /api/service-categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     description: Retorna uma categoria específica
 *     tags: [Service Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get(
  '/:id',
  controller.getById
);

/**
 * @swagger
 * /api/service-categories/{id}/stats:
 *   get:
 *     summary: Buscar categoria com estatísticas
 *     description: Retorna categoria com estatísticas de serviços
 *     tags: [Service Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria com estatísticas
 *       404:
 *         description: Categoria não encontrada
 */
router.get(
  '/:id/stats',
  controller.getWithStats
);

/**
 * @swagger
 * /api/service-categories/{id}:
 *   put:
 *     summary: Atualizar categoria de serviço
 *     description: Atualiza os dados de uma categoria
 *     tags: [Service Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_category_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               service_cost:
 *                 type: number
 *                 minimum: 0
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
router.put(
  '/:id',
  validateBody(updateServiceCategorySchema),
  controller.update
);

/**
 * @swagger
 * /api/service-categories/{id}:
 *   delete:
 *     summary: Deletar categoria de serviço
 *     description: Desativa uma categoria (soft delete)
 *     tags: [Service Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria deletada
 *       400:
 *         description: Categoria possui serviços vinculados
 *       404:
 *         description: Categoria não encontrada
 */
router.delete(
  '/:id',
  controller.delete
);

export default router;
