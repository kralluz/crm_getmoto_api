/**
 * Script para testar a conexão com o banco de dados
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔄 Testando conexão com o banco de dados...\n');

  try {
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!\n');

    // Verificar tabelas criadas
    console.log('📊 Verificando tabelas criadas:\n');

    const users = await prisma.user.count();
    console.log(`   - users: ${users} registros`);

    const customers = await prisma.customer.count();
    console.log(`   - customers: ${customers} registros`);

    const motorcycles = await prisma.motorcycle.count();
    console.log(`   - motorcycles: ${motorcycles} registros`);

    const services = await prisma.service.count();
    console.log(`   - services: ${services} registros`);

    const products = await prisma.product.count();
    console.log(`   - products: ${products} registros`);

    const payments = await prisma.payment.count();
    console.log(`   - payments: ${payments} registros`);

    const cashFlow = await prisma.cashFlow.count();
    console.log(`   - cash_flow: ${cashFlow} registros`);

    const stockMovements = await prisma.stockMovement.count();
    console.log(`   - stock_movements: ${stockMovements} registros`);

    const serviceItems = await prisma.serviceItem.count();
    console.log(`   - service_items: ${serviceItems} registros`);

    console.log('\n✅ Todas as tabelas foram criadas com sucesso!');
    console.log('\n🎉 Banco de dados configurado e pronto para uso!');

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
