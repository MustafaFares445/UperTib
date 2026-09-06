import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDate, formatTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Body, BodyStrong, Heading3, Helper, NumericStrong } from '../foundations/Text';
import { borderWidth, chipVisual, color, radius, space } from '../theme/tokens';
import type { ProviderOption } from './ProviderDecisionCard';
import { ProviderIdentity } from './ProviderIdentity';
import { PriceDisplay } from './PriceDisplay';

export type AppointmentObjectMode = 'request' | 'summary' | 'confirmed' | 'proposed';

interface AppointmentObjectProps {
  iso: string;
  option: ProviderOption;
  mode?: AppointmentObjectMode;
  dayLabel?: string;
  showPrice?: boolean;
}

const MODE_COPY: Record<AppointmentObjectMode, { label: string; accent: boolean }> = {
  request: { label: 'الموعد الذي ستطلبه', accent: false },
  summary: { label: 'الموعد المطلوب', accent: false },
  confirmed: { label: 'موعدك المؤكَّد', accent: true },
  proposed: { label: 'الموعد البديل المقترح', accent: true },
};

/** A shared appointment object whose emphasis changes with lifecycle meaning, not its data order. */
export function AppointmentObject({ iso, option, mode = 'summary', dayLabel, showPrice = false }: AppointmentObjectProps) {
  const copy = MODE_COPY[mode];
  const success = chipVisual('success', 'subtle');
  const proposed = chipVisual('info', 'subtle');
  const accent = mode === 'confirmed' ? success : proposed;

  return (
    <View
      accessible
      accessibilityLabel={`${copy.label}، ${dayLabel ?? formatDate(iso)}، ${formatTime(iso)}، ${option.providerName}، ${option.branchName}`}
      style={{
        gap: space('stack-md'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth(copy.accent ? 'emphasis' : 'hairline'),
        borderColor: copy.accent ? accent.border : color('border.subtle'),
        backgroundColor: copy.accent ? accent.background : color('surface.default'),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}>
        <Icon name="calendar-days" color={copy.accent ? accent.icon : color('action.primary')} scale="lg" />
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <Helper style={copy.accent ? { color: accent.text } : undefined}>{copy.label}</Helper>
          <Heading3>{dayLabel ?? formatDate(iso)}</Heading3>
          <NumericStrong><Bdi>{formatTime(iso)}</Bdi></NumericStrong>
        </View>
      </View>
      <ProviderIdentity name={option.providerName} branch={option.branchName} area={option.areaLabel} compact />
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{option.serviceLabel}</BodyStrong>
        {showPrice ? <PriceDisplay price={option.price} compact /> : null}
      </View>
      {mode === 'request' ? <Body tone="secondary">هذا طلب حجز، وليس موعدًا مؤكَّدًا بعد.</Body> : null}
      {mode === 'proposed' ? <Body tone="secondary">لن يصبح هذا الموعد نافذًا إلا بعد قبولك وإعادة التحقق من التوفر.</Body> : null}
    </View>
  );
}
