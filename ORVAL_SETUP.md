# Configuração do Orval - Cliente API TypeScript

## O que é o Orval?

Orval é uma ferramenta que gera automaticamente um cliente API TypeScript completo e tipado a partir da especificação OpenAPI/Swagger da sua API. Isso garante:

- **Type Safety**: Todos os tipos são gerados automaticamente
- **Sincronização**: Cliente sempre sincronizado com a especificação da API
- **Produtividade**: Elimina a necessidade de escrever código de cliente manualmente
- **Mocks**: Gera mocks automáticos para testes

## Estrutura Gerada

```
src/api-client/
├── axios-instance.ts       # Instância customizada do Axios com interceptors
├── endpoints.ts            # Todos os endpoints da API tipados
├── endpoints.msw.ts        # Mocks usando Mock Service Worker
└── models/                 # Modelos TypeScript
    ├── user.ts
    ├── customer.ts
    ├── product.ts
    ├── service.ts
    ├── cashFlow.ts
    └── index.ts
```

## Instalação

As dependências já foram instaladas:

```bash
npm install --save axios
npm install --save-dev orval msw
```

## Configuração

### 1. Arquivo de Configuração (`orval.config.ts`)

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  'crm-api': {
    output: {
      mode: 'split',                              // Gera múltiplos arquivos
      target: './src/api-client/endpoints.ts',    // Arquivo principal
      schemas: './src/api-client/models',         // Pasta dos modelos
      client: 'axios',                            // Cliente HTTP (axios)
      mock: true,                                 // Gera mocks
      override: {
        mutator: {
          path: './src/api-client/axios-instance.ts',
          name: 'customAxiosInstance',
        },
      },
    },
    input: {
      target: './src/swagger-output.json',        // Especificação OpenAPI
    },
  },
});
```

### 2. Instância Customizada do Axios (`src/api-client/axios-instance.ts`)

O arquivo contém:
- Configuração de baseURL (padrão: http://localhost:3000)
- Interceptor para adicionar token de autenticação automaticamente
- Interceptor para tratamento de erros
- Suporte a cancelamento de requisições

**Configuração de Ambiente:**

```bash
# No .env
API_BASE_URL=http://localhost:3000
API_TOKEN=seu-token-aqui  # Opcional, para Node.js
```

**No Browser:**
```javascript
localStorage.setItem('auth_token', 'seu-token-jwt');
```

## Uso

### Scripts NPM

```bash
# Gerar apenas a especificação Swagger
npm run swagger

# Gerar apenas o cliente Orval (a partir do swagger-output.json)
npm run orval

# Gerar tudo (Swagger + Orval) em sequência
npm run generate:client
```

### Exemplo de Uso Básico

```typescript
import { getCRMAPIGetMoto } from './src/api-client/endpoints';
import { User, Customer } from './src/api-client/models';

// Inicializar cliente
const api = getCRMAPIGetMoto();

// Fazer login
async function login() {
  const response = await api.postLogin();
  return response;
}

// Buscar usuário autenticado
async function getMe() {
  const user = await api.getMe();
  console.log(user);
}

// Listar itens
async function listCustomers() {
  const customers = await api.get();
  return customers;
}

// Buscar por ID
async function getCustomerById(id: string) {
  const customer = await api.getId(id);
  return customer;
}

// Criar novo
async function createCustomer() {
  const newCustomer = await api.post();
  return newCustomer;
}

// Atualizar
async function updateCustomer(id: string) {
  const updated = await api.putId(id);
  return updated;
}

// Deletar
async function deleteCustomer(id: string) {
  await api.deleteId(id);
}
```

Veja `example-usage.ts` para mais exemplos.

## Endpoints Disponíveis

O cliente gerado inclui todos os 34 endpoints da API:

### Auth
- `postRegister()` - Registrar novo usuário
- `postLogin()` - Fazer login
- `getMe()` - Obter usuário autenticado

### CRUD Genérico
- `get()` - Listar todos
- `post()` - Criar novo
- `getId(id)` - Buscar por ID
- `putId(id)` - Atualizar
- `deleteId(id)` - Deletar

### Produtos/Estoque
- `postStockMovements()` - Adicionar movimentação de estoque
- `getStockMovements()` - Listar movimentações

### CashFlow
- `getSummary()` - Resumo financeiro
- `getSummaryCategories()` - Resumo por categorias

## Fluxo de Trabalho

### Quando modificar a API:

1. **Atualizar documentação Swagger nos comentários das rotas**
   ```typescript
   /**
    * @swagger
    * /api/users:
    *   get:
    *     summary: Listar usuários
    *     ...
    */
   ```

2. **Gerar nova especificação Swagger**
   ```bash
   npm run swagger
   ```

3. **Gerar novo cliente Orval**
   ```bash
   npm run orval
   ```

4. **Ou executar tudo de uma vez**
   ```bash
   npm run generate:client
   ```

### Versionamento

Os arquivos gerados estão no `.gitignore`:
- `src/api-client/endpoints.ts`
- `src/api-client/models/`
- `src/api-client/*.mock.ts`

**Apenas o `axios-instance.ts` é versionado** (configuração customizada).

Cada desenvolvedor ou CI/CD deve gerar o cliente executando:
```bash
npm run generate:client
```

## Mocks para Testes

O Orval gera automaticamente mocks usando MSW (Mock Service Worker):

```typescript
import { getCRMAPIGetMotoMock } from './src/api-client/endpoints.msw';

// Usar em testes
const handlers = getCRMAPIGetMotoMock();
```

## Troubleshooting

### Erro: "Cannot find module 'msw'"
```bash
npm install --save-dev msw
```

### Erro: "Cannot find swagger-output.json"
```bash
npm run swagger
```

### Cliente desatualizado
```bash
npm run generate:client
```

### Endpoints com nomes genéricos (get, post, etc)

Isso acontece porque o swagger-autogen não está capturando corretamente os nomes das operações. Para melhorar, você pode:

1. Adicionar `operationId` nos comentários Swagger das rotas
2. Ou ajustar o `override` no `orval.config.ts` para customizar os nomes

Exemplo com operationId:
```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     operationId: listUsers
 *     summary: Listar usuários
 */
```

## Benefícios

✅ **Type Safety Total**: TypeScript garante que você use a API corretamente
✅ **Menos Código**: Não precisa escrever chamadas HTTP manualmente
✅ **Sincronização Automática**: Cliente sempre atualizado com a API
✅ **Mocks Automáticos**: Facilita testes
✅ **Interceptors Configurados**: Autenticação e tratamento de erros prontos
✅ **Cancelamento de Requisições**: Suporte built-in

## Recursos Adicionais

- [Documentação Oficial do Orval](https://orval.dev/)
- [Swagger Autogen](https://github.com/davibaltar/swagger-autogen)
- [Mock Service Worker](https://mswjs.io/)

## Próximos Passos

1. Adicionar `operationId` nas rotas para melhorar nomes dos métodos
2. Configurar variáveis de ambiente para diferentes ambientes (dev, staging, prod)
3. Criar testes usando os mocks gerados
4. Integrar com React Query ou SWR para melhor gerenciamento de estado (opcional)

---

**Status**: ✅ Orval configurado e funcionando!
**Última atualização**: 2025-10-13
