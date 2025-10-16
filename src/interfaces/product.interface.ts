import { z } from 'zod';
import { createProductSchema, updateProductSchema, createStockMovementSchema } from '../schemas/product.schema';

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
