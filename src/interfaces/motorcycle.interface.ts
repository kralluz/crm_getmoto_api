import { z } from 'zod';
import { createMotorcycleSchema, updateMotorcycleSchema } from '../schemas/motorcycle.schema';

export type CreateMotorcycleInput = z.infer<typeof createMotorcycleSchema>;
export type UpdateMotorcycleInput = z.infer<typeof updateMotorcycleSchema>;
