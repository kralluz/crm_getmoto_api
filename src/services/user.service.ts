import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/hash.util';
import { UpdateUserInput } from '../interfaces/user.interface';

export class UserService {
  async getAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await this.getById(id);

    if (data.email && data.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new AppError('Email já está em uso', 400);
      }
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.user.delete({ where: { id } });
  }
}
