import { z } from 'zod';

// ATENÇÃO: Não existe tabela 'payments' no banco de dados!
// Os enums estão definidos no Prisma mas não há tabela correspondente
// Os pagamentos são registrados através da tabela cash_flow
// Este schema está mantido para referência dos enums, mas não deve ser usado para operações de banco

// Enums definidos no Prisma (mantidos para referência)
export const PaymentMethodEnum = z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'CHECK']);

// Schemas abaixo são apenas para compatibilidade - NÃO usar
export const createPaymentSchema = z.object({
  serviceId: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço deve ser positivo')),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  method: PaymentMethodEnum,
  dueDate: z.string().datetime().optional().nullable(),
  paymentDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePaymentSchema = z.object({
  serviceId: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço deve ser positivo')).optional(),
  amount: z.number().min(0, 'Valor deve ser positivo').optional(),
  method: PaymentMethodEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  paymentDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});
