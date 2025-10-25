import { Request, Response, NextFunction } from 'express';
import { authMiddleware, requireRole } from '../auth.middleware';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('deve autenticar com token válido', async () => {
      const mockPayload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };

      mockRequest.headers = {
        authorization: 'Bearer valid.jwt.token',
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(jwt.verify).toHaveBeenCalledWith('valid.jwt.token', process.env.JWT_SECRET);
      expect(mockRequest.user).toEqual(mockPayload);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro se token não for fornecido', async () => {
      mockRequest.headers = {};

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
    });

    it('deve chamar next com erro para token com formato inválido', async () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
    });

    it('deve chamar next com erro se token for inválido', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid.token',
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeDefined();
    });
  });

  describe('requireRole', () => {
    const mockUser = {
      userId: 1,
      email: 'test@example.com',
      role: UserRole.MECHANIC,
    };

    beforeEach(() => {
      mockRequest.user = mockUser;
    });

    it('deve autorizar usuário com role permitida', () => {
      const middleware = requireRole(UserRole.ADMIN, UserRole.MECHANIC);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro se usuário não tiver role permitida', () => {
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.message).toContain('Sem permissão');
    });

    it('deve chamar next com erro se usuário não estiver autenticado', () => {
      mockRequest.user = undefined;
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.message).toContain('não autenticado');
    });

    it('deve autorizar quando role corresponde', () => {
      mockRequest.user = { ...mockUser, role: UserRole.ADMIN };
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
