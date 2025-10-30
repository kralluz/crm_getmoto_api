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
      name: 'Service Categories',
      description: 'Gerenciamento de categorias de serviços',
    },
    {
      name: 'Products',
      description: 'Gerenciamento de produtos e estoque',
    },
    {
      name: 'Product Categories',
      description: 'Gerenciamento de categorias de produtos',
    },
    {
      name: 'Vehicles',
      description: 'Gerenciamento de veículos/motocicletas',
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
    Service: {
      id: 'uuid',
      customer_name: 'Maria Santos',
      vehicle_id: 123,
      professional_name: 'João Silva',
      description: 'Troca de óleo e filtro',
      status: 'IN_PROGRESS',
      estimated_labor_cost: 100.00,
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
    ProductCategory: {
      id: 1,
      name: 'Óleos e Lubrificantes',
      description: 'Produtos para lubrificação',
      is_active: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    ServiceCategory: {
      id: 1,
      name: 'Manutenção Preventiva',
      description: 'Serviços de manutenção preventiva',
      is_active: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    Vehicle: {
      id: 1,
      customer_id: 123,
      brand: 'Honda',
      model: 'CG 160',
      year: 2023,
      license_plate: 'ABC-1234',
      color: 'Vermelho',
      is_active: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
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
  './src/routes/service-category.routes.ts',
  './src/routes/product-category.routes.ts',
  './src/routes/vehicle.routes.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log(`📄 Output file: ${outputFile}`);
});
