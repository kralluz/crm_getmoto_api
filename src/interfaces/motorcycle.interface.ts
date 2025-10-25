import { z } from 'zod';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleResponseSchema
} from '../schemas/motorcycle.schema';

// Types inferidos dos schemas Zod
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;

// Aliases para compatibilidade (motorcycle = vehicle)
export type CreateMotorcycleInput = CreateVehicleInput;
export type UpdateMotorcycleInput = UpdateVehicleInput;
export type MotorcycleResponse = VehicleResponse;
