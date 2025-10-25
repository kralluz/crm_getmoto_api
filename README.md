# CRM API GetMoto

API completa para gestão de oficina de motos, desenvolvida com Node.js, TypeScript, Express, Prisma e PostgreSQL.

## ✨ Funcionalidades

- ✅ **Autenticação JWT**: Sistema completo de autenticação e autorização com diferentes níveis de acesso
- ✅ **Gestão de Usuários**: CRUD completo com roles (ADMIN, MANAGER, MECHANIC, ATTENDANT)
- ✅ **Gestão de Motos**: Registro de motocicletas (marca, modelo, placa, ano)
- ✅ **Gestão de Serviços**: Controle de ordens de serviço com status, diagnóstico e profissional responsável
- ✅ **Gestão de Estoque**: Controle de produtos, categorias, preços e movimentações de estoque
- ✅ **Gestão de Fluxo de Caixa**: Controle financeiro detalhado com receitas, despesas e relatórios
- ✅ **Logging Estruturado**: Winston com rotação diária de logs
- ✅ **Testes Automatizados**: Jest com cobertura de código
- ✅ **Validação Robusta**: Zod schemas em todos os endpoints
- ✅ **Rate Limiting**: Proteção contra abuso de API
- ✅ **Documentação Swagger**: Documentação interativa da API

## 🚀 Tecnologias

- **Node.js 18+** com **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL 14+** - Banco de dados
- **Zod** - Validação de schemas
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Winston** - Logging estruturado
- **Jest** - Framework de testes
- **Swagger** - Documentação da API
- **Orval** - Geração de cliente TypeScript/React Query

## 📋 Pré-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/kralluz/crm_getmoto_api.git
cd crm_getmoto_api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

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
LOG_LEVEL="debug"
```

4. Configure o banco de dados:

```bash
# Aplicar migrations
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# (Opcional) Seed com dados iniciais
npx prisma db seed
```

5. (Opcional) Gere a documentação Swagger:
```bash
npm run swagger
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

### Produção
```bash
npm run build
npm start
```

## 📚 Documentação

### Swagger UI (Apenas Development)
Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

