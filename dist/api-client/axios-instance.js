"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customAxiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
// Configuração customizada da instância do Axios
const axiosInstance = axios_1.default.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para adicionar o token de autenticação
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage?.getItem('auth_token') || process.env.API_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Interceptor para tratamento de erros
axiosInstance.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        // Erros de resposta da API
        console.error('API Error:', error.response.status, error.response.data);
        // Se for 401 (não autorizado), você pode fazer logout ou refresh do token aqui
        if (error.response.status === 401) {
            // Exemplo: window.location.href = '/login';
        }
    }
    else if (error.request) {
        // Erro de requisição (sem resposta)
        console.error('Network Error:', error.request);
    }
    else {
        // Outro tipo de erro
        console.error('Error:', error.message);
    }
    return Promise.reject(error);
});
// Função customizada para ser usada pelo Orval
const customAxiosInstance = (config) => {
    const source = axios_1.default.CancelToken.source();
    const promise = axiosInstance({
        ...config,
        cancelToken: source.token,
    }).then(({ data }) => data);
    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };
    return promise;
};
exports.customAxiosInstance = customAxiosInstance;
exports.default = axiosInstance;
//# sourceMappingURL=axios-instance.js.map