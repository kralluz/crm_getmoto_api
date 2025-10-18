import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Configurar faker para português do Brasil
faker.seed(12345); // Seed fixo para resultados reproduzíveis

// Helpers
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Marcas de motos brasileiras/populares
const MOTORCYCLE_BRANDS = [
  'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW',
  'Harley-Davidson', 'Ducati', 'Triumph', 'Royal Enfield'
];

const MOTORCYCLE_MODELS: Record<string, string[]> = {
  'Honda': ['CG 160', 'Biz 125', 'CB 500', 'CB 650', 'NC 750', 'Africa Twin', 'PCX'],
  'Yamaha': ['Factor 150', 'Fazer 250', 'MT-03', 'MT-07', 'XTZ 250', 'Crosser', 'NMAX'],
  'Suzuki': ['GSX-S750', 'V-Strom 650', 'Burgman 400', 'Intruder 150', 'Hayabusa'],
  'Kawasaki': ['Ninja 400', 'Ninja 650', 'Z400', 'Versys 650', 'Z900'],
  'BMW': ['G 310', 'F 850', 'R 1250', 'S 1000 RR'],
};

const PRODUCT_CATEGORIES = [
  'Óleo Motor',
  'Filtro',
  'Correia',
  'Pneu',
  'Bateria',
  'Vela',
  'Pastilha de Freio',
  'Disco de Freio',
  'Corrente',
  'Coroa',
  'Pinhão',
  'Luz',
  'Acessório',
  'Ferramenta',
];

const PRODUCT_BRANDS = [
  'Motul', 'Castrol', 'Shell', 'Ipiranga', 'Lubrax',
  'Bosch', 'NGK', 'Fram', 'Michelin', 'Pirelli', 'Levorin',
  'Moura', 'Heliar', 'Whisler', 'Cobreq', 'ProX'
];

const SERVICE_DESCRIPTIONS = [
  'Troca de óleo e filtro',
  'Revisão completa',
  'Troca de pneus',
  'Regulagem de freios',
  'Troca de pastilhas',
  'Troca de bateria',
  'Limpeza de carburador',
  'Troca de correia',
  'Troca de corrente e coroa',
  'Alinhamento e balanceamento',
  'Troca de velas',
  'Reparo elétrico',
  'Troca de embreagem',
  'Revisão de suspensão',
  'Pintura e funilaria',
];

