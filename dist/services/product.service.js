"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
class ProductService {
    async create(data) {
        if (data.code) {
            const codeExists = await prisma_1.default.product.findUnique({ where: { code: data.code } });
            if (codeExists) {
                throw new error_middleware_1.AppError('Código já cadastrado', 400);
            }
        }
        if (data.barcode) {
            const barcodeExists = await prisma_1.default.product.findUnique({ where: { barcode: data.barcode } });
            if (barcodeExists) {
                throw new error_middleware_1.AppError('Código de barras já cadastrado', 400);
            }
        }
        return await prisma_1.default.product.create({ data });
    }
    async getAll(active, lowStock) {
        const where = {};
        if (active !== undefined)
            where.active = active;
        if (lowStock)
            where.stockQuantity = { lte: prisma_1.default.product.fields.minStock };
        return await prisma_1.default.product.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }
    async getById(id) {
        const product = await prisma_1.default.product.findUnique({
            where: { id },
            include: {
                stockMovements: {
                    orderBy: { date: 'desc' },
                    take: 20,
                },
            },
        });
        if (!product) {
            throw new error_middleware_1.AppError('Produto não encontrado', 404);
        }
        return product;
    }
    async update(id, data) {
        await this.getById(id);
        if (data.code) {
            const codeExists = await prisma_1.default.product.findFirst({
                where: { code: data.code, id: { not: id } },
            });
            if (codeExists) {
                throw new error_middleware_1.AppError('Código já está em uso', 400);
            }
        }
        if (data.barcode) {
            const barcodeExists = await prisma_1.default.product.findFirst({
                where: { barcode: data.barcode, id: { not: id } },
            });
            if (barcodeExists) {
                throw new error_middleware_1.AppError('Código de barras já está em uso', 400);
            }
        }
        return await prisma_1.default.product.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.getById(id);
        await prisma_1.default.product.delete({ where: { id } });
    }
    async addStockMovement(data) {
        const product = await this.getById(data.productId);
        let newQuantity = product.stockQuantity;
        if (data.type === 'ENTRY') {
            newQuantity += data.quantity;
        }
        else if (data.type === 'EXIT') {
            if (newQuantity < data.quantity) {
                throw new error_middleware_1.AppError('Quantidade insuficiente em estoque', 400);
            }
            newQuantity -= data.quantity;
        }
        else if (data.type === 'ADJUSTMENT') {
            newQuantity = data.quantity;
        }
        const movement = await prisma_1.default.stockMovement.create({
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
        });
        await prisma_1.default.product.update({
            where: { id: data.productId },
            data: { stockQuantity: newQuantity },
        });
        return movement;
    }
    async getStockMovements(productId, startDate, endDate) {
        const where = {};
        if (productId)
            where.productId = productId;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        return await prisma_1.default.stockMovement.findMany({
            where,
            include: { product: true },
            orderBy: { date: 'desc' },
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map