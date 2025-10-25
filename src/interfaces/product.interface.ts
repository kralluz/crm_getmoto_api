import { z } from 'zod';
import {
  createProductSchema,
  updateProductSchema,
  createStockMovementSchema,
  createProductCategorySchema,
  updateProductCategorySchema,
  productResponseSchema,
  productCategoryResponseSchema,
  stockMovementResponseSchema
} from '../schemas/product.schema';

// Types inferidos dos schemas Zod
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
export type CreateStockMoveInput = z.infer<typeof createStockMovementSchema>; // Alias
export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductCategoryResponse = z.infer<typeof productCategoryResponseSchema>;
export type StockMovementResponse = z.infer<typeof stockMovementResponseSchema>;
