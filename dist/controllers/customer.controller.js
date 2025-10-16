"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customer_service_1 = require("../services/customer.service");
const customerService = new customer_service_1.CustomerService();
class CustomerController {
    async create(req, res) {
        const customer = await customerService.create(req.body);
        return res.status(201).json(customer);
    }
    async getAll(req, res) {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
        const customers = await customerService.getAll(active);
        return res.json(customers);
    }
    async getById(req, res) {
        const customer = await customerService.getById(req.params.id);
        return res.json(customer);
    }
    async update(req, res) {
        const customer = await customerService.update(req.params.id, req.body);
        return res.json(customer);
    }
    async delete(req, res) {
        await customerService.delete(req.params.id);
        return res.status(204).send();
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=customer.controller.js.map