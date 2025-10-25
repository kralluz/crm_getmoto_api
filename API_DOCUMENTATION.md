# 📚 CRM GetMoto - Documentação da API

## 🚀 Visão Geral

API RESTful para gestão completa de oficina de motos, incluindo:
- Gerenciamento de usuários e autenticação
- Controle de produtos e estoque
- Ordens de serviço
- Fluxo de caixa
- Relatórios financeiros

**Versão**: 1.0.0  
**Base URL**: `http://localhost:3000`  
**Documentação Swagger**: `http://localhost:3000/api-docs`

---

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Obter Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@getmoto.com",
  "password": "senha123"
}
```

### Usar Token
Incluir o token no header de todas as requisições autenticadas:
```http
Authorization: Bearer {seu_token_jwt}
```

---

## 📋 Endpoints

### 🔑 Auth (`/api/auth`)

#### POST `/api/auth/register`
Criar novo usuário (rate-limited: 3/hora)

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "MECHANIC",
  "position": "Mecânico Sênior"
}
```

#### POST `/api/auth/login`
Fazer login (rate-limited: 5/15min)

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "1",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "MECHANIC"
  }
}
```

#### GET `/api/auth/me`
Obter dados do usuário autenticado

---

### 👥 Users (`/api/users`)

Todas as rotas requerem autenticação.

#### GET `/api/users`
Listar todos os usuários

#### GET `/api/users/:id`
Buscar usuário por ID

#### PUT `/api/users/:id`
Atualizar usuário (ADMIN, MANAGER apenas)

#### DELETE `/api/users/:id`
Deletar usuário (ADMIN apenas)

---

### 📦 Products (`/api/products`)

#### POST `/api/products`
Criar produto (ADMIN, MANAGER)

**Request:**
```json
{
  "category_id": 1,
  "product_name": "Óleo Motul 10W40",
  "quantity": 50,
  "quantity_alert": 10,
  "buy_price": 45.50,
  "sell_price": 85.00
}
```

#### GET `/api/products`
Listar produtos

**Query Params:**
- `active`: boolean - Filtrar por status
- `lowStock`: boolean - Produtos com estoque baixo

#### GET `/api/products/:id`
Buscar produto por ID

#### PUT `/api/products/:id`
Atualizar produto (ADMIN, MANAGER)

#### DELETE `/api/products/:id`
Deletar produto (ADMIN)

#### POST `/api/products/stock/movements`
Registrar movimentação de estoque (ADMIN, MANAGER)

**Request:**
```json
{
  "product_id": 1,
  "user_id": 1,
  "move_type": "ENTRY",
  "quantity": 20,
  "notes": "Compra fornecedor XYZ"
}
```

**Move Types:**
- `ENTRY`: Entrada de estoque
- `EXIT`: Saída de estoque
- `ADJUSTMENT`: Ajuste de estoque

#### GET `/api/products/stock/movements`
Listar movimentações

**Query Params:**
- `productId`: number
- `startDate`: ISO date
- `endDate`: ISO date

---

### 🔧 Services (`/api/services`)

#### POST `/api/services`
Criar ordem de serviço

**Request:**
```json
{
  "service_category_id": 1,
  "motorcycle_id": 5,
  "customer_name": "Maria Santos",
  "service_description": "Troca de óleo e filtro",
  "status": "draft",
  "estimated_labor_cost": 120.00
}
```

**Status Values:**
- `draft`: Rascunho
- `in_progress`: Em andamento
- `completed`: Concluído
- `cancelled`: Cancelado

#### GET `/api/services`
Listar ordens de serviço

**Query Params:**
- `status`: string - Filtrar por status
- `customer_name`: string - Buscar por nome do cliente

#### GET `/api/services/:id`
Buscar ordem por ID (retorna com produtos, serviços realizados e fluxo de caixa)

#### PUT `/api/services/:id`
Atualizar ordem de serviço

#### DELETE `/api/services/:id`
Deletar ordem de serviço (soft delete)

---

### 💰 CashFlow (`/api/cashflow`)

#### POST `/api/cashflow`
Criar registro de fluxo de caixa (ADMIN, MANAGER)

**Request:**
```json
{
  "service_order_id": 1,
  "amount": 250.50,
  "direction": "entrada",
  "note": "Pagamento serviço #1",
  "occurred_at": "2025-10-25T10:00:00Z"
}
```

**Direction Values:**
- `entrada`: Entrada de caixa
- `saida`: Saída de caixa

#### GET `/api/cashflow`
Listar registros de fluxo de caixa

**Query Params:**
- `direction`: string ('entrada' | 'saida')
- `startDate`: ISO date
- `endDate`: ISO date

#### GET `/api/cashflow/summary`
Resumo financeiro

**Query Params:**
- `startDate`: ISO date
- `endDate`: ISO date

**Response:**
```json
{
  "totalIncome": 15420.50,
  "totalExpense": 8320.00,
  "balance": 7100.50,
  "incomeCount": 42,
  "expenseCount": 28,
  "startDate": "2025-10-01T00:00:00Z",
  "endDate": "2025-10-25T23:59:59Z"
}
```

#### GET `/api/cashflow/summary/categories`
Resumo por categorias (serviços e produtos)

**Query Params:**
- `startDate`: ISO date
- `endDate`: ISO date

**Response:**
```json
[
  {
    "category": "Troca de Óleo",
    "type": "Serviço",
    "direction": "entrada",
    "total": 5420.00,
    "count": 18
  },
  {
    "category": "Óleo Motul 10W40",
    "type": "Produto",
    "direction": "entrada",
    "total": 2550.00,
    "count": 30
  }
]
```

#### GET `/api/cashflow/:id`
Buscar registro por ID

#### PUT `/api/cashflow/:id`
Atualizar registro (ADMIN, MANAGER)

#### DELETE `/api/cashflow/:id`
Deletar registro (soft delete - ADMIN)

---

## 🏥 Health Check

### GET `/health`
Verificar status da API e banco de dados

**Response:**
```json
{
  "status": "healthy",
  "message": "CRM API GetMoto is running",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "uptime": "42 minutes",
  "database": "connected",
  "memory": {
    "used": "128MB",
    "total": "256MB"
  },
  "environment": "development"
}
```

---

## ⚠️ Tratamento de Erros

A API retorna erros padronizados no seguinte formato:

```json
{
  "status": "error",
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

### Códigos de Status HTTP

- `200 OK`: Sucesso
- `201 Created`: Recurso criado
- `204 No Content`: Sucesso sem retorno
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: email já existe)
- `429 Too Many Requests`: Rate limit excedido
- `500 Internal Server Error`: Erro interno
- `503 Service Unavailable`: Banco de dados indisponível

