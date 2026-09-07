import { View } from 'react-native';
import { PriceDisplay } from './PriceDisplay';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import type { AmendmentProjection } from '../mocks/clinical';
import { borderWidth, color, radius, space } from '../theme/tokens';

/** CMP-CLINICAL-002 `amendment` — the prior accepted version stays first and the change is never hidden before acceptance. */
export function AmendmentDelta({ amendment, currency }: { amendment: AmendmentProjection; currency: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`تغييرات الخطة. كما كانت ${amendment.priorVersionLabel} بقيمة ${amendment.priorTotal} ${currency}. كما هي ${amendment.currentVersionLabel} بقيمة ${amendment.currentTotal} ${currency}. ${amendment.summary}`}
      style={{
        gap: space('stack-md'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('tone.info.border'),
        backgroundColor: color('tone.info.fill'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <Heading4>ما الذي تغيّر؟</Heading4>
        <Body>{amendment.summary}</Body>
      </View>

      <View style={{ gap: space('stack-sm') }}>
        <View style={{ gap: space('stack-xs') }}>
          <Helper>كما كانت — {amendment.priorVersionLabel}</Helper>
          <PriceDisplay price={{ mode: 'fixed', amount: amendment.priorTotal, currency }} compact />
        </View>
        <View style={{ gap: space('stack-xs') }}>
          <Helper>كما هي — {amendment.currentVersionLabel}</Helper>
          <PriceDisplay price={{ mode: 'fixed', amount: amendment.currentTotal, currency }} compact />
        </View>
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>التغييرات المسجّلة</BodyStrong>
        {amendment.changedLines.map((change) => (
          <Body key={change}>• {change}</Body>
        ))}
      </View>
      <Helper>النسخة المقبولة سابقًا تبقى محفوظة كسجل تاريخي، ولا تُستبدل إلا بعد قبول النسخة الجديدة.</Helper>
    </View>
  );
}
