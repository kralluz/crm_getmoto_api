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
    user_id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password_hash: '$2a$10$hashedpassword',
    role: UserRole.ADMIN,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    position: null,
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
      is_active: true,
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
          name: registerData.name,
          email: registerData.email,
          password_hash: '$2a$10$hashedpassword',
          role: registerData.role,
          position: null,
          is_active: registerData.is_active,
        },
      });
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({
        userId: mockUser.user_id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: {
          user_id: mockUser.user_id,
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
      expect(hashUtil.comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password_hash);
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({
        userId: mockUser.user_id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: {
          user_id: mockUser.user_id,
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
      const inactiveUser = { ...mockUser, is_active: false };
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
    const userId = 1;

    it('deve retornar informações do usuário', async () => {
      const userWithoutPassword = {
        user_id: mockUser.user_id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        is_active: mockUser.is_active,
        position: mockUser.position,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword);

      const result = await authService.me(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
      expect(result).toEqual(userWithoutPassword);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.me(userId)).rejects.toThrow('Usuário não encontrado');
    });
  });
});
