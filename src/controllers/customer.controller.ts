import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';

const customerService = new CustomerService();

export class CustomerController {
  async create(req: Request, res: Response) {
    const customer = await customerService.create(req.body);
    return res.status(201).json(customer);
  }

  async getAll(req: Request, res: Response) {
    const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
    const customers = await customerService.getAll(active);
    return res.json(customers);
  }

  async getById(req: Request, res: Response) {
    const customer = await customerService.getById(req.params.id);
    return res.json(customer);
  }

  async update(req: Request, res: Response) {
    const customer = await customerService.update(req.params.id, req.body);
    return res.json(customer);
  }

  async delete(req: Request, res: Response) {
    await customerService.delete(req.params.id);
    return res.status(204).send();
  }
}
