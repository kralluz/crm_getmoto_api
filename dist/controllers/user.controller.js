"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    async getAll(_req, res) {
        const users = await userService.getAll();
        return res.json(users);
    }
    async getById(req, res) {
        const user = await userService.getById(req.params.id);
        return res.json(user);
    }
    async update(req, res) {
        const user = await userService.update(req.params.id, req.body);
        return res.json(user);
    }
    async delete(req, res) {
        await userService.delete(req.params.id);
        return res.status(204).send();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map