### Documentação Completa
Veja [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentação detalhada de todos os endpoints.

### Guia de Testes
Veja [TESTING_GUIDE.md](./TESTING_GUIDE.md) para informações sobre testes automatizados.

## 📋 Endpoints Principais

### 🔑 Autenticação (`/api/auth`)
- `POST /api/auth/register` - Registrar novo usuário (rate-limited: 3/hora)
- `POST /api/auth/login` - Fazer login (rate-limited: 5/15min)
- `GET /api/auth/me` - Obter dados do usuário autenticado

### 👥 Usuários (`/api/users`)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário (ADMIN, MANAGER)
- `DELETE /api/users/:id` - Deletar usuário (ADMIN)

### 🔧 Serviços (`/api/services`)
- `POST /api/services` - Criar ordem de serviço
- `GET /api/services` - Listar ordens (filtros: status, customer_name)
- `GET /api/services/:id` - Obter ordem por ID (com detalhes completos)
- `PUT /api/services/:id` - Atualizar ordem de serviço
- `DELETE /api/services/:id` - Deletar ordem (soft delete - ADMIN, MANAGER)

### 📦 Produtos/Estoque (`/api/products`)
- `POST /api/products` - Criar produto (ADMIN, MANAGER)
- `GET /api/products` - Listar produtos (filtros: active, lowStock)
- `GET /api/products/:id` - Obter produto por ID
- `PUT /api/products/:id` - Atualizar produto (ADMIN, MANAGER)
- `DELETE /api/products/:id` - Deletar produto (ADMIN)
- `POST /api/products/stock/movements` - Registrar movimentação de estoque (ADMIN, MANAGER)
- `GET /api/products/stock/movements` - Listar movimentações (filtros: productId, dates)

### 💰 Fluxo de Caixa (`/api/cashflow`)
- `POST /api/cashflow` - Criar registro (ADMIN, MANAGER)
- `GET /api/cashflow` - Listar registros (filtros: direction, dates)
- `GET /api/cashflow/summary` - Resumo financeiro do período (ADMIN, MANAGER)
- `GET /api/cashflow/summary/categories` - Resumo por categorias (ADMIN, MANAGER)
- `GET /api/cashflow/:id` - Obter registro por ID
- `PUT /api/cashflow/:id` - Atualizar registro (ADMIN, MANAGER)
- `DELETE /api/cashflow/:id` - Deletar registro (ADMIN)

### 🏥 Health Check
- `GET /health` - Status da API e banco de dados

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes detalhados
npm run test:verbose
```

### Cobertura Atual

- ✅ **Utils**: hash.util, jwt.util (100%)
- ✅ **Services**: auth.service
- ✅ **Middlewares**: auth.middleware
- 📊 **Cobertura Geral**: ~40%

Veja [TESTING_GUIDE.md](./TESTING_GUIDE.md) para mais detalhes.

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor em modo desenvolvimento com hot-reload

# Build e Produção
npm run build            # Compila TypeScript para dist/
npm start                # Inicia servidor em produção

# Testes
npm test                 # Executa testes
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura

# Documentação e Cliente
npm run swagger          # Gera documentação Swagger
npm run orval            # Gera cliente TypeScript/React Query
npm run generate:client  # Swagger + Orval
```

## 📁 Estrutura do Projeto

```
src/
├── config/              # Configurações
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

## 🛡️ Segurança

### Rate Limiting
- **API Geral**: 100 requisições / 15 minutos
- **Login**: 5 tentativas / 15 minutos
- **Registro**: 3 contas / hora

### Autenticação
- JWT com expiração de 7 dias
- Senhas hashadas com bcrypt (10 rounds)
- Middleware de autenticação em rotas protegidas

### Validação
- Todos os inputs validados com Zod schemas
- Check constraints do PostgreSQL reforçados
- Sanitização automática de dados

### Headers HTTP
- Helmet.js para segurança de headers
- CORS configurável por ambiente
- Body limit: 10MB máximo

## 👥 Níveis de Acesso (Roles)

| Role | Descrição | Permissões |
|------|-----------|------------|
| **ADMIN** | Administrador | ✅ Acesso total ao sistema<br>✅ Deletar qualquer recurso<br>✅ Gerenciar usuários |
| **MANAGER** | Gerente | ✅ Gerenciar produtos e estoque<br>✅ Atualizar usuários<br>✅ Gerenciar fluxo de caixa<br>❌ Deletar usuários |
| **MECHANIC** | Mecânico | ✅ Criar e atualizar ordens de serviço<br>✅ Visualizar produtos<br>❌ Gerenciar estoque<br>❌ Acesso financeiro |
| **ATTENDANT** | Atendente | ✅ Criar ordens de serviço<br>✅ Visualizar produtos<br>❌ Atualizar produtos<br>❌ Acesso financeiro |

## ⚠️ Limitações Conhecidas

1. **Tabela de Clientes**: Não existe tabela separada de clientes. Use `service_order.customer_name` diretamente.
2. **Refresh Token**: Não implementado. Re-autenticação necessária após expiração.
3. **Upload de Arquivos**: Não suporta upload de fotos/documentos.
4. **Notificações**: Sistema de notificações não implementado.
5. **Relatórios PDF**: Geração de relatórios não implementada (apenas JSON).

Veja [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para lista completa.

## 📝 Logs

Sistema de logging com Winston:

- **Console**: Logs coloridos em development
- **Arquivos**: Rotação diária em `logs/`
  - `combined-YYYY-MM-DD.log`: Todos os logs
  - `error-YYYY-MM-DD.log`: Apenas erros
- **Retenção**: 14 dias
- **Níveis**: error, warn, info, debug

## 🐳 Docker

```bash
# Build e run com Docker Compose
docker-compose up -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👨‍💻 Autores

- **kralluz** - Desenvolvimento principal
- **AtlasGold** - Implementação de testes

---

**Última Atualização**: 25 de outubro de 2025  
**Versão**: 1.0.0  
**Status**: Em Desenvolvimento Ativo
