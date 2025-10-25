# 📚 CRM GetMoto - Documentação da API

## 🚀 Visão Geral

API RESTful para gestão completa de oficina de motos, desenvolvida com Node.js, TypeScript, Express, Prisma e PostgreSQL.

### Funcionalidades Principais

- ✅ **Autenticação JWT**: Sistema completo com diferentes níveis de acesso (ADMIN, MANAGER, MECHANIC, ATTENDANT)
- ✅ **Gestão de Usuários**: CRUD completo com controle de roles e permissões
- ✅ **Gestão de Produtos**: Controle de estoque, categorias, preços e movimentações
- ✅ **Ordens de Serviço**: Gerenciamento completo de serviços com status e diagnóstico
- ✅ **Fluxo de Caixa**: Controle financeiro detalhado com entradas, saídas e relatórios
- ✅ **Logging Estruturado**: Winston com rotação diária de logs
- ✅ **Validação Robusta**: Zod schemas para todos os endpoints
- ✅ **Rate Limiting**: Proteção contra abuso de API
- ✅ **Testes Automatizados**: Jest com cobertura de código

**Versão**: 1.0.0  
**Base URL**: `http://localhost:3000`  
**Documentação Swagger**: `http://localhost:3000/api-docs` (apenas em desenvolvimento)

---

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Obter Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@example.com",
    "role": "ADMIN"
  }
}
```

### Usar Token
Incluir o token no header de todas as requisições autenticadas:
```http
Authorization: Bearer {seu_token_jwt}
```

**Expiração**: 7 dias (configurável via `JWT_EXPIRES_IN`)

---

## 📋 Endpoints

### 🔑 Auth (`/api/auth`)

#### POST `/api/auth/register`
Criar novo usuário (rate-limited: 3 registros/hora)

**Autenticação**: Não requerida  
**Rate Limit**: 3 requisições por hora por IP

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "MECHANIC",
  "position": "Mecânico Sênior",
  "is_active": true
}
```

**Validações:**
- `name`: 3-100 caracteres
- `email`: formato válido e único
- `password`: mínimo 6 caracteres
- `role`: ADMIN | MANAGER | MECHANIC | ATTENDANT (padrão: ATTENDANT)
- `is_active`: boolean (padrão: true)

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "MECHANIC"
  }
}
```

**Erros:**
- `400`: Dados inválidos
- `409`: Email já cadastrado
- `429`: Rate limit excedido

---

#### POST `/api/auth/login`
Fazer login (rate-limited: 5 tentativas/15min)

**Autenticação**: Não requerida  
**Rate Limit**: 5 requisições por 15 minutos por IP

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "MECHANIC"
  }
}
```

**Erros:**
- `400`: Dados inválidos
- `401`: Credenciais inválidas
- `401`: Usuário inativo
- `429`: Rate limit excedido

---

#### GET `/api/auth/me`
Obter dados do usuário autenticado

**Autenticação**: Requerida (Bearer Token)

**Response (200):**
```json
{
  "user_id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "MECHANIC",
  "position": "Mecânico Sênior",
  "is_active": true,
  "created_at": "2025-10-25T10:00:00.000Z",
  "updated_at": "2025-10-25T10:00:00.000Z"
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Usuário não encontrado

---

### 👥 Users (`/api/users`)

**Autenticação**: Requerida em todas as rotas

#### GET `/api/users`
Listar todos os usuários

**Permissões**: Qualquer usuário autenticado

**Response (200):**
```json
[
  {
    "user_id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "MECHANIC",
    "position": "Mecânico Sênior",
    "is_active": true,
    "created_at": "2025-10-25T10:00:00.000Z"
  }
]
```

---

#### GET `/api/users/:id`
Buscar usuário por ID

**Permissões**: Qualquer usuário autenticado

**Response (200):**
```json
{
  "user_id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "MECHANIC",
  "position": "Mecânico Sênior",
  "is_active": true,
  "created_at": "2025-10-25T10:00:00.000Z",
  "updated_at": "2025-10-25T10:00:00.000Z"
}
```

**Erros:**
- `404`: Usuário não encontrado

---

#### PUT `/api/users/:id`
Atualizar usuário

**Permissões**: ADMIN, MANAGER

**Request:**
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "role": "MANAGER",
  "position": "Gerente",
  "is_active": true
}
```