---

## 🛡️ Segurança

### Rate Limiting
- API geral: **100 requisições / 15 minutos**
- Login: **5 tentativas / 15 minutos**
- Registro: **3 contas / hora**

### Validações
- Todos os inputs são validados com Zod schemas
- Check constraints do banco são reforçados nas validações
- Sanitização automática de dados

### Autenticação
- JWT com expiração de 7 dias
- Refresh token não implementado (usar re-autenticação)
- Senhas hashadas com bcrypt

---

## 📊 Roles e Permissões

| Role | Descrição | Permissões |
|------|-----------|------------|
| **ADMIN** | Administrador | Acesso total ao sistema |
| **MANAGER** | Gerente | Gerenciar produtos, estoque, usuários e finanças |
| **MECHANIC** | Mecânico | Criar e atualizar ordens de serviço |
| **ATTENDANT** | Atendente | Visualizar e criar ordens de serviço |

---

## 🔄 Integração Frontend (Orval)

Cliente TypeScript gerado automaticamente disponível em:
```
/src/api-client/
├── endpoints.ts       # Hooks React Query
├── endpoints.msw.ts   # Mocks MSW
├── models/            # Types TypeScript
└── axios-instance.ts  # Configuração Axios
```

### Exemplo de Uso (React Query)
```typescript
import { useGetApiAuthMe } from './api-client/endpoints';

function Profile() {
  const { data, isLoading, error } = useGetApiAuthMe();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return <div>Olá, {data.name}!</div>;
}
```

---

## 🧪 Desenvolvimento

### Variáveis de Ambiente
```env
DATABASE_URL="postgres://user:pass@host:port/db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
LOG_LEVEL="debug"
```

### Scripts NPM
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio

# Documentação
npm run swagger        # Gerar Swagger
npm run orval          # Gerar cliente TypeScript
npm run generate:client # Swagger + Orval
```

---

## 📝 Logs

Sistema de logging estruturado com Winston:

- **Console**: Logs coloridos em development
- **Arquivos**:
  - `logs/combined-YYYY-MM-DD.log`: Todos os logs
  - `logs/error-YYYY-MM-DD.log`: Apenas erros
- **Rotação**: Diária, mantém 14 dias
- **Formato**: JSON com timestamp

### Níveis de Log
- `error`: Erros críticos
- `warn`: Avisos
- `info`: Informações gerais
- `debug`: Debug detalhado (apenas development)

---

## 🚧 Limitações Conhecidas

1. **Check Constraints**: Prisma não valida totalmente os check constraints do banco. Validações compensadas pelos schemas Zod.
2. **Refresh Token**: Não implementado. Re-autenticação necessária após expiração.
3. **Upload de Arquivos**: Não implementado (ex: fotos de motos).
4. **Notificações**: Sistema de notificações não implementado.
5. **Relatórios PDF**: Geração de relatórios não implementada.

---

## 📞 Suporte

Para questões e problemas:
- Criar issue no repositório
- Contato: suporte@getmoto.com
- Documentação completa: `/api-docs`

---

**Desenvolvido com ❤️ pela equipe GetMoto**
