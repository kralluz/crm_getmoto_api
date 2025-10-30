import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateVehicleInput, UpdateVehicleInput } from '../interfaces/motorcycle.interface';

export class VehicleService {
  /**
   * Transforma veículo do banco para resposta da API
   */
  private transformVehicleResponse(vehicle: any) {
    if (!vehicle) return vehicle;
    return vehicle;
  }

  async create(data: CreateVehicleInput) {
    // Verificar se placa já existe
    const existingVehicle = await prisma.vehicles.findUnique({
      where: { plate: data.plate },
    });

    if (existingVehicle) {
      throw new AppError('Veículo já cadastrado com esta placa', 409);
    }

    const vehicle = await prisma.vehicles.create({
      data: {
        brand: data.brand || null,
        model: data.model || null,
        color: data.color || null,
        plate: data.plate,
        year: data.year || null,
        is_active: data.is_active ?? true,
      },
    });

    return this.transformVehicleResponse(vehicle);
  }

  async getAll(params?: { is_active?: boolean; search?: string }) {
    const where: any = {};

    if (params?.is_active !== undefined) {
      where.is_active = params.is_active;
    }

    if (params?.search) {
      where.OR = [
        { plate: { contains: params.search, mode: 'insensitive' } },
        { brand: { contains: params.search, mode: 'insensitive' } },
        { model: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const vehicles = await prisma.vehicles.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: {
            service_order: true,
          },
        },
      },
    });

    return vehicles.map(vehicle => this.transformVehicleResponse(vehicle));
  }

  async getById(vehicle_id: bigint | number) {
    const vehicle = await prisma.vehicles.findUnique({
      where: { vehicle_id: BigInt(vehicle_id) },
      include: {
        _count: {
          select: {
            service_order: true,
          },
        },
        service_order: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          take: 10,
          select: {
            service_order_id: true,
            status: true,
            service_description: true,
            created_at: true,
            finalized_at: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new AppError('Veículo não encontrado', 404);
    }

    return this.transformVehicleResponse(vehicle);
  }

  async update(vehicle_id: bigint | number, data: UpdateVehicleInput) {
    await this.getById(vehicle_id);

    // Se está alterando a placa, verificar se já existe
    if (data.plate) {
      const existingVehicle = await prisma.vehicles.findFirst({
        where: {
          plate: data.plate,
          vehicle_id: { not: BigInt(vehicle_id) },
        },
      });

      if (existingVehicle) {
        throw new AppError('Já existe outro veículo com esta placa', 409);
      }
    }

    const updateData: any = {};
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.plate !== undefined) updateData.plate = data.plate;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    updateData.updated_at = new Date();

    const vehicle = await prisma.vehicles.update({
      where: { vehicle_id: BigInt(vehicle_id) },
      data: updateData,
      include: {
        _count: {
          select: {
            service_order: true,
          },
        },
      },
    });

    return this.transformVehicleResponse(vehicle);
  }

  async delete(vehicle_id: bigint | number) {
    await this.getById(vehicle_id);

    // Verificar se existem ordens de serviço ativas vinculadas
    const activeOrders = await prisma.service_order.count({
      where: {
        vehicle_id: BigInt(vehicle_id),
        is_active: true,
      },
    });

    if (activeOrders > 0) {
      throw new AppError(
        `Não é possível deletar este veículo. Existem ${activeOrders} ordem(ns) de serviço ativa(s) vinculada(s).`,
        400
      );
    }

    // Soft delete
    await prisma.vehicles.update({
      where: { vehicle_id: BigInt(vehicle_id) },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });

    return { message: 'Veículo deletado com sucesso' };
  }
}