**Response (200):**
```json
{
  "user_id": 1,
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "role": "MANAGER",
  "position": "Gerente",
  "is_active": true
}
```

**Erros:**
- `403`: Sem permissão
- `404`: Usuário não encontrado
- `409`: Email já em uso

---

#### DELETE `/api/users/:id`
Deletar usuário (soft delete)

**Permissões**: Apenas ADMIN

**Response (204):** No content

**Erros:**
- `403`: Sem permissão
- `404`: Usuário não encontrado

---

### 📦 Products (`/api/products`)

**Autenticação**: Requerida em todas as rotas

#### POST `/api/products`
Criar produto

**Permissões**: ADMIN, MANAGER

**Request:**
```json
{
  "category_id": 1,
  "product_name": "Óleo Motul 10W40",
  "quantity": 50.500,
  "quantity_alert": 10.000,
  "buy_price": 45.50,
  "sell_price": 85.00
}
```

**Validações:**
- `category_id`: ID válido de categoria existente
- `product_name`: 1-255 caracteres
- `quantity`: número decimal (até 3 casas decimais)
- `quantity_alert`: número decimal para alerta de estoque baixo
- `buy_price`: decimal positivo (2 casas decimais)
- `sell_price`: decimal positivo (2 casas decimais)

**Response (201):**
```json
{
  "product_id": 1,
  "category_id": 1,
  "product_name": "Óleo Motul 10W40",
  "quantity": "50.500",
  "quantity_alert": "10.000",
  "buy_price": "45.50",
  "sell_price": "85.00",
  "is_active": true,
  "created_at": "2025-10-25T10:00:00.000Z",
  "updated_at": "2025-10-25T10:00:00.000Z"
}
```

---

#### GET `/api/products`
Listar produtos

**Permissões**: Qualquer usuário autenticado

**Query Params:**
- `active`: boolean (opcional) - Filtrar por status ativo/inativo
- `lowStock`: boolean (opcional) - Filtrar produtos com estoque abaixo do alerta

**Response (200):**
```json
[
  {
    "product_id": 1,
    "category_id": 1,
    "product_name": "Óleo Motul 10W40",
    "quantity": "50.500",
    "quantity_alert": "10.000",
    "buy_price": "45.50",
    "sell_price": "85.00",
    "is_active": true,
    "created_at": "2025-10-25T10:00:00.000Z",
    "updated_at": "2025-10-25T10:00:00.000Z",
    "product_category": {
      "product_category_id": 1,
      "product_category_name": "Lubrificantes"
    }
  }
]
```

---

#### GET `/api/products/:id`
Buscar produto por ID

**Permissões**: Qualquer usuário autenticado

**Response (200):** Mesmo formato do POST

**Erros:**
- `404`: Produto não encontrado

---

#### PUT `/api/products/:id`
Atualizar produto

**Permissões**: ADMIN, MANAGER

**Request:** Mesmo formato do POST (todos os campos opcionais)

**Response (200):** Produto atualizado

**Erros:**
- `403`: Sem permissão
- `404`: Produto não encontrado

---

#### DELETE `/api/products/:id`
Deletar produto (soft delete)

**Permissões**: Apenas ADMIN

**Response (204):** No content

**Erros:**
- `403`: Sem permissão
- `404`: Produto não encontrado

---

#### POST `/api/products/stock/movements`
Registrar movimentação de estoque

**Permissões**: ADMIN, MANAGER

**Request:**
```json
{
  "product_id": 1,
  "user_id": 1,
  "move_type": "ENTRY",
  "quantity": 20.500,
  "notes": "Compra fornecedor XYZ"
}
```

**Move Types:**
- `ENTRY`: Entrada de estoque
- `EXIT`: Saída de estoque
- `ADJUSTMENT`: Ajuste de estoque

