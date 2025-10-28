import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema, createStockMovementSchema } from '../schemas/product.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar novo produto
 *     description: Cadastra um novo produto no estoque
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, costPrice, salePrice]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               brand:
 *                 type: string
 *                 maxLength: 100
 *               code:
 *                 type: string
 *                 maxLength: 50
 *                 description: Código interno do produto
 *               barcode:
 *                 type: string
 *                 maxLength: 50
 *                 description: Código de barras
 *               category:
 *                 type: string
 *                 maxLength: 100
 *               costPrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Preço de custo
 *               salePrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Preço de venda (deve ser >= preço de custo)
 *               stockQuantity:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *               minStock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Estoque mínimo
 *               maxStock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Estoque máximo
 *               unit:
 *                 type: string
 *                 maxLength: 10
 *                 default: UN
 *                 description: Unidade de medida (UN, KG, L, etc)
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       409:
 *         description: Código ou código de barras já cadastrado
 */
router.post(
  '/',
  validateBody(createProductSchema),
  productController.create.bind(productController)
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos
 *     description: Obtém lista de produtos com filtros opcionais
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filtrar produtos com estoque baixo (quantidade <= estoque mínimo)
 *     responses:
 *       200:
 *         description: Lista de produtos
 *       401:
 *         description: Não autenticado
 */
router.get('/', productController.getAll.bind(productController));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     description: Retorna dados detalhados de um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id',
  validateParams(idParamSchema),
  productController.getById.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     description: Atualiza dados de um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               code:
 *                 type: string
 *               barcode:
 *                 type: string
 *               category:
 *                 type: string
 *               costPrice:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *               minStock:
 *                 type: integer
 *               maxStock:
 *                 type: integer
 *               unit:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Código ou código de barras já em uso
 */
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  productController.update.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deletar produto
 *     description: Remove um produto do sistema (soft delete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  '/:id',
  validateParams(idParamSchema),
  productController.delete.bind(productController)
);

/**
 * @swagger
 * /api/products/stock/movements:
 *   post:
 *     summary: Adicionar movimentação de estoque
 *     description: Registra entrada, saída ou ajuste de estoque (apenas ADMIN e MANAGER)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, type, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [ENTRY, EXIT, ADJUSTMENT]
 *                 description: ENTRY (entrada), EXIT (saída), ADJUSTMENT (ajuste)
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               unitPrice:
 *                 type: number
 *                 minimum: 0
 *               totalPrice:
 *                 type: number
 *                 minimum: 0
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: Motivo da movimentação
 *               reference:
 *                 type: string
 *                 maxLength: 100
 *                 description: Referência (número NF, ordem de serviço, etc)
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Movimentação registrada com sucesso
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 */
router.post(
  '/stock/movements',
  validateBody(createStockMovementSchema),
  productController.addStockMovement.bind(productController)
);

/**
 * @swagger
 * /api/products/stock/movements:
 *   get:
 *     summary: Listar movimentações de estoque
 *     description: Retorna histórico de movimentações com filtros opcionais
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por produto
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *       401:
 *         description: Não autenticado
 */
router.get('/stock/movements', productController.getStockMovements.bind(productController));

export default router;
