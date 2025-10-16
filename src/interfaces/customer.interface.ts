import { z } from 'zod';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer.schema';

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
