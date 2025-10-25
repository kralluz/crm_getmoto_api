import { z } from 'zod';
import {
  createCashFlowSchema,
  updateCashFlowSchema,
  cashFlowResponseSchema
} from '../schemas/cashflow.schema';

// Types inferidos dos schemas Zod
export type CreateCashFlowInput = z.infer<typeof createCashFlowSchema>;
export type UpdateCashFlowInput = z.infer<typeof updateCashFlowSchema>;
export type CashFlowResponse = z.infer<typeof cashFlowResponseSchema>;
