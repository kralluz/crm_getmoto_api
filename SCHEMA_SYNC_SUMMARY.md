# Resumo da Sincronização de Schemas

## Data: 2025-10-23

## Ações Realizadas

### 1. Sincronização com Banco de Dados ✅
- Executado `npx prisma db pull` com sucesso
- Sincronizado schema Prisma com estado atual do banco de dados
- 10 modelos introspectados

### 2. Atualização dos Schemas Zod ✅

Todos os schemas Zod foram atualizados para refletir a estrutura real do banco de dados PostgreSQL:

#### **user.schema.ts**
- Atualizado para refletir tabela `users`
- Campos: `user_id` (BigInt), `name`, `position`, `is_active`
- **Removidos**: campos `email`, `password`, `role` (não existem no banco)
- **Adicionados**: tipos inferidos com `z.infer`

#### **product.schema.ts**
- Atualizado para tabelas `products`, `product_category` e `stock_move`
- Campos: `product_id`, `category_id`, `product_name`, `quantity`, `quantity_alert`, `buy_price`, `sell_price`
- Tipos: BigInt para IDs, Decimal para quantidades e preços
- Adicionados schemas para categoria de produtos
- Movimentação de estoque com tipos: 'ENTRY', 'EXIT', 'ADJUSTMENT'

#### **service.schema.ts**
- **Reestruturado completamente** para refletir 4 tabelas:
  - `service` (categorias de serviço)
  - `service_order` (ordens de serviço)
  - `services_realized` (serviços realizados)
  - `service_products` (produtos usados em ordens)
- Status: 'draft', 'in_progress', 'completed', 'cancelled'
- Campos corrigidos: `service_category_id`, `motorcycle_id`, `customer_name`, etc.

#### **cashflow.schema.ts**
- Atualizado para tabela `cash_flow`
- Campos: `cash_flow_id`, `service_order_id`, `service_realized_id`, `service_product_id`, `amount`, `direction`
- Direction: 'entrada' ou 'saida' (português)
- Relacionado a ordens de serviço, serviços realizados e produtos

#### **motorcycle.schema.ts** → **vehicle.schema.ts**
- Atualizado para tabela `vehicles`
- Campos: `vehicle_id`, `brand`, `model`, `color`, `plate` (unique), `year`
- Placa é obrigatória e única no banco

#### **customer.schema.ts**
- ⚠️ **TABELA NÃO EXISTE NO BANCO**
- Dados de clientes armazenados em `service_order.customer_name`
- Schema mantido apenas para compatibilidade legada
- Adicionado aviso de não usar

#### **payment.schema.ts**
- ⚠️ **TABELA NÃO EXISTE NO BANCO**
- Pagamentos registrados via tabela `cash_flow`
- Enums mantidos para referência: PaymentMethod, PaymentStatus
- Adicionado aviso de não usar

#### **common.schema.ts**
- Removido `uuidSchema` (banco usa BigInt, não UUID)
- Adicionado `idSchema` para BigInt/number
- Atualizado `idParamSchema` para aceitar números
- Adicionado `filterActiveSchema` para filtros de is_active
- Adicionado `paginatedResponseSchema` para respostas paginadas
- Atualizado `timestampsSchema` para `created_at` e `updated_at`

### 3. Atualização das Interfaces TypeScript ✅

Todas as interfaces foram atualizadas para usar `z.infer` dos schemas Zod:

- ✅ `user.interface.ts` - tipos inferidos dos schemas
- ✅ `product.interface.ts` - adicionados tipos de categoria e movimentação
- ✅ `service.interface.ts` - tipos para todas as 4 tabelas de serviços
- ✅ `cashflow.interface.ts` - tipos atualizados com response
- ✅ `motorcycle.interface.ts` - renomeado para vehicle com aliases
- ✅ `customer.interface.ts` - marcado como legado (tabela não existe)
- ✅ `payment.interface.ts` - marcado como legado (tabela não existe)

### 4. Mudanças de Tipos Importantes

#### De UUID para BigInt:
- Todos os IDs agora são `BigInt` no Prisma
- Schemas Zod aceitam `bigint` ou `number` com coerção
- Responses retornam `bigint | number` para flexibilidade

