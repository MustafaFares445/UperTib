import { View } from 'react-native';
import { PriceDisplay } from './PriceDisplay';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import { formatNumber } from '../foundations/format';
import type { TreatmentLineProjection } from '../mocks/clinical';
import { borderWidth, color, radius, space } from '../theme/tokens';

/** CMP-CLINICAL-001 `review` — patient-facing treatment line. Read-only, plain language first. */
export function TreatmentLine({ line, currency }: { line: TreatmentLineProjection; currency: string }) {
  const quantity = `${formatNumber(line.quantity)} ${line.unit}`;
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${line.title}. ${line.plainMeaning}. الكمية ${quantity}. القيمة ${line.lineAmount} ${currency}.`}
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <Heading4>{line.title}</Heading4>
        <Body tone="secondary">{line.plainMeaning}</Body>
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <Helper>الكمية</Helper>
        <BodyStrong>{quantity}</BodyStrong>
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <Helper>{line.quantity === 1 ? 'قيمة البند' : 'قيمة الوحدة'}</Helper>
        <PriceDisplay price={{ mode: 'fixed', amount: line.quantity === 1 ? line.lineAmount : line.unitAmount, currency }} compact />
        {line.quantity > 1 ? (
          <View style={{ gap: space('stack-xs') }}>
            <Helper>إجمالي البند</Helper>
            <PriceDisplay price={{ mode: 'fixed', amount: line.lineAmount, currency }} compact />
          </View>
        ) : null}
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <Helper>يشمل</Helper>
        {line.includes.map((item) => (
          <Body key={item}>• {item}</Body>
        ))}
      </View>

      {line.excludes?.length ? (
        <View style={{ gap: space('stack-xs') }}>
          <Helper>لا يشمل</Helper>
          {line.excludes.map((item) => (
            <Body key={item} tone="secondary">• {item}</Body>
          ))}
        </View>
      ) : null}

      {line.modifier ? (
        <View
          style={{
            gap: space('stack-xs'),
            paddingTop: space('stack-sm'),
            borderTopWidth: borderWidth('hairline'),
            borderTopColor: color('border.subtle'),
          }}
        >
          <BodyStrong>{line.modifier.categoryLabel}</BodyStrong>
          <Body tone="secondary">{line.modifier.reason}</Body>
        </View>
      ) : null}
    </View>
  );
}
