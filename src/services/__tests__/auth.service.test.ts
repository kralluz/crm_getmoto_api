import { AuthService } from '../auth.service';
import prisma from '../../config/prisma';
import * as hashUtil from '../../utils/hash.util';
import * as jwtUtil from '../../utils/jwt.util';
import { UserRole } from '@prisma/client';

// Mock dos módulos
jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../utils/hash.util');
jest.mock('../../utils/jwt.util');

describe('AuthService', () => {
  let authService: AuthService;
  
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$hashedpassword',
    role: UserRole.ADMIN,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToken = 'mock.jwt.token';

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'senha123',
      role: UserRole.ATTENDANT,
      active: true,
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hashUtil.hashPassword as jest.Mock).mockResolvedValue('$2a$10$hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.register(registerData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerData.email },
      });
      expect(hashUtil.hashPassword).toHaveBeenCalledWith(registerData.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...registerData,
          password: '$2a$10$hashedpassword',
        },
      });
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('deve lançar erro se email já estiver cadastrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register(registerData)).rejects.toThrow('Email já cadastrado');
      
      expect(hashUtil.hashPassword).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'senha123',
    };

    it('deve fazer login com credenciais válidas', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.login(loginData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(hashUtil.comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('deve lançar erro se usuário não existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow('Credenciais inválidas');
      
      expect(hashUtil.comparePassword).not.toHaveBeenCalled();
    });

    it('deve lançar erro se usuário estiver inativo', async () => {
      const inactiveUser = { ...mockUser, active: false };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(inactiveUser);

      await expect(authService.login(loginData)).rejects.toThrow('Usuário inativo');
      
      expect(hashUtil.comparePassword).not.toHaveBeenCalled();
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow('Credenciais inválidas');
      
      expect(jwtUtil.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('deve retornar informações do usuário', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        active: mockUser.active,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword);

      const result = await authService.me(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
      expect(result).toEqual(userWithoutPassword);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.me(userId)).rejects.toThrow('Usuário não encontrado');
    });
  });
});
