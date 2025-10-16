import { z } from 'zod';
import { createPaymentSchema, updatePaymentSchema } from '../schemas/payment.schema';

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
