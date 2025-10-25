# Erros de Compilação a Serem Corrigidos

## Resumo
Foram encontrados aproximadamente 100+ erros de TypeScript que precisam ser corrigidos nos controllers e services. Todos decorrem da atualização dos schemas para refletir a estrutura real do banco de dados.

## Categorias de Erros

### 1. ❌ Sistema de Autenticação (CRÍTICO)

**Problema**: A tabela `users` não tem campos `email`, `password` ou `role`

**Arquivos afetados**:
- `src/controllers/auth.controller.ts`
- `src/services/auth.service.ts`
- `src/middlewares/auth.middleware.ts`
- `src/routes/auth.routes.ts`

**Ação necessária**:
- **Reimplementar** completamente o sistema de autenticação OU
- **Criar** uma nova tabela `auth_users` com email/password/role OU
- **Migrar** o banco para adicionar campos necessários

### 2. ❌ Tabela Customers Inexistente (CRÍTICO)

**Problema**: Não existe tabela `customers` no banco

**Arquivos afetados**:
- `src/services/customer.service.ts`
- `src/controllers/customer.controller.ts`
- `src/routes/customer.routes.ts`

**Ação necessária**:
- **Remover** toda a funcionalidade de customers OU
- **Criar** tabela customers no banco OU
- **Refatorar** para usar `service_order.customer_name`

### 3. ⚠️ Campos Renomeados

**Problema**: Banco usa snake_case, código usa camelCase

**Exemplos**:
- `id` → `user_id`, `product_id`, `service_order_id`, etc.
- `name` → `product_name`, `service_category_name`
- `active` → `is_active`
- `stockQuantity` → `quantity`
- `minStock` → `quantity_alert`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

**Arquivos afetados**:
- Todos os services (*.service.ts)
- Todos os controllers (*.controller.ts)

**Ação necessária**:
- Atualizar todas as referências de campos para snake_case
- Atualizar queries Prisma para usar nomes corretos
- Ajustar responses para retornar campos em snake_case

### 4. ⚠️ Services: Estrutura Mudou

**Problema**: Service foi dividido em 4 tabelas

**Antes**:
- Service (uma tabela)

**Agora**:
- `service` (categorias de serviço)
- `service_order` (ordens de serviço)
- `services_realized` (serviços realizados)
- `service_products` (produtos usados)

**Arquivos afetados**:
- `src/services/service.service.ts`
- `src/controllers/service.controller.ts`
- `src/routes/service.routes.ts`

**Ação necessária**:
- Refatorar completamente a lógica de serviços
- Criar services separados para cada tabela
- Atualizar controllers para lidar com 4 tabelas
- Revisar rotas (talvez criar `/service-categories` e `/service-orders`)

### 5. ⚠️ CashFlow: Campos Diferentes

**Problema**: Estrutura do cash_flow mudou

**Campos removidos**:
- `id` → `cash_flow_id`
- `paymentId` (não existe relacionamento payment)
- `userId` (não existe relação com user)
- `type` → `direction`
- `category` (não existe)
- `description` → `note`
- `date` → `occurred_at`

**Campos novos**:
- `service_order_id`
- `service_realized_id`
- `service_product_id`

**Arquivos afetados**:
- `src/services/cashflow.service.ts`
- `src/controllers/cashflow.controller.ts`

**Ação necessária**:
- Atualizar todos os campos para novos nomes
- Remover lógica relacionada a `payment` e `user`
- Adicionar lógica para service_order/service_realized/service_product
- Ajustar queries de resumo (não há campo `category`)

### 6. ⚠️ Products: Campos Diferentes

**Problema**: Campos de produtos mudaram

**Campos removidos/renomeados**:
- `id` → `product_id`
- `name` → `product_name`
- `code` (não existe)
- `barcode` (não existe)
- `description` (não existe)
- `brand` (não existe)
- `category` → `category_id` (FK para product_category)
- `costPrice` → `buy_price`
- `salePrice` → `sell_price`
- `stockQuantity` → `quantity`
- `minStock` → `quantity_alert`
- `maxStock` (não existe)
- `unit` (não existe)

**Arquivos afetados**:
- `src/services/product.service.ts`
- `src/controllers/product.controller.ts`

**Ação necessária**:
- Atualizar campos para snake_case
- Remover campos inexistentes (code, barcode, description, brand, maxStock, unit)
- Usar `category_id` como FK, não string
- Ajustar validações de estoque
- Renomear `stockMovement` para `stock_move`

