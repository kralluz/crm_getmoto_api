import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateServiceInput, UpdateServiceInput } from '../interfaces/service.interface';

export class ServiceService {
  async create(data: CreateServiceInput) {
    const service = await prisma.service.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        customer: true,
        motorcycle: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        serviceItems: true,
        payments: true,
      },
    });

    return service;
  }

  async getAll(status?: string, customerId?: string) {
    return await prisma.service.findMany({
      where: {
        status: status ? status as any : undefined,
        customerId,
      },
      include: {
        customer: true,
        motorcycle: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        serviceItems: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        customer: true,
        motorcycle: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        serviceItems: { include: { product: true } },
        payments: true,
      },
    });

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    return service;
  }

  async update(id: string, data: UpdateServiceInput) {
    await this.getById(id);

    return await prisma.service.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        customer: true,
        motorcycle: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        serviceItems: true,
        payments: true,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.service.delete({ where: { id } });
  }
}
