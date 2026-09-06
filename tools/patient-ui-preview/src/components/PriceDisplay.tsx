import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatCurrency, formatNumber } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Helper, NumericStrong } from '../foundations/Text';
import { color, space } from '../theme/tokens';

export type PriceMode = 'fixed' | 'from' | 'range' | 'free' | 'requires-plan';

export interface PriceFact {
  mode: PriceMode;
  amount?: number;
  amount_min?: number;
  amount_max?: number;
  currency: string;
}

/** The caption under the value. Every mode has one, so no mode reads as missing data. */
const MODE_LABEL: Record<PriceMode, string> = {
  fixed: 'السعر المحدد لهذه الخدمة',
  from: 'السعر النهائي يعتمد على الفحص',
  range: 'يتراوح ضمن هذا المدى',
  free: 'بدون رسوم',
  'requires-plan': 'يُحدَّد بعد الفحص',
};

/** Captions for the two modes whose value line is itself a statement rather than an amount. */
const MODE_CAPTION: Record<'free' | 'requires-plan', string> = {
  free: 'لا توجد رسوم لهذه الخدمة',
  'requires-plan': 'يحدد الطبيب السعر بعد فحص الحالة',
};

/**
 * Keep one formatted amount + currency abbreviation as an atomic visual run. At narrow widths the
 * surrounding prefix or range half may move to another line, but `45,000 ل.س.` must never split
 * internally. The Bdi still owns the governed LTR isolation for the mixed Arabic/numeric content.
 *
 * Nothing may be concatenated into this run. `formatCurrency` emits an RTL-marked string
 * (`‏45,000 ل.س.‏`), so prepending a neutral character such as an en dash hands that
 * character to bidi resolution inside the isolate and it resolves to the far edge of the RTL row —
 * visually orphaning it from both amounts. Anything that must sit *between* amounts is a sibling
 * flex item, so RTL layout order alone decides where it lands.
 */
function CurrencyRun({
  amount,
  currency,
  showCurrency = true,
}: {
  amount: number;
  currency: string;
  /** A range states its currency once, on the upper bound, the way ranges are normally written. */
  showCurrency?: boolean;
}) {
  return (
    <View testID="price-currency-run" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
      <NumericStrong style={{ flexShrink: 0 }}>
        <Bdi>{showCurrency ? formatCurrency(amount, currency) : formatNumber(amount)}</Bdi>
      </NumericStrong>
    </View>
  );
}

function WrappedPriceLine({ children, accessibilityLabel }: { children: ReactNode; accessibilityLabel?: string }) {
  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: space('inline-xs'),
      }}
    >
      {children}
    </View>
  );
}

/**
 * CMP-ELIG-002 — Price display. The provider's own recorded price in its governed mode. The mode
 * is part of the anatomy, not an appended qualifier: a starting point reads as a starting point,
 * a range as a range, a free price as genuinely free — never a market/city average or a tariff.
 */
export function PriceDisplay({ price, compact = false }: { price: PriceFact; compact?: boolean }) {
  if (price.mode === 'free' || price.mode === 'requires-plan') {
    const isFree = price.mode === 'free';
    return (
      <View style={{ gap: space('stack-xs') }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
          <Icon
            name={isFree ? 'check-circle' : 'document-text'}
            color={isFree ? color('tone.success.icon') : color('text.secondary')}
            scale="sm"
          />
          <NumericStrong>{isFree ? MODE_LABEL.free : MODE_LABEL['requires-plan']}</NumericStrong>
        </View>
        {!compact ? <Helper>{isFree ? MODE_CAPTION.free : MODE_CAPTION['requires-plan']}</Helper> : null}
      </View>
    );
  }

  const amount = price.amount ?? 0;
  const amountMin = price.amount_min ?? amount;
  const amountMax = price.amount_max ?? amountMin;

  return (
    <View style={{ gap: space('stack-xs') }}>
      {price.mode === 'range' ? (
        // The dash carries the "to" relation visually only, so the row announces the range in
        // words instead of leaving assistive technology to interpret a bare separator.
        <WrappedPriceLine
          accessibilityLabel={`من ${formatCurrency(amountMin, price.currency)} إلى ${formatCurrency(amountMax, price.currency)}`}
        >
          {/*
            `40,000 – 80,000 ل.س.` — the currency is stated once. Repeating it on both halves made
            the run too wide for a card's price cell, so it wrapped and left the dash at the end of
            line one, abutting the adjacent attribute tile. The separator still travels with the
            lower amount so that a wrap can never strand it on a line of its own.
          */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', flexShrink: 0, gap: space('inline-xs') }}>
            <CurrencyRun amount={amountMin} currency={price.currency} showCurrency={false} />
            <NumericStrong style={{ flexShrink: 0 }}>–</NumericStrong>
          </View>
          <CurrencyRun amount={amountMax} currency={price.currency} />
        </WrappedPriceLine>
      ) : price.mode === 'from' ? (
        <WrappedPriceLine>
          <NumericStrong style={{ flexShrink: 0 }}>يبدأ من</NumericStrong>
          <CurrencyRun amount={amountMin} currency={price.currency} />
        </WrappedPriceLine>
      ) : (
        <CurrencyRun amount={amount} currency={price.currency} />
      )}
      {!compact ? <Helper>{MODE_LABEL[price.mode]}</Helper> : null}
    </View>
  );
}
