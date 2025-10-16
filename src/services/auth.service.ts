import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { generateToken } from '../utils/jwt.util';
import { LoginInput, CreateUserInput, AuthResponse } from '../interfaces/user.interface';

export class AuthService {
  async register(data: CreateUserInput): Promise<AuthResponse> {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw AppError.conflict('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Verificar se usuário existe
    if (!user) {
      throw AppError.unauthorized('Credenciais inválidas');
    }

    // Verificar se usuário está ativo
    if (!user.active) {
      throw AppError.unauthorized('Usuário inativo');
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw AppError.unauthorized('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      throw AppError.notFound('Usuário não encontrado');
    }

    return user;
  }
}
