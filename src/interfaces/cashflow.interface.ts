import { z } from 'zod';
import { createCashFlowSchema, updateCashFlowSchema } from '../schemas/cashflow.schema';

export type CreateCashFlowInput = z.infer<typeof createCashFlowSchema>;
export type UpdateCashFlowInput = z.infer<typeof updateCashFlowSchema>;
