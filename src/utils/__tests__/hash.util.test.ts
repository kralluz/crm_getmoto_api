import { hashPassword, comparePassword } from '../hash.util';

describe('Hash Util', () => {
  describe('hashPassword', () => {
    it('deve gerar um hash da senha', async () => {
      const password = 'senha123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('deve gerar hashes diferentes para a mesma senha', async () => {
      const password = 'senha123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('deve funcionar com senhas de diferentes tamanhos', async () => {
      const shortPassword = 'abc';
      const longPassword = 'senhamuitolongacomnumerosecaracteresespeciaise123!@#';
      
      const hashShort = await hashPassword(shortPassword);
      const hashLong = await hashPassword(longPassword);
      
      expect(hashShort).toBeDefined();
      expect(hashLong).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('deve retornar true para senha correta', async () => {
      const password = 'senha123';
      const hash = await hashPassword(password);
      
      const result = await comparePassword(password, hash);
      
      expect(result).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const password = 'senha123';
      const wrongPassword = 'senha456';
      const hash = await hashPassword(password);
      
      const result = await comparePassword(wrongPassword, hash);
      
      expect(result).toBe(false);
    });

    it('deve ser case-sensitive', async () => {
      const password = 'Senha123';
      const hash = await hashPassword(password);
      
      const result = await comparePassword('senha123', hash);
      
      expect(result).toBe(false);
    });

    it('deve retornar false para hash inválido', async () => {
      const password = 'senha123';
      const invalidHash = 'hashInvalido123';
      
      const result = await comparePassword(password, invalidHash);
      
      expect(result).toBe(false);
    });
  });
});
