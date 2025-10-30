import { z } from 'zod';

// Baseado na tabela cash_flow do Prisma
// model CashFlow {
//   cash_flow_id        BigInt
//   service_order_id    BigInt?
//   service_realized_id BigInt?
//   service_product_id  BigInt?
//   amount              Decimal @db.Decimal(12, 2)
//   direction           String  (entrada/saída)
//   occurred_at         DateTime
//   note                String?
//   is_active           Boolean
//   created_at          DateTime
//   updated_at          DateTime
// }

export const CashFlowDirectionEnum = z.enum(['entrada', 'saida']);

export const createCashFlowSchema = z.object({
  service_order_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da ordem deve ser positivo')).optional().nullable(),
  service_realized_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço realizado deve ser positivo')).optional().nullable(),
  service_product_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do produto de serviço deve ser positivo')).optional().nullable(),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'), // Recebe em reais na API
  direction: CashFlowDirectionEnum, // ck_cash_flow_direction IN ('entrada', 'saida')
  occurred_at: z.coerce.date().optional(),
  note: z.string().max(500, 'Nota muito longa').optional().nullable(),
  is_active: z.boolean().default(true),
});

export const updateCashFlowSchema = z.object({
  service_order_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID da ordem deve ser positivo')).optional().nullable(),
  service_realized_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do serviço realizado deve ser positivo')).optional().nullable(),
  service_product_id: z.coerce.bigint().or(z.coerce.number().int().positive('ID do produto de serviço deve ser positivo')).optional().nullable(),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero').optional(), // ck_cash_flow_amount > 0
  direction: CashFlowDirectionEnum.optional(), // ck_cash_flow_direction IN ('entrada', 'saida')
  occurred_at: z.coerce.date().optional(),
  note: z.string().max(500, 'Nota muito longa').optional().nullable(),
  is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Response schema
export const cashFlowResponseSchema = z.object({
  cash_flow_id: z.bigint().or(z.number()),
  service_order_id: z.bigint().or(z.number()).nullable(),
  service_realized_id: z.bigint().or(z.number()).nullable(),
  service_product_id: z.bigint().or(z.number()).nullable(),
  amount: z.number(),
  direction: CashFlowDirectionEnum,
  occurred_at: z.date().or(z.string()),
  note: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// Types
export type CreateCashFlowInput = z.infer<typeof createCashFlowSchema>;
export type UpdateCashFlowInput = z.infer<typeof updateCashFlowSchema>;
export type CashFlowResponse = z.infer<typeof cashFlowResponseSchema>;