**Validações:**
- `product_id`: ID válido de produto existente
- `user_id`: ID válido de usuário (opcional)
- `move_type`: ENTRY | EXIT | ADJUSTMENT
- `quantity`: decimal positivo (até 3 casas decimais)
- `notes`: texto opcional

**Response (201):**
```json
{
  "stock_move_id": 1,
  "product_id": 1,
  "user_id": 1,
  "move_type": "ENTRY",
  "quantity": "20.500",
  "notes": "Compra fornecedor XYZ",
  "created_at": "2025-10-25T10:00:00.000Z"
}
```

---

#### GET `/api/products/stock/movements`
Listar movimentações de estoque

**Permissões**: Qualquer usuário autenticado

**Query Params:**
- `productId`: number (opcional) - Filtrar por produto
- `startDate`: ISO date (opcional) - Data inicial
- `endDate`: ISO date (opcional) - Data final

**Response (200):**
```json
[
  {
    "stock_move_id": 1,
    "product_id": 1,
    "user_id": 1,
    "move_type": "ENTRY",
    "quantity": "20.500",
    "notes": "Compra fornecedor XYZ",
    "created_at": "2025-10-25T10:00:00.000Z",
    "products": {
      "product_name": "Óleo Motul 10W40"
    },
    "users": {
      "name": "João Silva"
    }
  }
]
```

---

### 🔧 Services (`/api/services`)

**Autenticação**: Requerida em todas as rotas  
**Nota**: As ordens de serviço não têm tabela de clientes separada. Use `customer_name` diretamente.

#### POST `/api/services`
Criar ordem de serviço

**Permissões**: Qualquer usuário autenticado

**Request:**
```json
{
  "service_category_id": 1,
  "professional_name": "João Mecânico",
  "motorcycle_id": 5,
  "customer_name": "Maria Santos",
  "service_description": "Troca de óleo e filtro",
  "diagnosis": "Motor com ruído",
  "status": "draft",
  "estimated_labor_cost": 120.00,
  "notes": "Cliente solicitou urgência"
}
```

**Validações:**
- `service_category_id`: ID válido de categoria de serviço (opcional)
- `professional_name`: nome do profissional responsável (opcional)
- `motorcycle_id`: ID válido de veículo (opcional)
- `customer_name`: nome do cliente (opcional)
- `service_description`: descrição do serviço (opcional)
- `diagnosis`: diagnóstico técnico (opcional)
- `status`: draft | in_progress | completed | cancelled (padrão: draft)
- `estimated_labor_cost`: decimal positivo (2 casas decimais, opcional)
- `notes`: anotações adicionais (opcional)

**Status Values:**
- `draft`: Rascunho
- `in_progress`: Em andamento
- `completed`: Concluído
- `cancelled`: Cancelado

**Response (201):**
```json
{
  "service_order_id": 1,
  "service_category_id": 1,
  "professional_name": "João Mecânico",
  "motorcycle_id": 5,
  "customer_name": "Maria Santos",
  "service_description": "Troca de óleo e filtro",
  "diagnosis": "Motor com ruído",
  "status": "draft",
  "estimated_labor_cost": "120.00",
  "notes": "Cliente solicitou urgência",
  "is_active": true,
  "created_at": "2025-10-25T10:00:00.000Z",
  "updated_at": "2025-10-25T10:00:00.000Z",
  "finalized_at": null
}
```

---

#### GET `/api/services`
Listar ordens de serviço

**Permissões**: Qualquer usuário autenticado

**Query Params:**
- `status`: string (opcional) - Filtrar por status (draft|in_progress|completed|cancelled)
- `customer_name`: string (opcional) - Buscar por nome do cliente (busca parcial)

**Response (200):**
```json
[
  {
    "service_order_id": 1,
    "customer_name": "Maria Santos",
    "status": "in_progress",
    "estimated_labor_cost": "120.00",
    "created_at": "2025-10-25T10:00:00.000Z",
    "service": {
      "service_category_name": "Manutenção Preventiva"
    },
    "vehicles": {
      "brand": "Honda",
      "model": "CG 160",
      "plate": "ABC1234"
    }
  }
]
```

