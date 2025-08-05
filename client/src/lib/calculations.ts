export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

export function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
}

export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/[^\d]/g, '');
  return formatCurrency(parseInt(numericValue) || 0);
}
