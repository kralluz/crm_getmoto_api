import { Request, Response } from 'express';
export declare class ProductController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addStockMovement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStockMovements(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=product.controller.d.ts.map