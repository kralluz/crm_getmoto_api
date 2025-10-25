import { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service';

const cashFlowService = new CashFlowService();

export class CashFlowController {
  async create(req: Request, res: Response) {
    const cashFlow = await cashFlowService.create(req.body);
    return res.status(201).json(cashFlow);
  }

  async getAll(req: Request, res: Response) {
    const { direction, startDate, endDate } = req.query;
    const cashFlows = await cashFlowService.getAll(
      direction as string,
      startDate as string,
      endDate as string
    );
    return res.json(cashFlows);
  }

  async getById(req: Request, res: Response) {
    const cashFlow = await cashFlowService.getById(req.params.id);
    return res.json(cashFlow);
  }

  async update(req: Request, res: Response) {
    const cashFlow = await cashFlowService.update(req.params.id, req.body);
    return res.json(cashFlow);
  }

  async delete(req: Request, res: Response) {
    await cashFlowService.delete(req.params.id);
    return res.status(204).send();
  }

  async getSummary(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const summary = await cashFlowService.getSummary(
      startDate as string,
      endDate as string
    );
    return res.json(summary);
  }

  async getCategorySummary(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const summary = await cashFlowService.getCategorySummary(
      startDate as string,
      endDate as string
    );
    return res.json(summary);
  }
}
