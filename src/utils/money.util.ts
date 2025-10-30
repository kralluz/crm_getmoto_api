/**
 * Utilitário para trabalhar com valores monetários em centavos
 * Garante precisão matemática e evita problemas de ponto flutuante
 */

export class MoneyUtils {
  /**
   * Converte centavos para valor em reais
   * @param cents - Valor em centavos (4990)
   * @returns Valor em reais (49.90)
   */
  static centsToReais(cents: number): number {
    if (cents === null || cents === undefined) return 0;
    return cents / 100;
  }

  /**
   * Converte reais para centavos
   * @param reais - Valor em reais (49.90)
   * @returns Valor em centavos (4990)
   */
  static reaisToCents(reais: number): number {
    if (reais === null || reais === undefined) return 0;
    return Math.round(reais * 100);
  }

  /**
   * Formatar valor para exibição brasileira
   * @param cents - Valor em centavos
   * @returns String formatada "R$ 49,90"
   */
  static formatCurrency(cents: number): string {
    const reais = this.centsToReais(cents);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(reais);
  }

  /**
   * Somar valores monetários em centavos
   * @param cents1 - Primeiro valor em centavos
   * @param cents2 - Segundo valor em centavos
   * @returns Soma em centavos
   */
  static addMoney(cents1: number, cents2: number): number {
    return (cents1 || 0) + (cents2 || 0);
  }

  /**
   * Subtrair valores monetários em centavos
   * @param cents1 - Valor base em centavos
   * @param cents2 - Valor a subtrair em centavos
   * @returns Diferença em centavos
   */
  static subtractMoney(cents1: number, cents2: number): number {
    return (cents1 || 0) - (cents2 || 0);
  }

  /**
   * Multiplicar valor monetário por quantidade
   * @param cents - Valor unitário em centavos
   * @param quantity - Quantidade (pode ser decimal)
   * @returns Valor total em centavos
   */
  static multiplyMoney(cents: number, quantity: number): number {
    return Math.round((cents || 0) * (quantity || 0));
  }

  /**
   * Dividir valor monetário
   * @param cents - Valor em centavos
   * @param divisor - Divisor
   * @returns Valor dividido em centavos
   */
  static divideMoney(cents: number, divisor: number): number {
    if (divisor === 0) return 0;
    return Math.round((cents || 0) / divisor);
  }

  /**
   * Calcular porcentagem de um valor
   * @param cents - Valor base em centavos
   * @param percentage - Porcentagem (ex: 10 para 10%)
   * @returns Valor da porcentagem em centavos
   */
  static calculatePercentage(cents: number, percentage: number): number {
    return Math.round((cents || 0) * (percentage || 0) / 100);
  }

  /**
   * Aplicar desconto a um valor
   * @param cents - Valor original em centavos
   * @param discountPercentage - Porcentagem de desconto
   * @returns Valor com desconto aplicado em centavos
   */
  static applyDiscount(cents: number, discountPercentage: number): number {
    const discount = this.calculatePercentage(cents, discountPercentage);
    return this.subtractMoney(cents, discount);
  }

  /**
   * Comparar dois valores monetários
   * @param cents1 - Primeiro valor em centavos
   * @param cents2 - Segundo valor em centavos
   * @returns -1 se cents1 < cents2, 0 se iguais, 1 se cents1 > cents2
   */
  static compare(cents1: number, cents2: number): number {
    const val1 = cents1 || 0;
    const val2 = cents2 || 0;
    
    if (val1 < val2) return -1;
    if (val1 > val2) return 1;
    return 0;
  }

  /**
   * Validar se um valor em centavos é válido
   * @param cents - Valor em centavos
   * @returns true se válido
   */
  static isValidCents(cents: number): boolean {
    return Number.isInteger(cents) && cents >= 0;
  }

  /**
   * Converter Decimal do Prisma para centavos
   * @param decimal - Objeto Decimal do Prisma
   * @returns Valor em centavos
   */
  static decimalToCents(decimal: any): number {
    if (!decimal) return 0;
    
    // Se já é um número
    if (typeof decimal === 'number') {
      return this.reaisToCents(decimal);
    }
    
    // Se é string
    if (typeof decimal === 'string') {
      return this.reaisToCents(parseFloat(decimal));
    }
    
    // Se é objeto Decimal do Prisma
    if (decimal && typeof decimal.toString === 'function') {
      return this.reaisToCents(parseFloat(decimal.toString()));
    }
    
    return 0;
  }

  /**
   * Criar objeto para ser usado em operações do Prisma
   * @param cents - Valor em centavos
   * @returns Valor em reais para usar no Prisma
   */
  static centsToDecimal(cents: number): number {
    return this.centsToReais(cents);
  }
}