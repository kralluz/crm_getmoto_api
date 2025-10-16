# Configuração do Banco de Dados - CRM GetMoto

## Status da Configuração

✅ **Banco de dados configurado e pronto para uso!**

## Informações do Banco

- **Tipo**: PostgreSQL
- **Host**: 72.60.5.68:4156
- **Database**: crm_database_getmoto
- **Usuário**: postgres
- **Schema**: public

## Tabelas Criadas

O banco de dados foi configurado com 9 tabelas principais:

### 1. **users** - Usuários do Sistema
- Campos: id, name, email, password, role, active, createdAt, updatedAt
- Roles: ADMIN, MANAGER, MECHANIC, ATTENDANT
- Relacionamentos: services, cashFlows

### 2. **customers** - Clientes
- Campos: id, name, email, phone, cpf, address, city, state, zipCode, notes, active, createdAt, updatedAt
- Relacionamentos: motorcycles, services

### 3. **motorcycles** - Motos dos Clientes
- Campos: id, customerId, brand, model, year, plate, color, mileage, notes, active, createdAt, updatedAt
- Relacionamentos: customer, services

### 4. **services** - Ordens de Serviço
- Campos: id, customerId, motorcycleId, userId, description, diagnosis, status, startDate, estimatedEndDate, endDate, laborCost, totalCost, notes, createdAt, updatedAt
- Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS
- Relacionamentos: customer, motorcycle, user, serviceItems, payments

### 5. **service_items** - Itens de Serviço
- Campos: id, serviceId, productId, description, quantity, unitPrice, totalPrice, isLabor
- Relacionamentos: service, product

### 6. **products** - Produtos/Peças
- Campos: id, name, description, brand, code, barcode, category, costPrice, salePrice, stockQuantity, minStock, maxStock, unit, active, createdAt, updatedAt
- Relacionamentos: serviceItems, stockMovements

### 7. **stock_movements** - Movimentações de Estoque
- Campos: id, productId, type, quantity, unitPrice, totalPrice, reason, reference, date, createdAt
- Tipos: ENTRY, EXIT, ADJUSTMENT
- Relacionamentos: product

### 8. **payments** - Pagamentos
- Campos: id, serviceId, amount, method, status, dueDate, paymentDate, notes, createdAt, updatedAt
- Métodos: CASH, CREDIT_CARD, DEBIT_CARD, PIX, BANK_TRANSFER, CHECK
- Status: PENDING, PAID, OVERDUE, CANCELLED
- Relacionamentos: service, cashFlow

### 9. **cash_flow** - Fluxo de Caixa
- Campos: id, paymentId, userId, type, category, amount, description, date, createdAt, updatedAt
- Tipos: INCOME, EXPENSE
- Relacionamentos: payment, user

## Enums Criados

- **UserRole**: ADMIN, MANAGER, MECHANIC, ATTENDANT
- **ServiceStatus**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS
- **PaymentMethod**: CASH, CREDIT_CARD, DEBIT_CARD, PIX, BANK_TRANSFER, CHECK
- **PaymentStatus**: PENDING, PAID, OVERDUE, CANCELLED
- **TransactionType**: INCOME, EXPENSE
- **StockMovementType**: ENTRY, EXIT, ADJUSTMENT

## Migrações

A migração inicial foi criada em: `prisma/migrations/20251013140323_init/`

### Verificar status das migrações:
```bash
npx prisma migrate status
```

### Aplicar novas migrações:
```bash
npx prisma migrate dev --name nome_da_migracao
```

### Resetar banco de dados (⚠️ CUIDADO - apaga todos os dados):
```bash
npx prisma migrate reset
```

## Comandos Úteis do Prisma

### Gerar Prisma Client
```bash
npm run prisma:generate
# ou
npx prisma generate
```

### Executar migrações
```bash
npm run prisma:migrate
# ou
npx prisma migrate dev
```

### Abrir Prisma Studio (UI visual)
```bash
npm run prisma:studio
# ou
npx prisma studio
```

### Sincronizar schema (sem criar migração)
```bash
npx prisma db push
```

### Ver SQL de uma migração
```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script
```

## Testar Conexão

Foi criado um script para testar a conexão com o banco:

```bash
npx ts-node test-db-connection.ts
```

Este script:
- Testa a conexão com o banco
- Verifica todas as tabelas criadas
- Mostra a contagem de registros em cada tabela

## Estrutura de Relacionamentos

```
User (Usuário)
├── Service (1:N) - Um usuário pode criar vários serviços
└── CashFlow (1:N) - Um usuário pode registrar várias transações

Customer (Cliente)
├── Motorcycle (1:N) - Um cliente pode ter várias motos
└── Service (1:N) - Um cliente pode ter vários serviços

Motorcycle (Moto)
└── Service (1:N) - Uma moto pode ter vários serviços

Service (Ordem de Serviço)
├── ServiceItem (1:N) - Um serviço pode ter vários itens
└── Payment (1:N) - Um serviço pode ter vários pagamentos

Product (Produto)
├── ServiceItem (1:N) - Um produto pode estar em vários itens de serviço
└── StockMovement (1:N) - Um produto pode ter várias movimentações

Payment (Pagamento)
└── CashFlow (1:1) - Um pagamento pode gerar uma transação no fluxo de caixa
```

## Backup e Restauração

### Fazer backup do banco
```bash
pg_dump -h 72.60.5.68 -p 4156 -U postgres -d crm_database_getmoto > backup.sql
```

### Restaurar backup
```bash
psql -h 72.60.5.68 -p 4156 -U postgres -d crm_database_getmoto < backup.sql
```

## Segurança

⚠️ **IMPORTANTE**: Certifique-se de que o arquivo `.env` não seja commitado no Git, pois contém informações sensíveis de conexão com o banco de dados.

O `.gitignore` já está configurado para ignorar:
- `.env`
- `.env.local`
- `.env.*.local`

## Próximos Passos

1. **Criar usuário administrador inicial**
   - Você pode criar um seed para popular o banco com dados iniciais

2. **Configurar seeds (dados iniciais)**
   ```bash
   # Criar arquivo prisma/seed.ts
   npx prisma db seed
   ```

3. **Testar os endpoints da API**
   ```bash
   npm run dev
   # Acessar: http://localhost:3000/api-docs
   ```

4. **Criar índices adicionais (se necessário)**
   - Para melhorar performance de consultas específicas

## Recursos

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Status**: ✅ Banco de dados configurado com sucesso!
**Última atualização**: 2025-10-13
**Total de tabelas**: 9
**Total de enums**: 6
**Migração inicial**: 20251013140323_init
