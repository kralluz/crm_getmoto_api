#!/bin/bash

# Script para executar migration manual
# Uso: ./run-migration.sh

echo "🔧 Executando migration: add_auth_fields_to_users"

# Carregar variáveis do .env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Executar migration
psql $DATABASE_URL -f prisma/migrations/add_auth_fields_to_users.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration executada com sucesso!"
  echo "📝 Executando prisma db pull para atualizar schema..."
  npx prisma db pull
  echo "🔄 Gerando Prisma Client..."
  npx prisma generate
  echo "✅ Concluído!"
else
  echo "❌ Erro ao executar migration"
  exit 1
fi