---

#### GET `/api/services/:id`
Buscar ordem de serviço por ID (com detalhes completos)

**Permissões**: Qualquer usuário autenticado

**Response (200):**
```json
{
  "service_order_id": 1,
  "service_category_id": 1,
  "professional_name": "João Mecânico",
  "motorcycle_id": 5,
  "customer_name": "Maria Santos",
  "service_description": "Troca de óleo e filtro",
  "diagnosis": "Motor com ruído",
  "status": "completed",
  "estimated_labor_cost": "120.00",
  "finalized_at": "2025-10-25T15:00:00.000Z",
  "created_at": "2025-10-25T10:00:00.000Z",
  "service": {
    "service_category_name": "Manutenção Preventiva",
    "service_cost": "100.00"
  },
  "vehicles": {
    "brand": "Honda",
    "model": "CG 160",
    "plate": "ABC1234",
    "year": 2020
  },
  "service_products": [
    {
      "product_qtd": "1.000",
      "products": {
        "product_name": "Óleo Motul 10W40",
        "sell_price": "85.00"
      }
    }
  ],
  "services_realized": [
    {
      "service_qtd": "1.000",
      "service": {
        "service_category_name": "Troca de Óleo",
        "service_cost": "50.00"
      }
    }
  ],
  "cash_flow": [
    {
      "amount": "135.00",
      "direction": "entrada",
      "occurred_at": "2025-10-25T15:00:00.000Z"
    }
  ]
}
```

**Erros:**
- `404`: Ordem de serviço não encontrada

---

#### PUT `/api/services/:id`
Atualizar ordem de serviço

**Permissões**: Qualquer usuário autenticado

**Request:** Mesmo formato do POST (todos os campos opcionais)

**Response (200):** Ordem atualizada

**Erros:**
- `404`: Ordem não encontrada

---

#### DELETE `/api/services/:id`
Deletar ordem de serviço (soft delete)

**Permissões**: ADMIN, MANAGER

**Response (204):** No content

**Erros:**
- `403`: Sem permissão
- `404`: Ordem não encontrada

---

### 💰 CashFlow (`/api/cashflow`)

**Autenticação**: Requerida em todas as rotas

#### POST `/api/cashflow`
Criar registro de fluxo de caixa

**Permissões**: ADMIN, MANAGER

**Request:**
```json
{
  "service_order_id": 1,
  "service_realized_id": null,
  "service_product_id": null,
  "amount": 250.50,
  "direction": "entrada",
  "note": "Pagamento serviço #1",
  "occurred_at": "2025-10-25T10:00:00.000Z"
}
```

**Validações:**
- `service_order_id`: ID de ordem de serviço (opcional)
- `service_realized_id`: ID de serviço realizado (opcional)
- `service_product_id`: ID de produto de serviço (opcional)
- `amount`: decimal positivo (2 casas decimais)
- `direction`: "entrada" | "saida"
- `note`: texto descritivo (opcional)
- `occurred_at`: data/hora da ocorrência (ISO 8601, opcional - padrão: agora)

**Direction Values:**
- `entrada`: Entrada de caixa (receita)
- `saida`: Saída de caixa (despesa)

**Response (201):**
```json
{
  "cash_flow_id": 1,
  "service_order_id": 1,
  "amount": "250.50",
  "direction": "entrada",
  "note": "Pagamento serviço #1",
  "occurred_at": "2025-10-25T10:00:00.000Z",
  "is_active": true,
  "created_at": "2025-10-25T10:00:00.000Z"
}
```

**Erros:**
- `403`: Sem permissão
- `400`: Dados inválidos

---

#### GET `/api/cashflow`
Listar registros de fluxo de caixa

**Permissões**: Qualquer usuário autenticado

**Query Params:**
- `direction`: string (opcional) - Filtrar por direção ('entrada' | 'saida')
- `startDate`: ISO date (opcional) - Data inicial
- `endDate`: ISO date (opcional) - Data final

