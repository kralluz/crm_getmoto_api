import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createVehicleSchema, updateVehicleSchema } from '../schemas/motorcycle.schema';

const router = Router();
const controller = new VehicleController();

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Criar novo veículo
 *     description: Cadastra um novo veículo (moto) no sistema
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate
 *             properties:
 *               brand:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               model:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               color:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               plate:
 *                 type: string
 *                 minLength: 7
 *                 maxLength: 10
 *               year:
 *                 type: integer
 *                 minimum: 1900
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 *       409:
 *         description: Veículo já existe
 */
router.post(
  '/',
  validateBody(createVehicleSchema),
  controller.create
);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Listar todos os veículos
 *     description: Retorna lista de veículos com filtros opcionais
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por placa, marca ou modelo
 *     responses:
 *       200:
 *         description: Lista de veículos
 */
router.get(
  '/',
  controller.getAll
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Buscar veículo por ID
 *     description: Retorna um veículo específico com suas ordens de serviço
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do veículo
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *       404:
 *         description: Veículo não encontrado
 */
router.get(
  '/:id',
  controller.getById
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Atualizar veículo
 *     description: Atualiza os dados de um veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do veículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               model:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               color:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               plate:
 *                 type: string
 *                 minLength: 7
 *                 maxLength: 10
 *               year:
 *                 type: integer
 *                 minimum: 1900
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Veículo atualizado
 *       404:
 *         description: Veículo não encontrado
 *       409:
 *         description: Placa já existe
 */
router.put(
  '/:id',
  validateBody(updateVehicleSchema),
  controller.update
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Deletar veículo
 *     description: Desativa um veículo (soft delete)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do veículo
 *     responses:
 *       200:
 *         description: Veículo deletado
 *       400:
 *         description: Veículo possui ordens de serviço vinculadas
 *       404:
 *         description: Veículo não encontrado
 */
router.delete(
  '/:id',
  controller.delete
);

export default router;
