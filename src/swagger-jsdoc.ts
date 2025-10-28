import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API GetMoto',
      version: '1.0.0',
      description: 'API para gestão de oficina de motos - Sistema de CRM completo',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api-crm-getmoto.example.com',
        description: 'Production server',
      },
    ],
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header usando o esquema Bearer',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            role: {
              type: 'string',
              enum: ['ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT'],
              nullable: true,
            },
            position: { type: 'string', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            product_id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            code: { type: 'string', nullable: true },
            barcode: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            brand: { type: 'string', nullable: true },
            cost_price_cents: { type: 'integer', format: 'int64' },
            sale_price_cents: { type: 'integer', format: 'int64' },
            stock_quantity: { type: 'integer' },
            min_stock: { type: 'integer' },
            max_stock: { type: 'integer', nullable: true },
            unit: { type: 'string' },
            category_id: { type: 'integer', format: 'int64', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            service_order_id: { type: 'integer', format: 'int64' },
            customer_name: { type: 'string' },
            customer_phone: { type: 'string', nullable: true },
            vehicle_id: { type: 'integer', format: 'int64', nullable: true },
            professional_name: { type: 'string', nullable: true },
            description: { type: 'string' },
            status: { type: 'string' },
            estimated_labor_cost_cents: { type: 'integer', format: 'int64', nullable: true },
            category_id: { type: 'integer', format: 'int64', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductCategory: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ServiceCategory: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            vehicle_id: { type: 'integer', format: 'int64' },
            customer_id: { type: 'integer', format: 'int64', nullable: true },
            brand: { type: 'string', nullable: true },
            model: { type: 'string', nullable: true },
            year: { type: 'integer', nullable: true },
            license_plate: { type: 'string', nullable: true },
            color: { type: 'string', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CashFlow: {
          type: 'object',
          properties: {
            transaction_id: { type: 'integer', format: 'int64' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            category: { type: 'string' },
            amount_cents: { type: 'integer', format: 'int64' },
            description: { type: 'string', nullable: true },
            date: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/auth.routes.ts',
    './src/routes/user.routes.ts',
    './src/routes/service.routes.ts',
    './src/routes/product.routes.ts',
    './src/routes/cashflow.routes.ts',
    './src/routes/service-category.routes.ts',
    './src/routes/product-category.routes.ts',
    './src/routes/vehicle.routes.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const outputPath = path.join(__dirname, 'swagger-output.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log('✅ Swagger documentation generated successfully with swagger-jsdoc!');
console.log(`📄 Output file: ${outputPath}`);
