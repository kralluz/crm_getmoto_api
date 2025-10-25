import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    const product = await productService.create(req.body);
    return res.status(201).json(product);
  }

  async getAll(req: Request, res: Response) {
    const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
    const lowStock = req.query.lowStock === 'true';
    const products = await productService.getAll(active, lowStock);
    return res.json(products);
  }

  async getById(req: Request, res: Response) {
    const product = await productService.getById(Number(req.params.id));
    return res.json(product);
  }

  async update(req: Request, res: Response) {
    const product = await productService.update(Number(req.params.id), req.body);
    return res.json(product);
  }

  async delete(req: Request, res: Response) {
    await productService.delete(Number(req.params.id));
    return res.status(204).send();
  }

  async addStockMovement(req: Request, res: Response) {
    const movement = await productService.addStockMove(req.body);
    return res.status(201).json(movement);
  }

  async getStockMovements(req: Request, res: Response) {
    const { productId, startDate, endDate } = req.query;
    const movements = await productService.getStockMoves(
      productId ? Number(productId) : undefined,
      startDate as string,
      endDate as string
    );
    return res.json(movements);
  }
}
