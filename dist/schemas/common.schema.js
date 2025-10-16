"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampsSchema = exports.errorResponseSchema = exports.successResponseSchema = exports.paginationSchema = exports.idParamSchema = exports.uuidSchema = void 0;
const zod_1 = require("zod");
// Schema comum para UUID em params
exports.uuidSchema = zod_1.z.string().uuid('ID deve ser um UUID válido');
exports.idParamSchema = zod_1.z.object({
    id: exports.uuidSchema,
});
// Schema de paginação
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
// Schema de resposta de sucesso genérico
exports.successResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('success'),
    data: zod_1.z.any(),
});
// Schema de resposta de erro
exports.errorResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('error'),
    message: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        message: zod_1.z.string(),
    })).optional(),
});
// Schema base de timestamps
exports.timestampsSchema = zod_1.z.object({
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
//# sourceMappingURL=common.schema.js.map