import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'CRM API GetMoto',
    version: '1.0.0',
    description: 'API para gestão de oficina de motos - Sistema de CRM completo',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  basePath: '/',
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticação e autorização',
    },
    {
      name: 'Users',
      description: 'Gerenciamento de usuários do sistema',
    },
    {
      name: 'Services',
      description: 'Gerenciamento de serviços/ordens de serviço',
    },
    {
      name: 'Products',
      description: 'Gerenciamento de produtos e estoque',
    },
    {
      name: 'CashFlow',
      description: 'Gerenciamento de fluxo de caixa',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Authorization header usando o esquema Bearer. Exemplo: "Bearer {token}"',
    },
  },
  definitions: {
    User: {
      id: 'uuid',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    Customer: {
      id: 'uuid',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '11999999999',
      cpf: '12345678900',
      address: 'Rua Exemplo, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234567',
    },
    Service: {
      id: 'uuid',
      customerId: 'uuid',
      motorcycleId: 'uuid',
      userId: 'uuid',
      description: 'Troca de óleo e filtro',
      status: 'IN_PROGRESS',
      laborCost: 100.00,
      totalCost: 250.00,
    },
    Product: {
      id: 'uuid',
      name: 'Óleo Motul 10W40',
      code: 'OIL001',
      barcode: '7891234567890',
      costPrice: 50.00,
      salePrice: 80.00,
      stockQuantity: 25,
      minStock: 5,
    },
    CashFlow: {
      id: 'uuid',
      type: 'INCOME',
      category: 'Serviços',
      amount: 250.00,
      description: 'Pagamento de serviço #123',
      date: '2024-01-01T00:00:00.000Z',
    },
  },
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = [
  './src/routes/auth.routes.ts',
  './src/routes/user.routes.ts',
  './src/routes/service.routes.ts',
  './src/routes/product.routes.ts',
  './src/routes/cashflow.routes.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log(`📄 Output file: ${outputFile}`);
});
