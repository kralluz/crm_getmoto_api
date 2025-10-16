import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();
const serviceController = new ServiceController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Criar nova ordem de serviço
 *     description: Registra uma nova ordem de serviço para uma moto
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, motorcycleId, userId, description]
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               motorcycleId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: Mecânico responsável
 *               description:
 *                 type: string
 *                 minLength: 5
 *               diagnosis:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS]
 *                 default: PENDING
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               estimatedEndDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               laborCost:
 *                 type: number
 *                 minimum: 0
 *               totalCost:
 *                 type: number
 *                 minimum: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/',
  validateBody(createServiceSchema),
  serviceController.create.bind(serviceController)
);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Listar ordens de serviço
 *     description: Retorna lista de serviços com filtros opcionais
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS]
 *         description: Filtrar por status
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por cliente
 *     responses:
 *       200:
 *         description: Lista de serviços
 *       401:
 *         description: Não autenticado
 */
router.get('/', serviceController.getAll.bind(serviceController));

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Buscar serviço por ID
 *     description: Retorna dados detalhados de uma ordem de serviço
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dados do serviço
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/:id',
  validateParams(idParamSchema),
  serviceController.getById.bind(serviceController)
);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Atualizar ordem de serviço
 *     description: Atualiza dados de uma ordem de serviço existente
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS]
 *               estimatedEndDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               laborCost:
 *                 type: number
 *               totalCost:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Serviço não encontrado
 */
router.put('/:id',
  validateParams(idParamSchema),
  validateBody(updateServiceSchema),
  serviceController.update.bind(serviceController)
);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Deletar ordem de serviço
 *     description: Remove uma ordem de serviço do sistema
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Serviço deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:id',
  validateParams(idParamSchema),
  serviceController.delete.bind(serviceController)
);

export default router;
