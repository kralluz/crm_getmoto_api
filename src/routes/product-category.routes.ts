import { Router } from 'express';
import { ProductCategoryController } from '../controllers/product-category.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createProductCategorySchema, updateProductCategorySchema } from '../schemas/product.schema';

const router = Router();
const controller = new ProductCategoryController();

/**
 * @swagger
 * /api/product-categories:
 *   post:
 *     summary: Criar nova categoria de produto
 *     description: Cadastra uma nova categoria de produto
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
 *                 minLength: 3
 *                 maxLength: 255
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
  validateBody(createProductCategorySchema),
  controller.create
);

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     summary: Listar todas as categorias de produtos
 *     description: Retorna lista de categorias de produtos
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
router.get(
  '/',
  controller.getAll
);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     description: Retorna uma categoria específica
 *     tags: [Product Categories]
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
 * /api/product-categories/{id}/stats:
 *   get:
 *     summary: Buscar categoria com estatísticas
 *     description: Retorna categoria com estatísticas de produtos
 *     tags: [Product Categories]
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
 * /api/product-categories/{id}:
 *   put:
 *     summary: Atualizar categoria de produto
 *     description: Atualiza os dados de uma categoria
 *     tags: [Product Categories]
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
 *               product_category_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
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
  validateBody(updateProductCategorySchema),
  controller.update
);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   delete:
 *     summary: Deletar categoria de produto
 *     description: Desativa uma categoria (soft delete)
 *     tags: [Product Categories]
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
 *         description: Categoria possui produtos vinculados
 *       404:
 *         description: Categoria não encontrada
 */
router.delete(
  '/:id',
  controller.delete
);

export default router;
