import rateLimit from 'express-rate-limit';

// Rate limiter geral para a API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter específico para login (proteção contra brute force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas de login
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
});

// Rate limiter para criação de recursos (registro, etc)
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Limite de 3 contas por IP por hora
  message: 'Muitas tentativas de criação de conta. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
