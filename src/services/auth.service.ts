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
      throw new AppError('Email já cadastrado', 409);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: data.role || 'ATTENDANT',
        position: data.position || null,
        is_active: data.is_active ?? true,
      },
    });

    // Gerar token JWT
    const token = generateToken({
      userId: Number(user.user_id),
      email: user.email!,
      role: user.role!,
    });

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email!,
        role: user.role as any,
      },
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Verificar se usuário existe
    if (!user || !user.email || !user.password_hash) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar se usuário está ativo
    if (!user.is_active) {
      throw new AppError('Usuário inativo', 401);
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(data.password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token JWT
    const token = generateToken({
      userId: Number(user.user_id),
      email: user.email,
      role: user.role || 'ATTENDANT',
    });

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: (user.role || 'ATTENDANT') as any,
      },
    };
  }

  async me(userId: bigint | number) {
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(userId) },
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
}
