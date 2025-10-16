import { z } from 'zod';

export const PaymentMethodEnum = z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'CHECK']);
export const PaymentStatusEnum = z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']);

export const createPaymentSchema = z.object({
  serviceId: z.string().uuid('Service ID inválido'),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  method: PaymentMethodEnum,
  status: PaymentStatusEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  paymentDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePaymentSchema = z.object({
  serviceId: z.string().uuid('Service ID inválido').optional(),
  amount: z.number().min(0, 'Valor deve ser positivo').optional(),
  method: PaymentMethodEnum.optional(),
  status: PaymentStatusEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  paymentDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});
