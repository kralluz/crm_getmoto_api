/**
 * Exemplo de uso do cliente API gerado pelo Orval
 *
 * Este arquivo demonstra como usar o cliente API TypeScript gerado
 * automaticamente pelo Orval a partir da especificação Swagger.
 */

import { getCRMAPIGetMoto } from './src/api-client/endpoints';
// Importar modelos TypeScript
import { User, Customer, Product, Service, CashFlow } from './src/api-client/models';

// Inicializar o cliente
const api = getCRMAPIGetMoto();

/**
 * Exemplo 1: Fazer login
 */
async function loginExample() {
  try {
    const response = await api.postLogin();
    console.log('Login realizado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

/**
 * Exemplo 2: Buscar usuário autenticado
 */
async function getMeExample() {
  try {
    const user = await api.getMe();
    console.log('Usuário autenticado:', user);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

/**
 * Exemplo 3: Listar todos os registros
 */
async function listExample() {
  try {
    const items = await api.get();
    console.log('Lista de itens:', items);
    return items;
  } catch (error) {
    console.error('Erro ao listar:', error);
    throw error;
  }
}

/**
 * Exemplo 4: Buscar por ID
 */
async function getByIdExample(id: string) {
  try {
    const item = await api.getId(id);
    console.log('Item encontrado:', item);
    return item;
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    throw error;
  }
}

/**
 * Exemplo 5: Criar novo registro
 */
async function createExample() {
  try {
    const newItem = await api.post();
    console.log('Item criado:', newItem);
    return newItem;
  } catch (error) {
    console.error('Erro ao criar item:', error);
    throw error;
  }
}

/**
 * Exemplo 6: Atualizar registro
 */
async function updateExample(id: string) {
  try {
    const updatedItem = await api.putId(id);
    console.log('Item atualizado:', updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    throw error;
  }
}

/**
 * Exemplo 7: Deletar registro
 */
async function deleteExample(id: string) {
  try {
    await api.deleteId(id);
    console.log('Item deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    throw error;
  }
}

/**
 * Exemplo 8: Buscar resumo financeiro
 */
async function getSummaryExample() {
  try {
    const summary = await api.getSummary();
    console.log('Resumo financeiro:', summary);
    return summary;
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    throw error;
  }
}

/**
 * Exemplo 9: Movimentações de estoque
 */
async function stockMovementsExample() {
  try {
    // Listar movimentações
    const movements = await api.getStockMovements();
    console.log('Movimentações de estoque:', movements);

    // Adicionar nova movimentação
    const newMovement = await api.postStockMovements();
    console.log('Nova movimentação criada:', newMovement);

    return { movements, newMovement };
  } catch (error) {
    console.error('Erro nas movimentações de estoque:', error);
    throw error;
  }
}

// Exportar todas as funções de exemplo
export {
  loginExample,
  getMeExample,
  listExample,
  getByIdExample,
  createExample,
  updateExample,
  deleteExample,
  getSummaryExample,
  stockMovementsExample,
  api,
};

/**
 * OBSERVAÇÕES IMPORTANTES:
 *
 * 1. Configurar o baseURL no arquivo axios-instance.ts ou via variável de ambiente
 * 2. O token de autenticação é configurado automaticamente via interceptor
 * 3. Todos os métodos retornam Promises tipadas com TypeScript
 * 4. Os modelos TypeScript são gerados automaticamente e garantem type-safety
 * 5. Para regenerar o cliente após mudanças na API: npm run generate:client
 *
 * CONFIGURAÇÃO DO TOKEN:
 * - No browser: localStorage.setItem('auth_token', 'seu-token')
 * - No Node.js: process.env.API_TOKEN = 'seu-token'
 *
 * REGENERAR CLIENTE:
 * npm run generate:client
 */
