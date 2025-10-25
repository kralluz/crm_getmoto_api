import { z } from 'zod';
import {
  createPaymentSchema,
  updatePaymentSchema,
  PaymentMethodEnum,
  PaymentStatusEnum
} from '../schemas/payment.schema';

// ATENÇÃO: Não existe tabela 'payments' no banco de dados!
// Os pagamentos são registrados através da tabela cash_flow
// Estes types são mantidos apenas para compatibilidade com código legado

// Types inferidos dos schemas Zod
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
