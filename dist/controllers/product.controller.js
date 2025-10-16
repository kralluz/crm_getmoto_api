"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const productService = new product_service_1.ProductService();
class ProductController {
    async create(req, res) {
        const product = await productService.create(req.body);
        return res.status(201).json(product);
    }
    async getAll(req, res) {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
        const lowStock = req.query.lowStock === 'true';
        const products = await productService.getAll(active, lowStock);
        return res.json(products);
    }
    async getById(req, res) {
        const product = await productService.getById(req.params.id);
        return res.json(product);
    }
    async update(req, res) {
        const product = await productService.update(req.params.id, req.body);
        return res.json(product);
    }
    async delete(req, res) {
        await productService.delete(req.params.id);
        return res.status(204).send();
    }
    async addStockMovement(req, res) {
        const movement = await productService.addStockMovement(req.body);
        return res.status(201).json(movement);
    }
    async getStockMovements(req, res) {
        const { productId, startDate, endDate } = req.query;
        const movements = await productService.getStockMovements(productId, startDate, endDate);
        return res.json(movements);
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map