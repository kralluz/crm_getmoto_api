import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { loginLimiter, createAccountLimiter } from '../middlewares/rate-limit.middleware';
import { createUserSchema, loginSchema } from '../schemas/user.schema';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
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
 *                 default: ATTENDANT
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
router.post(
  '/register',
  createAccountLimiter,
  validateBody(createUserSchema),
  authController.register.bind(authController)
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  loginLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/me', authMiddleware, authController.me.bind(authController));

export default router;
