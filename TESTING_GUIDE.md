# Guia de Testes - CRM GetMoto API

Este guia fornece informações sobre como executar e criar testes automatizados para a API.

## 📋 Índice

1. [Configuração](#configuração)
2. [Executando Testes](#executando-testes)
3. [Estrutura dos Testes](#estrutura-dos-testes)
4. [Exemplos de Testes](#exemplos-de-testes)
5. [Boas Práticas](#boas-práticas)
6. [Cobertura de Código](#cobertura-de-código)

## 🛠️ Configuração

### Dependências Instaladas

- **Jest**: Framework de testes
- **ts-jest**: Permite executar testes TypeScript com Jest
- **@types/jest**: Tipos TypeScript para Jest

### Configuração do Jest

O arquivo `jest.config.js` contém as configurações:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/swagger.ts',
    '!src/api-client/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
};
```

## 🚀 Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (reexecuta ao modificar arquivos)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes com saída detalhada
npm run test:verbose
```

### Executar Testes Específicos

```bash
# Executar apenas testes de um arquivo
npm test hash.util.test.ts

# Executar testes que correspondem a um padrão
npm test auth

# Executar um teste específico por nome
npm test -t "deve gerar um hash da senha"
```

## 📁 Estrutura dos Testes

Os testes estão organizados em diretórios `__tests__` próximos aos arquivos que testam:

```
src/
├── utils/
│   ├── hash.util.ts
│   ├── jwt.util.ts
│   └── __tests__/
│       ├── hash.util.test.ts
│       └── jwt.util.test.ts
├── services/
│   ├── auth.service.ts
│   └── __tests__/
│       └── auth.service.test.ts
└── middlewares/
    ├── auth.middleware.ts
    └── __tests__/
        └── auth.middleware.test.ts
```

## 📝 Exemplos de Testes

### 1. Testes de Utilitários (Utils)

**Testando funções de hash:**

```typescript
describe('Hash Util', () => {
  describe('hashPassword', () => {
    it('deve gerar um hash da senha', async () => {
      const password = 'senha123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });
  });
});
```

### 2. Testes de Services (com Mocks)

**Testando AuthService:**

```typescript
jest.mock('../../config/prisma');
jest.mock('../../utils/hash.util');
jest.mock('../../utils/jwt.util');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hashUtil.hashPassword as jest.Mock).mockResolvedValue('$2a$10$hash');
    
    const result = await authService.register(registerData);
    
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.token).toBeDefined();
  });
});
```

### 3. Testes de Middlewares

**Testando Auth Middleware:**

```typescript
describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('deve autenticar com token válido', async () => {
    mockRequest.headers = {
      authorization: 'Bearer valid.token',
    };
    
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
  });
});
```

## ✅ Boas Práticas

### 1. Nomenclatura

- **Arquivos de teste**: Use o sufixo `.test.ts` ou `.spec.ts`
- **Descrição dos testes**: Use linguagem clara e descritiva
- **Padrão AAA**: Arrange (preparar), Act (agir), Assert (verificar)

### 2. Organização

```typescript
describe('NomeDoModulo', () => {
  // Setup comum para todos os testes
  beforeEach(() => {
    // Limpar mocks, resetar estados
  });

  describe('nomeDaFuncao', () => {
    it('deve fazer X quando Y', () => {
      // Arrange
      const input = 'valor';
      
      // Act
      const result = funcao(input);
      
      // Assert
      expect(result).toBe('esperado');
    });
  });
});
```

### 3. Mocking

**Mock de Prisma:**
```typescript
jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));
```

**Mock de módulos:**
```typescript
jest.mock('../../utils/hash.util');
jest.mock('jsonwebtoken');
```

### 4. Testes Assíncronos

```typescript
it('deve processar dados assíncronos', async () => {
  const result = await funcaoAssincrona();
  expect(result).toBeDefined();
});
```

### 5. Testes de Erro

```typescript
it('deve lançar erro para entrada inválida', async () => {
  await expect(funcao(dadoInvalido))
    .rejects
    .toThrow('Mensagem de erro esperada');
});
```

## 📊 Cobertura de Código

### Visualizar Relatório de Cobertura

```bash
npm run test:coverage
```

Após executar, abra o relatório HTML:
```bash
open coverage/lcov-report/index.html
```

### Metas de Cobertura

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Configurando Limites de Cobertura

Adicione ao `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
},
```

## 🎯 Próximos Passos

Para expandir a cobertura de testes:

1. **Services**: Criar testes para:
   - `customer.service.ts`
   - `product.service.ts`
   - `service.service.ts`
   - `cashflow.service.ts`

2. **Controllers**: Criar testes para todos os controllers

3. **Middlewares**: Testar:
   - `error.middleware.ts`
   - `validate.middleware.ts`
   - `rate-limit.middleware.ts`

4. **Integração**: Criar testes de integração com banco de dados de teste

5. **E2E**: Criar testes end-to-end para fluxos completos

## 📚 Recursos Adicionais

- [Documentação do Jest](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 🐛 Troubleshooting

### Erro: Cannot find module

Verifique se todas as dependências estão instaladas:
```bash
npm install
```

### Testes lentos

Aumente o timeout no `jest.config.js`:
```javascript
testTimeout: 30000, // 30 segundos
```

### Mocks não funcionam

Certifique-se de chamar `jest.clearAllMocks()` no `beforeEach()`:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 📞 Suporte

Para dúvidas ou problemas com os testes, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
