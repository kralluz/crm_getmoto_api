import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../interfaces/user.interface';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare const authMiddleware: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map