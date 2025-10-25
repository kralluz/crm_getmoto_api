import { Request, Response } from 'express';
import { ServiceService } from '../services/service.service';

const serviceService = new ServiceService();

export class ServiceController {
  async create(req: Request, res: Response) {
    const service = await serviceService.create(req.body);
    return res.status(201).json(service);
  }

  async getAll(req: Request, res: Response) {
    const { status, customer_name } = req.query;
    const services = await serviceService.getAll(status as string, customer_name as string);
    return res.json(services);
  }

  async getById(req: Request, res: Response) {
    const service = await serviceService.getById(req.params.id);
    return res.json(service);
  }

  async update(req: Request, res: Response) {
    const service = await serviceService.update(req.params.id, req.body);
    return res.json(service);
  }

  async delete(req: Request, res: Response) {
    await serviceService.delete(req.params.id);
    return res.status(204).send();
  }
}