**Response (200):**
```json
[
  {
    "cash_flow_id": 1,
    "service_order_id": 1,
    "amount": "250.50",
    "direction": "entrada",
    "note": "Pagamento serviço #1",
    "occurred_at": "2025-10-25T10:00:00.000Z",
    "created_at": "2025-10-25T10:00:00.000Z",
    "service_order": {
      "service_order_id": 1,
      "customer_name": "Maria Santos"
    }
  }
]
```

---

#### GET `/api/cashflow/summary`
Resumo financeiro do período

**Permissões**: ADMIN, MANAGER

**Query Params:**
- `startDate`: ISO date (opcional) - Data inicial
- `endDate`: ISO date (opcional) - Data final

**Response (200):**
```json
{
  "totalIncome": "15420.50",
  "totalExpense": "8320.00",
  "balance": "7100.50",
  "incomeCount": 42,
  "expenseCount": 28,
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-25T23:59:59.999Z"
}
```

**Erros:**
- `403`: Sem permissão

---

#### GET `/api/cashflow/summary/categories`
Resumo por categorias de serviços e produtos

**Permissões**: ADMIN, MANAGER

**Query Params:**
- `startDate`: ISO date (opcional) - Data inicial
- `endDate`: ISO date (opcional) - Data final

**Response (200):**
```json
[
  {
    "category": "Troca de Óleo",
    "type": "Serviço",
    "direction": "entrada",
    "total": "5420.00",
    "count": 18
  },
  {
    "category": "Óleo Motul 10W40",
    "type": "Produto",
    "direction": "entrada",
    "total": "2550.00",
    "count": 30
  },
  {
    "category": "Despesas Operacionais",
    "type": "Ordem de Serviço",
    "direction": "saida",
    "total": "1200.00",
    "count": 5
  }
]
```

**Erros:**
- `403`: Sem permissão

---

#### GET `/api/cashflow/:id`
Buscar registro de fluxo de caixa por ID

**Permissões**: Qualquer usuário autenticado

**Response (200):** Mesmo formato do POST com relações

**Erros:**
- `404`: Registro não encontrado

---

#### PUT `/api/cashflow/:id`
Atualizar registro de fluxo de caixa

**Permissões**: ADMIN, MANAGER

**Request:** Mesmo formato do POST (todos os campos opcionais)

**Response (200):** Registro atualizado

**Erros:**
- `403`: Sem permissão
- `404`: Registro não encontrado

---

#### DELETE `/api/cashflow/:id`
Deletar registro de fluxo de caixa (soft delete)

**Permissões**: Apenas ADMIN

**Response (204):** No content

**Erros:**
- `403`: Sem permissão
- `404`: Registro não encontrado

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

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| **200 OK** | Sucesso | Requisição bem-sucedida |
| **201 Created** | Recurso criado | POST bem-sucedido |
| **204 No Content** | Sem conteúdo | DELETE bem-sucedido |
| **400 Bad Request** | Dados inválidos | Validação Zod falhou |
| **401 Unauthorized** | Não autenticado | Token ausente/inválido |
| **403 Forbidden** | Sem permissão | Role não permitida |
| **404 Not Found** | Não encontrado | Recurso não existe |
| **409 Conflict** | Conflito | Email/placa duplicado |
| **429 Too Many Requests** | Rate limit | Limite de requisições excedido |
| **500 Internal Server Error** | Erro interno | Erro inesperado no servidor |
| **503 Service Unavailable** | Indisponível | Banco de dados offline |

### Exemplos de Erros

**Validação (400):**
```json
{
  "status": "error",
  "message": "Erro de validação",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "Senha deve ter no mínimo 6 caracteres"
    }
  ]
}
```

**Autenticação (401):**
```json
{
  "status": "error",
  "message": "Token não fornecido"
}
```

**Permissão (403):**
```json
{
  "status": "error",
  "message": "Sem permissão para acessar este recurso"
}
```

**Não Encontrado (404):**
```json
{
  "status": "error",
  "message": "Usuário não encontrado"
}
```

**Rate Limit (429):**
```json
{
  "status": "error",
  "message": "Muitas requisições. Tente novamente em 15 minutos."
}
```

---

## 🛡️ Segurança

### Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| **API Geral** | 100 requisições | 15 minutos |
| **Login** (`/api/auth/login`) | 5 tentativas | 15 minutos |
| **Registro** (`/api/auth/register`) | 3 contas | 1 hora |

**Headers de Rate Limit:**
- `X-RateLimit-Limit`: Limite total
- `X-RateLimit-Remaining`: Requisições restantes
- `X-RateLimit-Reset`: Timestamp do reset

### Validações

- ✅ Todos os inputs validados com **Zod schemas**
- ✅ Check constraints do PostgreSQL reforçados nas validações
- ✅ Sanitização automática de dados
- ✅ Validação de tipos TypeScript em tempo de compilação

### Autenticação

- 🔑 **JWT** com expiração de 7 dias (configurável)
- 🔐 **Senhas hashadas** com bcrypt (10 rounds)
- 🚫 **Refresh token não implementado** - usar re-autenticação
- 🛡️ **Helmet.js** para segurança de headers HTTP
- 🌐 **CORS** configurável por ambiente

### Segurança Adicional

- **Helmet**: Proteção contra ataques comuns (XSS, clickjacking, etc)
- **Express Rate Limit**: Proteção contra força bruta e DDoS
- **CORS**: Controle de origens permitidas
- **Body Limit**: 10MB máximo por requisição
- **Soft Deletes**: Dados nunca são removidos permanentemente

---

## 📊 Roles e Permissões

> **ℹ️ Implementação Técnica**: Os roles são armazenados como `VARCHAR(50)` no banco de dados e validados através de uma **CHECK constraint** (`role IN ('ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT')`), não através de enum PostgreSQL. A validação é feita tanto no nível do banco quanto no nível da aplicação (Zod schema).

| Role | Descrição | Permissões |
|------|-----------|------------|
| **ADMIN** | Administrador | ✅ Acesso total ao sistema<br>✅ Deletar qualquer recurso<br>✅ Gerenciar usuários<br>✅ Acesso a todos os relatórios |
| **MANAGER** | Gerente | ✅ Gerenciar produtos e estoque<br>✅ Atualizar usuários<br>✅ Gerenciar fluxo de caixa<br>✅ Relatórios financeiros<br>❌ Deletar usuários |
| **MECHANIC** | Mecânico | ✅ Criar e atualizar ordens de serviço<br>✅ Visualizar produtos<br>✅ Visualizar movimentações de estoque<br>❌ Gerenciar estoque<br>❌ Acesso financeiro |
| **ATTENDANT** | Atendente | ✅ Visualizar ordens de serviço<br>✅ Criar ordens de serviço<br>✅ Visualizar produtos<br>❌ Atualizar produtos<br>❌ Acesso financeiro |

### Matriz de Permissões

| Recurso | ADMIN | MANAGER | MECHANIC | ATTENDANT |
|---------|-------|---------|----------|------------|
| **Usuários** |
| Listar | ✅ | ✅ | ✅ | ✅ |
| Criar | ✅ (register endpoint) | ✅ (register) | ✅ (register) | ✅ (register) |
| Atualizar | ✅ | ✅ | ❌ | ❌ |
| Deletar | ✅ | ❌ | ❌ | ❌ |
| **Produtos** |
| Listar | ✅ | ✅ | ✅ | ✅ |
| Criar | ✅ | ✅ | ❌ | ❌ |
| Atualizar | ✅ | ✅ | ❌ | ❌ |
| Deletar | ✅ | ❌ | ❌ | ❌ |
| Estoque | ✅ | ✅ | ❌ | ❌ |
| **Serviços** |
| Listar | ✅ | ✅ | ✅ | ✅ |
| Criar | ✅ | ✅ | ✅ | ✅ |
| Atualizar | ✅ | ✅ | ✅ | ✅ |
| Deletar | ✅ | ✅ | ❌ | ❌ |
| **Fluxo de Caixa** |
| Listar | ✅ | ✅ | ✅ | ✅ |
| Criar | ✅ | ✅ | ❌ | ❌ |
| Atualizar | ✅ | ✅ | ❌ | ❌ |
| Deletar | ✅ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ❌ | ❌ |

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

