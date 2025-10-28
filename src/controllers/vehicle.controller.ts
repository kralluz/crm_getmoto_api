import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleInput, UpdateVehicleInput } from '../interfaces/motorcycle.interface';

const vehicleService = new VehicleService();

export class VehicleController {
  /**
   * @swagger
   * /api/vehicles:
   *   post:
   *     summary: Criar novo veículo
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
   *                 example: "Honda"
   *               model:
   *                 type: string
   *                 example: "CG 160"
   *               color:
   *                 type: string
   *                 example: "Vermelha"
   *               plate:
   *                 type: string
   *                 example: "ABC1D23"
   *               year:
   *                 type: integer
   *                 example: 2023
   *               is_active:
   *                 type: boolean
   *                 default: true
   *     responses:
   *       201:
   *         description: Veículo criado com sucesso
   *       409:
   *         description: Veículo já existe com esta placa
   */
  async create(req: Request, res: Response) {
    const data: CreateVehicleInput = req.body;
    const vehicle = await vehicleService.create(data);
    return res.status(201).json(vehicle);
  }

  /**
   * @swagger
   * /api/vehicles:
   *   get:
   *     summary: Listar todos os veículos
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
  async getAll(req: Request, res: Response) {
    const { is_active, search } = req.query;
    const isActive = is_active === 'true' ? true : is_active === 'false' ? false : undefined;
    const vehicles = await vehicleService.getAll({
      is_active: isActive,
      search: search as string,
    });
    return res.status(200).json(vehicles);
  }

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   get:
   *     summary: Buscar veículo por ID
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
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const vehicle = await vehicleService.getById(BigInt(id));
    return res.status(200).json(vehicle);
  }

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   put:
   *     summary: Atualizar veículo
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
   *               model:
   *                 type: string
   *               color:
   *                 type: string
   *               plate:
   *                 type: string
   *               year:
   *                 type: integer
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
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data: UpdateVehicleInput = req.body;
    const vehicle = await vehicleService.update(BigInt(id), data);
    return res.status(200).json(vehicle);
  }

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   delete:
   *     summary: Deletar veículo
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
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await vehicleService.delete(BigInt(id));
    return res.status(200).json(result);
  }
}
