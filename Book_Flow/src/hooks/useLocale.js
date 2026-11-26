import { useMemo } from 'react';

/* Hook de internacionalización (i18n) usando Intl nativo.
   Detecta el idioma/región del navegador (navigator.language) y provee formateadores. */
export function useLocale() {
  const locale = useMemo(() => navigator.language || 'es-ES', []);

  const formatDate = useMemo(() => (iso, options = {}) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...options,
      });
    } catch {
      return iso;
    }
  }, [locale]);

  const formatDateTime = useMemo(() => (iso, options = {}) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      });
    } catch {
      return iso;
    }
  }, [locale]);

  const formatNumber = useMemo(() => (value, options = {}) => {
    if (value === null || value === undefined) return '—';
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch {
      return String(value);
    }
  }, [locale]);

  const formatCurrency = useMemo(() => (value, currency = 'EUR', options = {}) => {
    if (value === null || value === undefined) return '—';
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency, ...options }).format(value);
    } catch {
      return `${value} ${currency}`;
    }
  }, [locale]);

  const formatRating = useMemo(() => (value, maxDecimals = 1) => {
    if (value === null || value === undefined) return '—';
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
      }).format(value);
    } catch {
      return String(value);
    }
  }, [locale]);

  return { locale, formatDate, formatDateTime, formatNumber, formatCurrency, formatRating };
}