import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw AppError.unauthorized('Token não fornecido');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    // O error handler global vai tratar erros JWT
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Usuário não autenticado');
      }

      if (!roles.includes(req.user.role)) {
        throw AppError.forbidden('Sem permissão para acessar este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
