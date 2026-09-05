import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatCurrency } from '../foundations/format';
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

const MODE_LABEL: Record<PriceMode, string> = {
  fixed: 'السعر المحدد لهذه الخدمة',
  from: 'يبدأ من — يعتمد السعر النهائي على الفحص',
  range: 'يتراوح ضمن هذا المدى',
  free: 'بدون رسوم',
  'requires-plan': 'يُحدَّد بعد الفحص',
};

/**
 * Keep one formatted amount + currency abbreviation as an atomic visual run. At narrow widths the
 * surrounding prefix or range half may move to another line, but `45,000 ل.س.` must never split
 * internally. The Bdi still owns the governed LTR isolation for the mixed Arabic/numeric content.
 */
function CurrencyRun({ amount, currency, prefix = '' }: { amount: number; currency: string; prefix?: string }) {
  return (
    <View testID="price-currency-run" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
      <NumericStrong style={{ flexShrink: 0 }}>
        <Bdi>{`${prefix}${formatCurrency(amount, currency)}`}</Bdi>
      </NumericStrong>
    </View>
  );
}

function WrappedPriceLine({ children }: { children: ReactNode }) {
  return (
    <View
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
  if (price.mode === 'free') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
        <Icon name="check-circle" color={color('tone.success.icon')} scale="sm" />
        <NumericStrong>{MODE_LABEL.free}</NumericStrong>
      </View>
    );
  }
  if (price.mode === 'requires-plan') {
    return <Helper>{MODE_LABEL['requires-plan']}</Helper>;
  }

  const amount = price.amount ?? 0;
  const amountMin = price.amount_min ?? amount;
  const amountMax = price.amount_max ?? amountMin;

  return (
    <View style={{ gap: space('stack-xs') }}>
      {price.mode === 'range' ? (
        <WrappedPriceLine>
          <CurrencyRun amount={amountMin} currency={price.currency} />
          <CurrencyRun amount={amountMax} currency={price.currency} prefix="– " />
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
