# CRM API GetMoto

API completa para gestão de oficina de motos, desenvolvida com Node.js, TypeScript, Express, Prisma e PostgreSQL.

## Funcionalidades

- **Autenticação JWT**: Sistema completo de autenticação e autorização com diferentes níveis de acesso
- **Gestão de Usuários**: CRUD completo com roles (ADMIN, MANAGER, MECHANIC, ATTENDANT)
- **Gestão de Clientes**: Cadastro completo de clientes com histórico de serviços
- **Gestão de Motos**: Registro de motocicletas dos clientes
- **Gestão de Serviços**: Controle de ordens de serviço com status, diagnóstico e itens
- **Gestão de Estoque**: Controle de produtos, preços e movimentações de estoque
- **Gestão de Fluxo de Caixa**: Controle financeiro com receitas, despesas e relatórios

## Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **Zod** - Validação de schemas
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Swagger** - Documentação da API

## Pré-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd crm_api_getmoto
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- Configure a `DATABASE_URL` com os dados do seu PostgreSQL
- Configure o `JWT_SECRET` com uma chave secreta segura

4. Execute as migrations do Prisma:
```bash
npm run prisma:migrate
```

5. Gere o Prisma Client:
```bash
npm run prisma:generate
```

6. (Opcional) Gere a documentação Swagger:
```bash
npm run swagger
```

## Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Clientes
- `POST /api/customers` - Criar cliente
- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Obter cliente por ID
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Deletar cliente

### Serviços
- `POST /api/services` - Criar serviço
- `GET /api/services` - Listar serviços
- `GET /api/services/:id` - Obter serviço por ID
- `PUT /api/services/:id` - Atualizar serviço
- `DELETE /api/services/:id` - Deletar serviço

### Produtos (Estoque)
- `POST /api/products` - Criar produto
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto por ID
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `POST /api/products/stock/movements` - Adicionar movimentação de estoque
- `GET /api/products/stock/movements` - Listar movimentações

### Fluxo de Caixa
- `POST /api/cashflow` - Criar registro de fluxo de caixa
- `GET /api/cashflow` - Listar registros
- `GET /api/cashflow/summary` - Resumo financeiro
- `GET /api/cashflow/summary/categories` - Resumo por categorias
- `GET /api/cashflow/:id` - Obter registro por ID
- `PUT /api/cashflow/:id` - Atualizar registro
- `DELETE /api/cashflow/:id` - Deletar registro

## Documentação

Após iniciar o servidor, acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa as migrations
- `npm run prisma:studio` - Abre o Prisma Studio
- `npm run swagger` - Gera a documentação Swagger

## Estrutura do Projeto

```
src/
├── config/          # Configurações (Prisma, etc)
├── controllers/     # Controllers da aplicação
├── interfaces/      # Interfaces TypeScript (infer do Zod)
├── middlewares/     # Middlewares (auth, validação, erro)
├── routes/          # Rotas da API
├── schemas/         # Schemas Zod para validação
├── services/        # Lógica de negócio
├── utils/           # Utilitários (hash, JWT)
├── app.ts           # Configuração do Express
└── server.ts        # Inicialização do servidor
```

## Níveis de Acesso

- **ADMIN**: Acesso total ao sistema
- **MANAGER**: Gerenciamento de operações (exceto usuários)
- **MECHANIC**: Acesso a serviços e produtos
- **ATTENDANT**: Acesso básico para atendimento

## Licença

MIT

## Autor

Desenvolvido para gestão de oficinas de motos
