const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client(process.env.DATABASE_URL);

// Lista de migrations manuais a serem aplicadas
// ⚠️ IMPORTANTE: Todas as migrations manuais já foram aplicadas.
// Este script é mantido apenas como referência e para uso futuro, se necessário.
// Preferir sempre migrations do Prisma (npx prisma migrate dev)
const MANUAL_MIGRATIONS = [
  // Não há migrations pendentes
  // Adicione aqui apenas em casos excepcionais onde Prisma não pode resolver
];

async function checkIfMigrationApplied(migrationName) {
  try {
    // Criar tabela de controle se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS manual_migrations_applied (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      );
    `);

    const result = await client.query(
      'SELECT * FROM manual_migrations_applied WHERE migration_name = $1',
      [migrationName]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar migration:', error.message);
    return false;
  }
}

async function markMigrationApplied(migrationName, description) {
  try {
    await client.query(
      'INSERT INTO manual_migrations_applied (migration_name, description) VALUES ($1, $2) ON CONFLICT (migration_name) DO NOTHING',
      [migrationName, description]
    );
  } catch (error) {
    console.error('❌ Erro ao marcar migration:', error.message);
  }
}

async function applyMigration() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    let appliedCount = 0;
    let skippedCount = 0;

    for (const migration of MANUAL_MIGRATIONS) {
      console.log(`📝 Verificando migration: ${migration.name}`);
      console.log(`   Descrição: ${migration.description}`);

      // Verificar se o arquivo existe
      if (!fs.existsSync(migration.file)) {
        console.log(`⚠️  Arquivo não encontrado: ${migration.file} - PULANDO\n`);
        skippedCount++;
        continue;
      }

      // Verificar se já foi aplicada
      const isApplied = await checkIfMigrationApplied(migration.name);

      if (isApplied) {
        console.log(`✅ Migration já aplicada anteriormente - PULANDO\n`);
        skippedCount++;
        continue;
      }

      // Aplicar migration
      console.log(`🔄 Aplicando migration...`);
      const sql = fs.readFileSync(migration.file, 'utf8');

      await client.query(sql);

      // Marcar como aplicada
      await markMigrationApplied(migration.name, migration.description);

      console.log(`✅ Migration aplicada com sucesso!\n`);
      appliedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 RESUMO:`);
    console.log(`   ✅ Migrations aplicadas: ${appliedCount}`);
    console.log(`   ⏭️  Migrations puladas: ${skippedCount}`);
    console.log(`   📝 Total verificadas: ${MANUAL_MIGRATIONS.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao aplicar migrations:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
