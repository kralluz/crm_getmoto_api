"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const authMiddleware = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw error_middleware_1.AppError.unauthorized('Token não fornecido');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        // O error handler global vai tratar erros JWT
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (...roles) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw error_middleware_1.AppError.unauthorized('Usuário não autenticado');
            }
            if (!roles.includes(req.user.role)) {
                throw error_middleware_1.AppError.forbidden('Sem permissão para acessar este recurso');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map