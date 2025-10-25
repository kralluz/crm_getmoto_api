import { z } from 'zod';
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
  createServiceOrderSchema,
  updateServiceOrderSchema,
  createServiceProductSchema,
  createServiceRealizedSchema,
  serviceCategoryResponseSchema,
  serviceOrderResponseSchema,
  serviceProductResponseSchema,
  serviceRealizedResponseSchema
} from '../schemas/service.schema';

// Types inferidos dos schemas Zod
export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;
export type UpdateServiceOrderInput = z.infer<typeof updateServiceOrderSchema>;
export type CreateServiceProductInput = z.infer<typeof createServiceProductSchema>;
export type CreateServiceRealizedInput = z.infer<typeof createServiceRealizedSchema>;
export type ServiceCategoryResponse = z.infer<typeof serviceCategoryResponseSchema>;
export type ServiceOrderResponse = z.infer<typeof serviceOrderResponseSchema>;
export type ServiceProductResponse = z.infer<typeof serviceProductResponseSchema>;
export type ServiceRealizedResponse = z.infer<typeof serviceRealizedResponseSchema>;

// Types adicionais para operações de ordem de serviço
export interface AddServiceToOrderInput {
  service_order_id: bigint | number;
  service_category_id: bigint | number;
  service_qtd: number;
}

export interface AddProductToOrderInput {
  service_order_id: bigint | number;
  product_id: bigint | number;
  product_qtd: number;
}
