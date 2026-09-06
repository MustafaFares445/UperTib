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
  return new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' })
    .format(new Date(iso))
    .replace(/ (?=[صم]$)/u, '\u00a0');
}

export function formatDateTime(iso: string): string {
  // The separator binds to the date with a no-break space. With ordinary spaces on both sides the
  // middot becomes its own wrap opportunity and strands alone at the end of a line, detached from
  // both operands — which reads as a rendering fault and briefly unbinds the time from its date.
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/**
 * Arabic counted nouns do not have a single plural form. The number decides the form of the noun:
 * 1 singular, 2 dual, 3-10 plural, 11-99 singular accusative (tamyīz), 100+ singular. Using one
 * "plural" string for every count produces `19 ساعات` where Arabic requires `19 ساعة`, which reads
 * as machine translation — and it is intermittent, correct at 7 and wrong at 19, which is worse
 * than being consistently wrong.
 *
 * `one` and `two` are returned without a numeral, because Arabic states them with the noun form
 * itself (`ساعة واحدة`, `ساعتان`) rather than with a digit.
 */
export interface ArabicCountForms {
  /** Count of exactly 1, numeral included in the string if it should appear at all. */
  one: string;
  /** Count of exactly 2 (dual). */
  two: string;
  /** Counts 3-10, combined with the numeral. */
  few: string;
  /** Counts 11+ (singular accusative), combined with the numeral. */
  many: string;
}

export function formatArabicCount(count: number, forms: ArabicCountForms): string {
  if (count === 1) {
    return forms.one;
  }
  if (count === 2) {
    return forms.two;
  }
  const withinHundred = count % 100;
  if (withinHundred >= 3 && withinHundred <= 10) {
    return `${formatNumber(count)} ${forms.few}`;
  }
  return `${formatNumber(count)} ${forms.many}`;
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
    return `متبقٍ ${formatArabicCount(days, { one: 'يوم واحد', two: 'يومان', few: 'أيام', many: 'يومًا' })}`;
  }
  if (hours >= 1) {
    return `متبقٍ ${formatArabicCount(hours, { one: 'ساعة واحدة', two: 'ساعتان', few: 'ساعات', many: 'ساعة' })}`;
  }
  return `متبقٍ ${formatArabicCount(Math.max(minutes, 1), { one: 'دقيقة واحدة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة' })}`;
}