## 🔧 Desenvolvimento

### Variáveis de Ambiente (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/crm_getmoto?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"

# CORS (separe múltiplas origens com vírgula)
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# Logging
LOG_LEVEL="debug"  # error, warn, info, debug
```

### Scripts NPM

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo desenvolvimento com hot-reload

# Build e Produção
npm run build            # Compila TypeScript para JavaScript (dist/)
npm start                # Inicia servidor em produção (requer build)

# Testes
npm test                 # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura de testes
npm run test:verbose     # Executa testes com saída detalhada

# Documentação e Cliente
npm run swagger          # Gera documentação Swagger
npm run orval            # Gera cliente TypeScript/React Query
npm run generate:client  # Swagger + Orval (ambos)
```

### Estrutura do Projeto

```
src/
├── config/               # Configurações
│   ├── prisma.ts        # Cliente Prisma
│   └── logger.ts        # Winston logger
├── controllers/         # Controllers (lógica de rota)
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── service.controller.ts
│   └── cashflow.controller.ts
├── interfaces/          # Interfaces TypeScript (inferidas do Zod)
├── middlewares/         # Middlewares
│   ├── auth.middleware.ts       # Autenticação JWT
│   ├── validate.middleware.ts   # Validação Zod
│   ├── error.middleware.ts      # Tratamento de erros
│   ├── rate-limit.middleware.ts # Rate limiting
│   └── __tests__/               # Testes de middlewares
├── routes/              # Definição de rotas
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── product.routes.ts
│   ├── service.routes.ts
│   └── cashflow.routes.ts
├── schemas/             # Schemas Zod para validação
│   ├── user.schema.ts
│   ├── product.schema.ts
│   ├── service.schema.ts
│   ├── cashflow.schema.ts
│   ├── motorcycle.schema.ts
│   ├── payment.schema.ts
│   └── common.schema.ts
├── services/            # Lógica de negócio
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── product.service.ts
│   ├── service.service.ts
│   ├── service-category.service.ts
│   ├── service-order.service.ts
│   ├── cashflow.service.ts
│   └── __tests__/       # Testes de services
├── utils/               # Utilitários
│   ├── hash.util.ts     # Bcrypt hash/compare
│   ├── jwt.util.ts      # JWT generate/verify
│   └── __tests__/       # Testes de utils
├── api-client/          # Cliente TypeScript gerado (Orval)
├── app.ts               # Configuração do Express
├── server.ts            # Inicialização do servidor
├── swagger.ts           # Geração do Swagger
└── swagger-output.json  # Documentação Swagger gerada

prisma/
├── schema.prisma        # Schema do banco de dados
├── seed.ts              # Dados iniciais (seed)
└── migrations/          # Migrations do banco

coverage/                # Relatórios de cobertura de testes
logs/                    # Logs da aplicação (Winston)
```

---

## 📝 Logs

Sistema de logging estruturado com **Winston**:

### Destinos de Log

- **Console**: Logs coloridos em development
  - Formato: Pretty print com cores
  - Níveis: debug, info, warn, error

- **Arquivos** (rotação diária):
  - `logs/combined-YYYY-MM-DD.log`: Todos os logs
  - `logs/error-YYYY-MM-DD.log`: Apenas erros
  - Retenção: 14 dias
  - Formato: JSON com timestamp

### Níveis de Log

| Nível | Descrição | Quando Usar |
|--------|-----------|-------------|
| **error** | Erros críticos | Exceções, falhas de sistema |
| **warn** | Avisos | Situações anômalas não críticas |
| **info** | Informações gerais | Eventos importantes, requisições HTTP |
| **debug** | Debug detalhado | Apenas em development |

### HTTP Request Logging (Morgan)

- **Production**: Formato `combined` (Apache-style)
- **Development**: Formato `dev` (colorido, conciso)
- Logs automáticos de todas as requisições HTTP

### Exemplo de Log

```json
{
  "timestamp": "2025-10-25T10:00:00.000Z",
  "level": "info",
  "message": "User logged in",
  "userId": 1,
  "email": "user@example.com"
}
```

