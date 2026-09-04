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
 * CMP-ELIG-002 — Price display. The provider's own recorded price in its governed mode. The mode
 * is part of the anatomy, not an appended qualifier: a starting point reads as a starting point,
 * a range as a range, a free price as genuinely free — never a market/city average or a tariff.
 */
export function PriceDisplay({ price }: { price: PriceFact }) {
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

  const amountText =
    price.mode === 'range'
      ? `${formatCurrency(price.amount_min ?? 0, price.currency)} – ${formatCurrency(price.amount_max ?? 0, price.currency)}`
      : price.mode === 'from'
        ? `يبدأ من ${formatCurrency(price.amount_min ?? price.amount ?? 0, price.currency)}`
        : formatCurrency(price.amount ?? 0, price.currency);

  return (
    <View style={{ gap: space('stack-xs') }}>
      <NumericStrong>
        <Bdi>{amountText}</Bdi>
      </NumericStrong>
      <Helper>{MODE_LABEL[price.mode]}</Helper>
    </View>
  );
}
