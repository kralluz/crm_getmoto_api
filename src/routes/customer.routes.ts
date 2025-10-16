import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();
const customerController = new CustomerController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Criar novo cliente
 *     description: Cadastra um novo cliente no sistema
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9]{10,15}$'
 *                 description: Apenas números
 *               cpf:
 *                 type: string
 *                 pattern: '^[0-9]{11}$'
 *                 description: CPF com 11 dígitos
 *               address:
 *                 type: string
 *                 maxLength: 500
 *               city:
 *                 type: string
 *                 maxLength: 100
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: Sigla do estado (ex SP, RJ)
 *               zipCode:
 *                 type: string
 *                 pattern: '^[0-9]{8}$'
 *                 description: CEP com 8 dígitos
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Email ou CPF já cadastrado
 */
router.post('/',
  validateBody(createCustomerSchema),
  customerController.create.bind(customerController)
);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Listar clientes
 *     description: Retorna lista de clientes com filtro opcional por status
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autenticado
 */
router.get('/', customerController.getAll.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Buscar cliente por ID
 *     description: Retorna dados detalhados de um cliente incluindo motos e histórico de serviços
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Dados do cliente
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id',
  validateParams(idParamSchema),
  customerController.getById.bind(customerController)
);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     description: Atualiza dados de um cliente existente
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               cpf:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               notes:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Cliente não encontrado
 *       409:
 *         description: Email ou CPF já em uso
 */
router.put('/:id',
  validateParams(idParamSchema),
  validateBody(updateCustomerSchema),
  customerController.update.bind(customerController)
);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Deletar cliente
 *     description: Remove um cliente do sistema
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id',
  validateParams(idParamSchema),
  customerController.delete.bind(customerController)
);

export default router;