---

## 🚧 Limitações Conhecidas

### Funcionalidades Não Implementadas

1. **❌ Tabela de Clientes Separada**
   - Não existe tabela `customers` no banco
   - Use `service_order.customer_name` diretamente
   - Rotas de clientes estão desabilitadas

2. **❌ Refresh Token**
   - Não implementado
   - Re-autenticação necessária após expiração do JWT (7 dias)
   - Considerar implementar em versões futuras

3. **❌ Upload de Arquivos**
   - Não suporta upload (fotos de motos, documentos, etc)
   - Considerar integração com S3/storage externo

4. **❌ Sistema de Notificações**
   - Não há sistema de notificações push/email
   - Alertas de estoque baixo não enviam notificações

5. **❌ Relatórios PDF/Excel**
   - Geração de relatórios não implementada
   - Apenas endpoints JSON disponíveis

6. **❌ Pagamentos Online**
   - Não há integração com gateways de pagamento
   - Apenas registro manual de fluxo de caixa

7. **❌ Websockets/Real-time**
   - Não há atualizações em tempo real
   - Cliente precisa fazer polling

### Observações Importantes

⚠️ **Check Constraints**: Prisma não valida totalmente os check constraints do banco. As validações são compensadas pelos schemas Zod.

⚠️ **Soft Deletes**: Todas as deleções são soft deletes (is_active = false). Dados nunca são removidos permanentemente.

⚠️ **BigInt**: IDs são BigInt no banco, mas retornados como number no JSON. Pode causar problemas com IDs muito grandes.

⚠️ **Decimal**: Valores decimais são retornados como strings no JSON para evitar perda de precisão.

---

## 🧪 Testes

### Cobertura Atual

- ✅ **Utils**: hash.util, jwt.util (100% cobertura)
- ✅ **Services**: auth.service (cobertura parcial)
- ✅ **Middlewares**: auth.middleware (cobertura parcial)
- ❌ **Controllers**: Não implementados
- ❌ **Integração**: Não implementados
- ❌ **E2E**: Não implementados

### Executar Testes

```bash
npm test                 # Todos os testes
npm run test:coverage    # Com relatório de cobertura
npm run test:watch       # Modo watch
```

Ver [TESTING_GUIDE.md](./TESTING_GUIDE.md) para mais detalhes.

---

## 📚 Documentação Adicional

- **[README.md](./README.md)**: Visão geral e instalação
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**: Guia de testes
- **Swagger UI**: `http://localhost:3000/api-docs` (apenas development)
- **Prisma Schema**: `prisma/schema.prisma`
- **Cliente TypeScript**: `src/api-client/` (gerado pelo Orval)

---

## 📦 Modelo de Dados

### Principais Entidades

- **users**: Usuários do sistema
- **products**: Produtos em estoque
- **product_category**: Categorias de produtos
- **stock_move**: Movimentações de estoque
- **service**: Categorias de serviços
- **service_order**: Ordens de serviço
- **services_realized**: Serviços executados em ordens
- **service_products**: Produtos usados em ordens
- **vehicles**: Motocicletas dos clientes
- **cash_flow**: Fluxo de caixa (entradas/saídas)

### Relacionamentos Principais

```
service_order
  ├── service (categoria)
  ├── vehicles (moto)
  ├── services_realized (serviços executados)
  ├── service_products (produtos usados)
  └── cash_flow (movimentações financeiras)

products
  ├── product_category
  ├── stock_move (movimentações)
  └── service_products

cash_flow
  ├── service_order
  ├── services_realized
  └── service_products
```

---

## 👥 Suporte

Para dúvidas, problemas ou sugestões:

1. Verifique a documentação Swagger: `/api-docs`
2. Consulte os exemplos de uso no código
3. Verifique os testes para entender o comportamento esperado
4. Entre em contato com a equipe de desenvolvimento

---

**Última Atualização**: 25 de outubro de 2025  
**Versão da API**: 1.0.0  
**Status**: Em Desenvolvimento Ativo

