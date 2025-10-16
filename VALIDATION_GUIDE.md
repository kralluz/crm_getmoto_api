# Guia de Validação e Tratamento de Erros

## Sistema de Validação com Zod

### AppError - Classe de Erros

A classe `AppError` fornece métodos estáticos para criar erros consistentes:

```typescript
import { AppError } from './middlewares/error.middleware';

// Métodos disponíveis:
AppError.badRequest('Mensagem')        // 400
AppError.unauthorized('Mensagem')      // 401
AppError.forbidden('Mensagem')         // 403
AppError.notFound('Mensagem')          // 404
AppError.conflict('Mensagem')          // 409
AppError.internal('Mensagem')          // 500
```

### Schemas Zod

Todos os schemas estão organizados em arquivos separados:

#### Input Schemas (para validação de entrada)
- `createXSchema` - Validação para criação
- `updateXSchema` - Validação para atualização
- Incluem validações de tamanho, formato, regex, etc.

#### Response Schemas (para validação de saída)
- `xResponseSchema` - Validação do objeto de resposta
- Garantem que a API sempre retorna dados no formato esperado

### Middlewares de Validação

```typescript
import { validateBody, validateParams, validateQuery, validate } from './middlewares/validate.middleware';
import { idParamSchema } from './schemas/common.schema';

// Validar apenas body
router.post('/', validateBody(createUserSchema), controller.create);

// Validar params (ex: UUID)
router.get('/:id', validateParams(idParamSchema), controller.getById);

// Validar query
router.get('/', validateQuery(paginationSchema), controller.getAll);

// Validar tudo junto
router.put('/:id', validate(z.object({
  params: idParamSchema,
  body: updateUserSchema
})), controller.update);
```

### Exemplo Completo de Route

```typescript
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { idParamSchema } from './schemas/common.schema';

const router = Router();
const userController = new UserController();

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET /users - Listar (sem validação necessária)
router.get('/', userController.getAll);

// GET /users/:id - Buscar por ID (valida UUID)
router.get('/:id',
  validateParams(idParamSchema),
  userController.getById
);

// POST /users - Criar (valida body)
router.post('/',
  requireRole('ADMIN'),
  validateBody(createUserSchema),
  userController.create
);

// PUT /users/:id - Atualizar (valida params e body)
router.put('/:id',
  requireRole('ADMIN', 'MANAGER'),
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  userController.update
);

// DELETE /users/:id - Deletar (valida params)
router.delete('/:id',
  requireRole('ADMIN'),
  validateParams(idParamSchema),
  userController.delete
);

export default router;
```

### Exemplo Completo de Controller com Response Parse

```typescript
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { userResponseSchema, authResponseSchema } from '../schemas/user.schema';

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    // Body já foi validado pelo middleware
    const data = req.body;

    const user = await userService.create(data);

    // Valida e sanitiza a resposta
    const validatedResponse = userResponseSchema.parse(user);

    return res.status(201).json(validatedResponse);
  }

  async getAll(req: Request, res: Response) {
    const users = await userService.getAll();

    // Valida array de responses
    const validatedResponse = users.map(user =>
      userResponseSchema.parse(user)
    );

    return res.json(validatedResponse);
  }

  async getById(req: Request, res: Response) {
    // Params já foram validados
    const { id } = req.params;

    const user = await userService.getById(id);

    // Valida response
    const validatedResponse = userResponseSchema.parse(user);

    return res.json(validatedResponse);
  }

  async update(req: Request, res: Response) {
    // Params e body já foram validados
    const { id } = req.params;
    const data = req.body;

    const user = await userService.update(id, data);

    // Valida response
    const validatedResponse = userResponseSchema.parse(user);

    return res.json(validatedResponse);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await userService.delete(id);

    return res.status(204).send();
  }
}
```

### Exemplo de Service com AppError

```typescript
import prisma from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/hash.util';
import { CreateUserInput, UpdateUserInput } from '../interfaces/user.interface';

export class UserService {
  async create(data: CreateUserInput) {
    // Verificar se email existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw AppError.conflict('Email já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return user;
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw AppError.notFound('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    // Verificar se usuário existe
    await this.getById(id);

    // Se está atualizando email, verificar se não está em uso
    if (data.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id }
        },
      });

      if (emailExists) {
        throw AppError.conflict('Email já está em uso');
      }
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    // Verificar se existe
    await this.getById(id);

    await prisma.user.delete({ where: { id } });
  }
}
```

## Tratamento de Erros

O error handler global trata automaticamente:

1. **AppError** - Erros da aplicação com status code e mensagem
2. **ZodError** - Erros de validação com detalhes dos campos
3. **Prisma Errors** - Erros do banco (unique constraint, not found, etc)
4. **JWT Errors** - Token inválido ou expirado
5. **Erros Genéricos** - Erro 500 com mensagem apropriada

### Formato de Resposta de Erro

```json
{
  "status": "error",
  "message": "Mensagem do erro",
  "errors": [ // Apenas para erros de validação
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## Checklist de Implementação

Para cada nova rota:

- [ ] Criar schemas Zod (input e response)
- [ ] Adicionar validação de params (se necessário)
- [ ] Adicionar validação de body (para POST/PUT/PATCH)
- [ ] Adicionar validação de query (se necessário)
- [ ] Usar AppError nos services
- [ ] Validar response com .parse() no controller
- [ ] Testar com dados inválidos
- [ ] Testar casos de erro (not found, conflict, etc)
