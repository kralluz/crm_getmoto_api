"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowController = void 0;
const cashflow_service_1 = require("../services/cashflow.service");
const cashFlowService = new cashflow_service_1.CashFlowService();
class CashFlowController {
    async create(req, res) {
        const cashFlow = await cashFlowService.create(req.body);
        return res.status(201).json(cashFlow);
    }
    async getAll(req, res) {
        const { type, startDate, endDate, category } = req.query;
        const cashFlows = await cashFlowService.getAll(type, startDate, endDate, category);
        return res.json(cashFlows);
    }
    async getById(req, res) {
        const cashFlow = await cashFlowService.getById(req.params.id);
        return res.json(cashFlow);
    }
    async update(req, res) {
        const cashFlow = await cashFlowService.update(req.params.id, req.body);
        return res.json(cashFlow);
    }
    async delete(req, res) {
        await cashFlowService.delete(req.params.id);
        return res.status(204).send();
    }
    async getSummary(req, res) {
        const { startDate, endDate } = req.query;
        const summary = await cashFlowService.getSummary(startDate, endDate);
        return res.json(summary);
    }
    async getCategorySummary(req, res) {
        const { startDate, endDate } = req.query;
        const summary = await cashFlowService.getCategorySummary(startDate, endDate);
        return res.json(summary);
    }
}
exports.CashFlowController = CashFlowController;
//# sourceMappingURL=cashflow.controller.js.map