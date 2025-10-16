"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_schema_1 = require("../schemas/user.schema");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        // Body já foi validado pelo middleware
        const data = req.body;
        const result = await authService.register(data);
        // Valida e sanitiza a resposta
        const validatedResponse = user_schema_1.authResponseSchema.parse(result);
        return res.status(201).json(validatedResponse);
    }
    async login(req, res) {
        // Body já foi validado pelo middleware
        const data = req.body;
        const result = await authService.login(data);
        // Valida e sanitiza a resposta
        const validatedResponse = user_schema_1.authResponseSchema.parse(result);
        return res.status(200).json(validatedResponse);
    }
    async me(req, res) {
        const userId = req.user.userId;
        const result = await authService.me(userId);
        // Valida e sanitiza a resposta
        const validatedResponse = user_schema_1.userResponseSchema.parse(result);
        return res.status(200).json(validatedResponse);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map