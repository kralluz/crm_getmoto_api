import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../schemas/user.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();
const userController = new UserController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna lista de todos os usuários do sistema (sem senha)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, MANAGER, MECHANIC, ATTENDANT]
 *                   active:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autenticado
 */
router.get('/', userController.getAll.bind(userController));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna dados de um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id',
  validateParams(idParamSchema),
  userController.getById.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza dados de um usuário (apenas ADMIN e MANAGER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, MECHANIC, ATTENDANT]
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: Email já em uso
 */
router.put('/:id',
  requireRole('ADMIN', 'MANAGER'),
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  userController.update.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema (apenas ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id',
  requireRole('ADMIN'),
  validateParams(idParamSchema),
  userController.delete.bind(userController)
);

export default router;