### 7. ⚠️ StockMovement: Nome da Tabela

**Problema**: Tabela é `stock_move` não `stockMovement`

**Arquivos afetados**:
- `src/services/product.service.ts`

**Ação necessária**:
```typescript
// Errado:
prisma.stockMovement.create()

// Correto:
prisma.stock_move.create()
```

## Erros Específicos por Arquivo

### auth.service.ts (21 erros)
- [ ] Remover uso de `email` (não existe)
- [ ] Remover uso de `password` (não existe)
- [ ] Remover uso de `role` (não existe)
- [ ] Usar `user_id` ao invés de `id`
- [ ] Usar `is_active` ao invés de `active`
- [ ] Reimplementar sistema de auth

### customer.service.ts (11 erros)
- [ ] Tabela `customer` não existe
- [ ] Decidir: remover funcionalidade ou criar tabela
- [ ] Se criar tabela, executar migration no banco

### product.service.ts (24 erros)
- [ ] Usar `product_id` ao invés de `id`
- [ ] Usar `product_name` ao invés de `name`
- [ ] Remover `code`, `barcode`, `description`, `brand`, `maxStock`, `unit`
- [ ] Usar `category_id` (bigint FK) ao invés de `category` (string)
- [ ] Usar `quantity` ao invés de `stockQuantity`
- [ ] Usar `quantity_alert` ao invés de `minStock`
- [ ] Usar `buy_price` e `sell_price` ao invés de `costPrice` e `salePrice`
- [ ] Usar `prisma.stock_move` ao invés de `prisma.stockMovement`
- [ ] Usar `move_type` ao invés de `type`
- [ ] Remover campo `date` (usar `created_at`)

### service.service.ts (10+ erros)
- [ ] Decidir qual tabela usar (service, service_order, etc.)
- [ ] Usar `service_order_id` ao invés de `id`
- [ ] Remover relação com `customer` (tabela não existe)
- [ ] Usar campos corretos baseado na tabela escolhida
- [ ] Usar `created_at` ao invés de `createdAt`

### cashflow.service.ts (17 erros)
- [ ] Usar `cash_flow_id` ao invés de `id`
- [ ] Usar `direction` ao invés de `type`
- [ ] Usar `occurred_at` ao invés de `date`
- [ ] Usar `note` ao invés de `description`
- [ ] Remover campo `category` (não existe)
- [ ] Remover relação com `payment` (tabela não existe)
- [ ] Adicionar `service_order_id`, `service_realized_id`, `service_product_id`
- [ ] Refatorar método `getCategorySummary` (não há categoria)

## Plano de Ação Recomendado

### Fase 1: Decisões Críticas
1. **Autenticação**: Decidir abordagem (nova tabela ou migration)
2. **Customers**: Decidir se cria tabela ou remove funcionalidade
3. **Services**: Definir estrutura de rotas/controllers para 4 tabelas

### Fase 2: Refatoração
1. Atualizar Product Service e Controller
2. Atualizar CashFlow Service e Controller
3. Atualizar Service Service e Controller (após decisão)
4. Atualizar User Service e Controller
5. Reimplementar Auth (se necessário)
6. Atualizar ou remover Customer (após decisão)

### Fase 3: Rotas e Documentação
1. Atualizar todas as rotas para novos schemas
2. Atualizar documentação Swagger
3. Atualizar validações com novos schemas Zod

### Fase 4: Testes
1. Testar cada endpoint individualmente
2. Testar relacionamentos entre tabelas
3. Testar serialização de BigInt
4. Validar constraints do banco

## Scripts Úteis

### Buscar todos os usos de campos antigos:
```bash
# Buscar 'costPrice'
grep -r "costPrice" src/

# Buscar 'stockQuantity'
grep -r "stockQuantity" src/

# Buscar 'prisma.customer'
grep -r "prisma.customer" src/

# Buscar '.email'
grep -r "\.email" src/services/ src/controllers/
```

### Testar compilação:
```bash
npm run build
```

### Ver erros específicos:
```bash
npm run build 2>&1 | grep "service.service.ts"
```

## Conclusão

A sincronização dos schemas foi bem-sucedida! Agora o próximo passo é corrigir os services e controllers para que usem a estrutura correta do banco de dados.

**Tempo estimado**: 4-6 horas de refatoração dependendo das decisões sobre auth e customers.

**Prioridade**: ALTA - Sistema não compila até que esses erros sejam corrigidos.
