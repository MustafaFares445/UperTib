/**
 * Arabic-first formatting helpers. TXT-PLATFORM-020 requires Western ASCII digits throughout, so
 * every number/date/time formatter here is pinned to the Latin numbering system even though the
 * surrounding locale is ar-SY.
 */
const LOCALE = 'ar-SY-u-nu-latn';

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** A whole-hour/whole-minute remaining-time statement. Never fabricated: pass a real deadline. */
export function formatRemaining(deadlineIso: string, nowIso = new Date().toISOString()): string {
  const ms = new Date(deadlineIso).getTime() - new Date(nowIso).getTime();
  if (ms <= 0) {
    return 'انتهت المهلة';
  }
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `متبقٍ ${formatNumber(days)} ${days === 1 ? 'يوم' : 'أيام'}`;
  }
  if (hours >= 1) {
    return `متبقٍ ${formatNumber(hours)} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  }
  return `متبقٍ ${formatNumber(Math.max(minutes, 1))} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
}
