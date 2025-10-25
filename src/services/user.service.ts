import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/hash.util';
import { UpdateUserInput } from '../interfaces/user.interface';

export class UserService {
  async getAll() {
    return await prisma.users.findMany({
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getById(user_id: bigint | number) {
    const user = await prisma.users.findUnique({
      where: { user_id: BigInt(user_id) },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }

  async update(user_id: bigint | number, data: UpdateUserInput) {
    const user = await this.getById(user_id);

    if (data.email && data.email !== user.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new AppError('Email já está em uso', 400);
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    if (data.password) {
      updateData.password_hash = await hashPassword(data.password);
    }

    return await prisma.users.update({
      where: { user_id: BigInt(user_id) },
      data: updateData,
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async delete(user_id: bigint | number) {
    await this.getById(user_id);

    // Soft delete - marca como inativo
    return await prisma.users.update({
      where: { user_id: BigInt(user_id) },
      data: { is_active: false },
    });
  }
}
