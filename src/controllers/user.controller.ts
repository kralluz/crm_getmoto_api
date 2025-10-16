import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getAll(_req: Request, res: Response) {
    const users = await userService.getAll();
    return res.json(users);
  }

  async getById(req: Request, res: Response) {
    const user = await userService.getById(req.params.id);
    return res.json(user);
  }

  async update(req: Request, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    return res.json(user);
  }

  async delete(req: Request, res: Response) {
    await userService.delete(req.params.id);
    return res.status(204).send();
  }
}
