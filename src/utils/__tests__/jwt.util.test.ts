import { generateToken, verifyToken } from '../jwt.util';
import { UserRole } from '@prisma/client';

describe('JWT Util', () => {
  const mockPayload = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: UserRole.ADMIN,
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  describe('generateToken', () => {
    it('deve gerar um token JWT válido', () => {
      const token = generateToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('deve gerar tokens diferentes com payloads diferentes', () => {
      const payload1 = { ...mockPayload, userId: 'user1' };
      const payload2 = { ...mockPayload, userId: 'user2' };
      
      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);
      
      expect(token1).not.toBe(token2);
    });

    it('deve incluir as informações do payload no token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });
  });

  describe('verifyToken', () => {
    it('deve verificar e decodificar um token válido', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('deve lançar erro para token inválido', () => {
      const invalidToken = 'token.invalido.aqui';
      
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('deve lançar erro para token expirado', () => {
      // Configura expiração imediata
      process.env.JWT_EXPIRES_IN = '0s';
      const token = generateToken(mockPayload);
      
      // Aguarda um pouco para o token expirar
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => verifyToken(token)).toThrow();
          // Restaura configuração
          process.env.JWT_EXPIRES_IN = '1h';
          resolve(true);
        }, 100);
      });
    });

    it('deve lançar erro para token com assinatura inválida', () => {
      const token = generateToken(mockPayload);
      // Altera o secret para invalidar a assinatura
      process.env.JWT_SECRET = 'outro-secret';
      
      expect(() => verifyToken(token)).toThrow();
      
      // Restaura o secret original
      process.env.JWT_SECRET = 'test-secret';
    });
  });
});
