import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { CreateCustomerInput, UpdateCustomerInput } from '../interfaces/customer.interface';

export class CustomerService {
  async create(data: CreateCustomerInput) {
    if (data.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new AppError('Email já cadastrado', 400);
      }
    }

    if (data.cpf) {
      const cpfExists = await prisma.customer.findUnique({
        where: { cpf: data.cpf },
      });
      if (cpfExists) {
        throw new AppError('CPF já cadastrado', 400);
      }
    }

    return await prisma.customer.create({
      data,
      include: { motorcycles: true },
    });
  }

  async getAll(active?: boolean) {
    return await prisma.customer.findMany({
      where: active !== undefined ? { active } : undefined,
      include: { motorcycles: true },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        motorcycles: true,
        services: {
          include: {
            motorcycle: true,
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return customer;
  }

  async update(id: string, data: UpdateCustomerInput) {
    await this.getById(id);

    if (data.email) {
      const emailExists = await prisma.customer.findFirst({
        where: { email: data.email, id: { not: id } },
      });
      if (emailExists) {
        throw new AppError('Email já está em uso', 400);
      }
    }

    if (data.cpf) {
      const cpfExists = await prisma.customer.findFirst({
        where: { cpf: data.cpf, id: { not: id } },
      });
      if (cpfExists) {
        throw new AppError('CPF já está em uso', 400);
      }
    }

    return await prisma.customer.update({
      where: { id },
      data,
      include: { motorcycles: true },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.customer.delete({ where: { id } });
  }
}