#### De Decimal para Number:
- Quantidades: `Decimal(12, 3)` → aceita numbers com 3 casas decimais
- Preços: `Decimal(12, 2)` → aceita numbers com 2 casas decimais
- Zod faz coerção automática para number

#### Campos Snake_Case:
- Banco usa snake_case (ex: `user_id`, `product_name`, `is_active`)
- Schemas e types mantêm snake_case para consistência
- **Importante**: API deve usar snake_case nas requests/responses

## Próximos Passos Necessários

### 1. Atualizar Controllers ⚠️
Os controllers precisam ser atualizados para:
- Usar novos nomes de campos (snake_case)
- Tratar BigInt corretamente
- Retornar responses no formato dos schemas
- Validar com os schemas atualizados

### 2. Atualizar Routes ⚠️
As rotas precisam:
- Validação de params com `idParamSchema` atualizado
- Documentação Swagger corrigida
- Response schemas atualizados

### 3. Remover ou Refatorar Código Legado ⚠️
- **Customer routes/controller**: não há tabela customers
- **Payment routes/controller**: não há tabela payments
- **Auth routes**: não há campos email/password/role em users

### 4. Testar Integração 🧪
- Testar criação/atualização de registros
- Verificar se BigInt é serializável em JSON
- Testar relacionamentos entre tabelas
- Validar constraints do banco (check constraints)

## Avisos Importantes

### ⚠️ Breaking Changes

1. **IDs mudaram de UUID para BigInt**
   - Requests devem enviar números ao invés de UUIDs
   - Responses retornarão números grandes

2. **Campos em snake_case**
   - API deve usar `product_name` não `productName`
   - `is_active` não `active`
   - `user_id` não `userId`

3. **Tabelas inexistentes**
   - Customers: usar `service_order.customer_name`
   - Payments: usar `cash_flow`
   - Auth: sistema de autenticação precisa ser reimplementado

4. **Estrutura de Services mudou**
   - Service → Service Category (tipo de serviço)
   - Service Order → Ordem de serviço completa
   - Services Realized → Serviços feitos na ordem
   - Service Products → Produtos usados na ordem

### 📝 Constraints do Banco

O banco possui check constraints não suportados pelo Prisma Client:
- `ck_cash_flow_amount`
- `ck_cash_flow_direction`
- `ck_service_order_status`
- `ck_service_products_qty`
- `ck_services_realized_qty`
- `ck_stock_move_qty`
- `ck_stock_move_type`

Estes devem ser validados no código da aplicação.

## Status Final

✅ Schemas Zod atualizados e sincronizados com banco
✅ Interfaces TypeScript usando z.infer
✅ Tipos consistentes em todo o projeto
⚠️ Controllers e rotas precisam ser atualizados
⚠️ Testes necessários antes de deploy
⚠️ Documentação Swagger precisa ser atualizada

## Tabelas no Banco de Dados

1. ✅ `users` - Usuários do sistema
2. ✅ `products` - Produtos em estoque
3. ✅ `product_category` - Categorias de produtos
4. ✅ `stock_move` - Movimentações de estoque
5. ✅ `service` - Categorias de serviço
6. ✅ `service_order` - Ordens de serviço
7. ✅ `services_realized` - Serviços realizados
8. ✅ `service_products` - Produtos usados em serviços
9. ✅ `cash_flow` - Fluxo de caixa
10. ✅ `vehicles` - Veículos (motos)

## Enums Definidos

- `UserRole`: ADMIN, MANAGER, MECHANIC, ATTENDANT (não usado em users)
- `ServiceStatus`: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, WAITING_PARTS (não usado)
- `PaymentMethod`: CASH, CREDIT_CARD, DEBIT_CARD, PIX, BANK_TRANSFER, CHECK
- `PaymentStatus`: PENDING, PAID, OVERDUE, CANCELLED
- `TransactionType`: INCOME, EXPENSE (não usado, usar direction)
- `StockMovementType`: ENTRY, EXIT, ADJUSTMENT

**Nota**: Alguns enums estão definidos no Prisma mas não são usados no banco real.
