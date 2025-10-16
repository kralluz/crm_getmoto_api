import { z } from 'zod';
import { createServiceSchema, updateServiceSchema, createServiceItemSchema } from '../schemas/service.schema';
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateServiceItemInput = z.infer<typeof createServiceItemSchema>;
//# sourceMappingURL=service.interface.d.ts.map