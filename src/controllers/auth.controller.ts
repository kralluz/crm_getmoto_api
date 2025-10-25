import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { authResponseSchema, userResponseSchema } from '../schemas/user.schema';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    // Body já foi validado pelo middleware
    const data = req.body;

    const result = await authService.register(data);

    // Valida e sanitiza a resposta
    const validatedResponse = authResponseSchema.parse(result);

    return res.status(201).json(validatedResponse);
  }

  async login(req: Request, res: Response) {
    // Body já foi validado pelo middleware
    const data = req.body;

    const result = await authService.login(data);

    // Valida e sanitiza a resposta
    const validatedResponse = authResponseSchema.parse(result);

    return res.status(200).json(validatedResponse);
  }

  async me(req: Request, res: Response) {
    const userId = req.user!.userId;

    const result = await authService.me(userId);

    // Valida e sanitiza a resposta
    const validatedResponse = userResponseSchema.parse(result);

    return res.status(200).json(validatedResponse);
  }
}
