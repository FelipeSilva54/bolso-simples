type CurrencyConfig = {
  locale: string;
  code: string;
  decimalSeparator: ',' | '.';
};

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  BRL: { locale: 'pt-BR', code: 'BRL', decimalSeparator: ',' },
  USD: { locale: 'en-US', code: 'USD', decimalSeparator: '.' },
  EUR: { locale: 'de-DE', code: 'EUR', decimalSeparator: ',' },
  GBP: { locale: 'en-GB', code: 'GBP', decimalSeparator: '.' },
  ARS: { locale: 'es-AR', code: 'ARS', decimalSeparator: ',' },
  CLP: { locale: 'es-CL', code: 'CLP', decimalSeparator: ',' },
};

export type SupportedCurrency = {
  code: string;
  symbol: string;
  namePtBR: string;
  nameEn: string;
};

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'BRL', symbol: 'R$', namePtBR: 'Real Brasileiro',  nameEn: 'Brazilian Real'   },
  { code: 'USD', symbol: '$',  namePtBR: 'Dólar Americano',  nameEn: 'US Dollar'        },
  { code: 'EUR', symbol: '€',  namePtBR: 'Euro',             nameEn: 'Euro'             },
  { code: 'GBP', symbol: '£',  namePtBR: 'Libra Esterlina',  nameEn: 'British Pound'    },
  { code: 'ARS', symbol: '$',  namePtBR: 'Peso Argentino',   nameEn: 'Argentine Peso'   },
  { code: 'CLP', symbol: '$',  namePtBR: 'Peso Chileno',     nameEn: 'Chilean Peso'     },
];

export function formatCurrency(value: number, currency: string = 'BRL'): string {
  const config = CURRENCY_MAP[currency] ?? CURRENCY_MAP.BRL;
  return value.toLocaleString(config.locale, {
    style: 'currency',
    currency: config.code,
  });
}

export function parseCurrency(raw: string, currency: string = 'BRL'): number {
  const config = CURRENCY_MAP[currency] ?? CURRENCY_MAP.BRL;
  const cleaned = raw.replace(/[^\d.,]/g, '');

  if (config.decimalSeparator === ',') {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return parseFloat(cleaned.replace(/,/g, '')) || 0;
}