// Categorias de despesas operacionais (usadas no fluxo de caixa)
// const EXPENSE_CATEGORIES = [
//   'Aluguel',
//   'Energia Elétrica',
//   'Água',
//   'Internet',
//   'Telefone',
//   'Salários',
//   'Compra de Estoque',
//   'Compra de Peças',
//   'Manutenção',
//   'Impostos',
//   'Materiais de Limpeza',
//   'Marketing',
//   'Contador',
// ];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Limpar banco antes de popular
  console.log('🗑️  Limpando banco de dados...');
  await prisma.cashFlow.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.service.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.motorcycle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Banco limpo!\n');

  // Data de referência: 1 ano atrás até hoje
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // ============================================================================
  // 1. CRIAR USUÁRIOS
  // ============================================================================
  console.log('👥 Criando usuários...');
  const passwordHash = await bcrypt.hash('senha123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin GetMoto',
        email: 'admin@getmoto.com',
        password: passwordHash,
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Silva',
        email: 'carlos@getmoto.com',
        password: passwordHash,
        role: 'MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'João Mecânico',
        email: 'joao@getmoto.com',
        password: passwordHash,
        role: 'MECHANIC',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Atendente',
        email: 'maria@getmoto.com',
        password: passwordHash,
        role: 'ATTENDANT',
      },
    }),
  ]);
  console.log(`✅ ${users.length} usuários criados!\n`);

  // ============================================================================
  // 2. CRIAR CLIENTES E MOTOS
  // ============================================================================
  console.log('🏍️  Criando clientes e motos...');
  const customers = [];
  const motorcycles = [];

  for (let i = 0; i < 80; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`,
        cpf: faker.string.numeric(11),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode('#####-###'),
        notes: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
        createdAt: randomDate(startDate, endDate),
      },
    });
    customers.push(customer);

    // Cada cliente tem 1-2 motos
    const numMotorcycles = Math.random() > 0.7 ? 2 : 1;
    for (let j = 0; j < numMotorcycles; j++) {
      const brand = randomElement(MOTORCYCLE_BRANDS);
      const models = MOTORCYCLE_MODELS[brand] || [faker.vehicle.model()];
      const model = randomElement(models);
      const year = faker.date.past({ years: 15 }).getFullYear();

      const motorcycle = await prisma.motorcycle.create({
        data: {
          customerId: customer.id,
          brand,
          model,
          year,
          plate: faker.vehicle.vrm().replace('-', ''),
          color: faker.vehicle.color(),
          mileage: faker.number.int({ min: 1000, max: 100000 }),
          createdAt: customer.createdAt,
        },
      });
      motorcycles.push(motorcycle);
    }
  }
  console.log(`✅ ${customers.length} clientes e ${motorcycles.length} motos criadas!\n`);

  // ============================================================================
  // 3. CRIAR PRODUTOS (PEÇAS E ACESSÓRIOS)
  // ============================================================================
  console.log('📦 Criando produtos...');
  const products = [];

  for (let i = 0; i < 100; i++) {
    const category = randomElement(PRODUCT_CATEGORIES);
    const brand = randomElement(PRODUCT_BRANDS);
    const costPrice = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
    const salePrice = costPrice * faker.number.float({ min: 1.3, max: 2.5, fractionDigits: 2 });

    const product = await prisma.product.create({
      data: {
        name: `${brand} ${category} ${faker.string.alphanumeric(4).toUpperCase()}`,
        description: faker.commerce.productDescription(),
        brand,
        code: faker.string.alphanumeric(10).toUpperCase(),
        barcode: faker.string.numeric(13),
        category,
        costPrice,
        salePrice: parseFloat(salePrice.toFixed(2)),
        stockQuantity: faker.number.int({ min: 5, max: 100 }),
        minStock: 5,
        maxStock: 200,
        unit: 'UN',
        createdAt: randomDate(startDate, endDate),
      },
    });
    products.push(product);
  }
  console.log(`✅ ${products.length} produtos criados!\n`);

  // ============================================================================
  // 4. CRIAR SERVIÇOS, ITEMS, PAGAMENTOS E FLUXO DE CAIXA
  // ============================================================================
  console.log('🔧 Criando serviços e transações...');

  let serviceCount = 0;
  let cashFlowCount = 0;

  // Criar ~300 serviços distribuídos ao longo do ano
  for (let i = 0; i < 300; i++) {
    const serviceDate = randomDate(startDate, endDate);
    const motorcycle = randomElement(motorcycles);
    const customer = customers.find(c => c.id === motorcycle.customerId)!;
    const mechanic = randomElement(users.filter(u => u.role === 'MECHANIC' || u.role === 'MANAGER'));

    const status = (() => {
      const rand = Math.random();
      if (rand > 0.9) return 'CANCELLED';
      if (rand > 0.8) return 'PENDING';
      if (rand > 0.7) return 'IN_PROGRESS';
      return 'COMPLETED';
    })();

    const description = randomElement(SERVICE_DESCRIPTIONS);
    const laborCost = faker.number.float({ min: 50, max: 500, fractionDigits: 2 });

    // Criar serviço
    const service = await prisma.service.create({
      data: {
        customerId: customer.id,
        motorcycleId: motorcycle.id,
        userId: mechanic.id,
        description,
        diagnosis: faker.lorem.sentence(),
        status,
        startDate: serviceDate,
        estimatedEndDate: status !== 'CANCELLED' ? new Date(serviceDate.getTime() + 86400000 * faker.number.int({ min: 1, max: 7 })) : undefined,
        endDate: status === 'COMPLETED' ? new Date(serviceDate.getTime() + 86400000 * faker.number.int({ min: 1, max: 5 })) : undefined,
        laborCost,
        totalCost: 0, // Será calculado depois
        createdAt: serviceDate,
      },
    });
    serviceCount++;

    // Adicionar items ao serviço (peças + mão de obra)
    const numItems = faker.number.int({ min: 1, max: 5 });
    let totalCost = Number(laborCost);

    // Adicionar mão de obra como item
    await prisma.serviceItem.create({
      data: {
        serviceId: service.id,
        description: 'Mão de obra',
        quantity: 1,
        unitPrice: laborCost,
        totalPrice: laborCost,
        isLabor: true,
      },
    });

    // Adicionar peças
    for (let j = 0; j < numItems; j++) {
      const product = randomElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = Number(product.salePrice);
      const totalPrice = unitPrice * quantity;
      totalCost += totalPrice;

      await prisma.serviceItem.create({
        data: {
          serviceId: service.id,
          productId: product.id,
          description: product.name,
          quantity,
          unitPrice,
          totalPrice,
          isLabor: false,
        },
      });

      // Criar movimentação de estoque (saída)
      if (status === 'COMPLETED') {
        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            type: 'EXIT',
            quantity: -quantity,
            unitPrice: Number(product.costPrice),
            totalPrice: Number(product.costPrice) * quantity,
            reason: `Venda - Serviço #${service.id.substring(0, 8)}`,
            reference: service.id,
            date: serviceDate,
          },
        });

        // Atualizar estoque
        await prisma.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: quantity } },
        });
      }
    }

    // Atualizar custo total do serviço
    await prisma.service.update({
      where: { id: service.id },
      data: { totalCost },
    });

    // Criar pagamento e fluxo de caixa (apenas para serviços completados)
    if (status === 'COMPLETED') {
      const paymentMethod = randomElement(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX'] as const);
      const paymentDate = new Date(serviceDate.getTime() + 86400000 * faker.number.int({ min: 0, max: 3 }));

      const payment = await prisma.payment.create({
        data: {
          serviceId: service.id,
          amount: totalCost,
          method: paymentMethod,
          status: 'PAID',
          dueDate: paymentDate,
          paymentDate,
          createdAt: serviceDate,
        },
      });

      // Criar entrada no fluxo de caixa
      await prisma.cashFlow.create({
        data: {
          paymentId: payment.id,
          userId: mechanic.id,
          type: 'INCOME',
          category: 'Serviço de Manutenção',
          amount: totalCost,
          description: `${description} - ${customer.name}`,
          date: paymentDate,
          createdAt: paymentDate,
        },
      });
      cashFlowCount++;
    }
  }
  console.log(`✅ ${serviceCount} serviços criados!\n`);

  // ============================================================================
  // 5. CRIAR DESPESAS OPERACIONAIS NO FLUXO DE CAIXA
  // ============================================================================
  console.log('💸 Criando despesas operacionais...');

  // Criar despesas mensais
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + month);

    // Despesas fixas mensais
    const fixedExpenses = [
      { category: 'Aluguel', amount: 3500 },
      { category: 'Salários', amount: 8000 },
      { category: 'Energia Elétrica', amount: faker.number.float({ min: 300, max: 600, fractionDigits: 2 }) },
      { category: 'Água', amount: faker.number.float({ min: 80, max: 150, fractionDigits: 2 }) },
      { category: 'Internet', amount: 150 },
      { category: 'Telefone', amount: 200 },
    ];

    for (const expense of fixedExpenses) {
      const expenseDate = new Date(monthDate);
      expenseDate.setDate(5); // Despesas no dia 5 de cada mês

      await prisma.cashFlow.create({
        data: {
          userId: users[0].id, // Admin
          type: 'EXPENSE',
          category: expense.category,
          amount: expense.amount,
          description: `${expense.category} - ${monthDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`,
          date: expenseDate,
          createdAt: expenseDate,
        },
      });
      cashFlowCount++;
    }

    // Despesas variáveis (compra de estoque, impostos, etc)
    const variableExpenseCount = faker.number.int({ min: 3, max: 8 });
    for (let i = 0; i < variableExpenseCount; i++) {
      const category = randomElement(['Compra de Estoque', 'Compra de Peças', 'Manutenção', 'Impostos', 'Marketing', 'Materiais de Limpeza']);
      const amount = faker.number.float({ min: 100, max: 2000, fractionDigits: 2 });
      const expenseDate = randomDate(monthDate, new Date(monthDate.getTime() + 30 * 86400000));

      await prisma.cashFlow.create({
        data: {
          userId: users[0].id,
          type: 'EXPENSE',
          category,
          amount,
          description: `${category} - ${faker.commerce.productName()}`,
          date: expenseDate,
          createdAt: expenseDate,
        },
      });
      cashFlowCount++;

      // Se for compra de estoque, criar movimentações
      if (category === 'Compra de Estoque' || category === 'Compra de Peças') {
        const product = randomElement(products);
        const quantity = faker.number.int({ min: 10, max: 50 });

        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            type: 'ENTRY',
            quantity,
            unitPrice: Number(product.costPrice),
            totalPrice: Number(product.costPrice) * quantity,
            reason: 'Compra de estoque',
            date: expenseDate,
          },
        });

        await prisma.product.update({
          where: { id: product.id },
          data: { stockQuantity: { increment: quantity } },
        });
      }
    }
  }
  console.log(`✅ Despesas operacionais criadas!\n`);

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log('📊 RESUMO DO SEED:\n');
  console.log(`👥 Usuários: ${users.length}`);
  console.log(`🏍️  Clientes: ${customers.length}`);
  console.log(`🏍️  Motos: ${motorcycles.length}`);
  console.log(`📦 Produtos: ${products.length}`);
  console.log(`🔧 Serviços: ${serviceCount}`);
  console.log(`💰 Transações de caixa: ${cashFlowCount}`);

  // Calcular resumo financeiro
  const summary = await prisma.cashFlow.groupBy({
    by: ['type'],
    _sum: { amount: true },
  });

  console.log('\n💵 RESUMO FINANCEIRO (1 ANO):\n');
  summary.forEach(item => {
    const total = Number(item._sum.amount || 0);
    console.log(`${item.type === 'INCOME' ? '📈 Entradas' : '📉 Saídas'}: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  });

  const income = Number(summary.find(s => s.type === 'INCOME')?._sum.amount || 0);
  const expense = Number(summary.find(s => s.type === 'EXPENSE')?._sum.amount || 0);
  const balance = income - expense;

  console.log(`\n💰 Saldo: R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}`);

  console.log('\n✅ Seed concluído com sucesso! 🎉\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
