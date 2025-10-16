import { z } from 'zod';

export const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);

export const createCashFlowSchema = z.object({
  paymentId: z.string().uuid('Payment ID inválido').optional().nullable(),
  userId: z.string().uuid('User ID inválido'),
  type: TransactionTypeEnum,
  category: z.string().min(3, 'Categoria deve ter no mínimo 3 caracteres'),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  date: z.string().datetime().optional(),
});

export const updateCashFlowSchema = z.object({
  paymentId: z.string().uuid('Payment ID inválido').optional().nullable(),
  userId: z.string().uuid('User ID inválido').optional(),
  type: TransactionTypeEnum.optional(),
  category: z.string().min(3, 'Categoria deve ter no mínimo 3 caracteres').optional(),
  amount: z.number().min(0, 'Valor deve ser positivo').optional(),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').optional(),
  date: z.string().datetime().optional(),
});
