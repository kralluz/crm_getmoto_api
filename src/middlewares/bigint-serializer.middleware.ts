import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para converter BigInt em Number antes de serializar para JSON
 * Isso resolve o erro "Do not know how to serialize a BigInt"
 */

// Sobrescrever JSON.stringify globalmente para lidar com BigInt
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

/**
 * Função recursiva para converter BigInt e Decimal em Number em objetos
 */
function convertBigIntToNumber(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return Number(obj);
  }

  // Converter Prisma Decimal para Number
  // Verifica se é um objeto Decimal do Prisma (decimal.js)
  if (obj && typeof obj === 'object') {
    // Verifica se tem as propriedades características do Decimal (s, e, d)
    if (typeof obj.s === 'number' && typeof obj.e === 'number' && Array.isArray(obj.d)) {
      return Number(obj.toString());
    }
    
    // Também verifica pelo construtor como fallback
    if (obj.constructor && (obj.constructor.name === 'Decimal' || obj.constructor.name === 'Big')) {
      return Number(obj.toString());
    }
  }

  // Converter Date para ISO string
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        converted[key] = convertBigIntToNumber(obj[key]);
      }
    }
    return converted;
  }

  return obj;
}

/**
 * Middleware que intercepta as respostas e converte BigInt para Number
 */
export function bigIntSerializer(_req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (data: any) {
    // Converter BigInt para Number antes de enviar
    const convertedData = convertBigIntToNumber(data);
    return originalJson.call(this, convertedData);
  };

  next();
}
