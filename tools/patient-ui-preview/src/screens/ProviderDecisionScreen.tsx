import { Pressable, View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { Icon } from '../foundations/Icon';
import { useFocusRing } from '../foundations/useFocusRing';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { borderWidth, color, size, space } from '../theme/tokens';

export interface ProviderDecisionScreenProps {
  option: ProviderOption;
  onBook: () => void;
  onExplainEligibility: () => void;
  onBackToResults: () => void;
}

/**
 * SCR-ELIG-003 — Provider decision card. Gives the patient the full decision card for one
 * provider/service/branch combination so they can commit to it. The patient-safe eligibility
 * explanation lives one navigation away on canonical SCR-ELIG-004 rather than expanding another
 * paragraph on this already decision-heavy screen.
 */
export function ProviderDecisionScreen({
  option,
  onBook,
  onExplainEligibility,
  onBackToResults,
}: ProviderDecisionScreenProps) {
  const bookable = option.eligibility === 'ELIGIBLE';
  const explanationRing = useFocusRing();

  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            {
              key: 'book',
              label: 'حجز هذا الخيار',
              role: 'primary',
              availability: bookable
                ? { status: 'available' }
                : { status: 'absent', reason: 'هذا الخيار لم يعد متاحًا للحجز حاليًا.' },
              onPress: onBook,
            },
            { key: 'back', label: 'رجوع إلى النتائج', role: 'secondary', availability: { status: 'available' }, onPress: onBackToResults },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`${option.serviceLabel} · ${option.areaLabel}`}
          title="راجع الخيار قبل المتابعة"
          description="السعر والموعد والتقييم هنا تخص هذا الطبيب وهذه الخدمة وهذا الفرع فقط."
        />
        <ProviderDecisionCard option={option} variant="card" />

        <View
          style={{
            paddingTop: space('stack-sm'),
            borderTopWidth: borderWidth('hairline'),
            borderTopColor: color('border.subtle'),
          }}
        >
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="لماذا هذا الخيار متاح لهذه الخدمة في هذا الفرع؟"
            onFocus={explanationRing.onFocus}
            onBlur={explanationRing.onBlur}
            onPress={onExplainEligibility}
            style={({ pressed }) => ({
              minHeight: size('target-primary'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space('inline-sm'),
              opacity: pressed ? 0.8 : 1,
              ...explanationRing.ringStyle,
            })}
          >
            <View style={{ flex: 1, gap: space('stack-xs') }}>
              <BodyStrong>لماذا هذا الخيار متاح؟</BodyStrong>
              <Helper>شرح مختصر لحالة الأهلية الحالية، من دون درجات أو تفاصيل داخلية.</Helper>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
              <Icon name="magnifying-glass" color={color('action.primary')} scale="sm" />
              <Body tone="link">عرض الشرح</Body>
            </View>
          </Pressable>
        </View>
      </Stack>
    </Screen>
  );
}
