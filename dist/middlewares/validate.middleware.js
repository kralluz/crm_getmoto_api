"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = exports.validate = exports.uuidParamSchema = void 0;
const zod_1 = require("zod");
// Schema comum para validação de UUID em params
exports.uuidParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('ID deve ser um UUID válido'),
    }),
});
// Middleware de validação que usa o error handler global
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Substitui os valores validados e parseados
            req.body = validated.body || req.body;
            req.query = validated.query || req.query;
            req.params = validated.params || req.params;
            next();
        }
        catch (error) {
            // Passa o erro para o error handler global
            next(error);
        }
    };
};
exports.validate = validate;
// Middleware simplificado para validar apenas o body
const validateBody = (schema) => {
    return async (req, _res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateBody = validateBody;
// Middleware para validar params
const validateParams = (schema) => {
    return async (req, _res, next) => {
        try {
            req.params = (await schema.parseAsync(req.params));
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParams = validateParams;
// Middleware para validar query
const validateQuery = (schema) => {
    return async (req, _res, next) => {
        try {
            req.query = (await schema.parseAsync(req.query));
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validate.middleware.js.map