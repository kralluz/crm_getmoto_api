"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const service_service_1 = require("../services/service.service");
const serviceService = new service_service_1.ServiceService();
class ServiceController {
    async create(req, res) {
        const service = await serviceService.create(req.body);
        return res.status(201).json(service);
    }
    async getAll(req, res) {
        const { status, customerId } = req.query;
        const services = await serviceService.getAll(status, customerId);
        return res.json(services);
    }
    async getById(req, res) {
        const service = await serviceService.getById(req.params.id);
        return res.json(service);
    }
    async update(req, res) {
        const service = await serviceService.update(req.params.id, req.body);
        return res.json(service);
    }
    async delete(req, res) {
        await serviceService.delete(req.params.id);
        return res.status(204).send();
    }
}
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map