import { Router } from 'express';
import { CashFlowController } from '../controllers/cashflow.controller';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createCashFlowSchema, updateCashFlowSchema } from '../schemas/cashflow.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();
const cashFlowController = new CashFlowController();

// Todas as rotas requerem autenticação
// TEMPORARIAMENTE DESABILITADO PARA TESTES
// router.use(authMiddleware);

/**
 * @swagger
 * /api/cashflow:
 *   post:
 *     summary: Criar registro de fluxo de caixa
 *     description: Adiciona uma nova entrada ou saída no fluxo de caixa (apenas ADMIN e MANAGER)
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, type, category, amount, description]
 *             properties:
 *               paymentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do pagamento relacionado (opcional)
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do usuário que registrou
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 description: INCOME (entrada) ou EXPENSE (saída)
 *               category:
 *                 type: string
 *                 minLength: 3
 *                 description: Categoria da transação (ex. Serviço, Venda, Compra, Salário)
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Valor da transação
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 description: Descrição detalhada
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data da transação
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post(
  '/',
  // requireRole('ADMIN', 'MANAGER'), // TEMPORARIAMENTE DESABILITADO
  validateBody(createCashFlowSchema),
  cashFlowController.create.bind(cashFlowController)
);

/**
 * @swagger
 * /api/cashflow:
 *   get:
 *     summary: Listar registros de fluxo de caixa
 *     description: Retorna lista de transações com filtros opcionais
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filtrar por tipo de transação
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
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
 *         description: Lista de registros
 *       401:
 *         description: Não autenticado
 */
router.get('/', cashFlowController.getAll.bind(cashFlowController));

/**
 * @swagger
 * /api/cashflow/summary:
 *   get:
 *     summary: Resumo financeiro
 *     description: Retorna resumo geral do fluxo de caixa (total de entradas, saídas e saldo)
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtro
 *     responses:
 *       200:
 *         description: Resumo financeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   description: Total de entradas
 *                 totalExpense:
 *                   type: number
 *                   description: Total de saídas
 *                 balance:
 *                   type: number
 *                   description: Saldo (entradas - saídas)
 *       401:
 *         description: Não autenticado
 */
router.get('/summary', cashFlowController.getSummary.bind(cashFlowController));

/**
 * @swagger
 * /api/cashflow/summary/categories:
 *   get:
 *     summary: Resumo por categorias
 *     description: Retorna resumo agrupado por categoria
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtro
 *     responses:
 *       200:
 *         description: Resumo por categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [INCOME, EXPENSE]
 *                   total:
 *                     type: number
 *                   count:
 *                     type: integer
 *       401:
 *         description: Não autenticado
 */
router.get('/summary/categories', cashFlowController.getCategorySummary.bind(cashFlowController));

/**
 * @swagger
 * /api/cashflow/{id}:
 *   get:
 *     summary: Buscar registro por ID
 *     description: Retorna dados detalhados de um registro de fluxo de caixa
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro
 *     responses:
 *       200:
 *         description: Dados do registro
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Registro não encontrado
 */
router.get('/:id',
  validateParams(idParamSchema),
  cashFlowController.getById.bind(cashFlowController)
);

/**
 * @swagger
 * /api/cashflow/{id}:
 *   put:
 *     summary: Atualizar registro
 *     description: Atualiza dados de um registro de fluxo de caixa (apenas ADMIN e MANAGER)
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Registro não encontrado
 */
router.put(
  '/:id',
  // requireRole('ADMIN', 'MANAGER'), // TEMPORARIAMENTE DESABILITADO
  validateParams(idParamSchema),
  validateBody(updateCashFlowSchema),
  cashFlowController.update.bind(cashFlowController)
);

/**
 * @swagger
 * /api/cashflow/{id}:
 *   delete:
 *     summary: Deletar registro
 *     description: Remove um registro de fluxo de caixa (apenas ADMIN)
 *     tags: [CashFlow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro
 *     responses:
 *       204:
 *         description: Registro deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Registro não encontrado
 */
router.delete(
  '/:id',
  // requireRole('ADMIN'), // TEMPORARIAMENTE DESABILITADO
  validateParams(idParamSchema),
  cashFlowController.delete.bind(cashFlowController)
);

export default router;
