import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { Icon } from '../foundations/Icon';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export interface ProviderDecisionScreenProps {
  option: ProviderOption;
  onBook: () => void;
  onBackToResults: () => void;
}

const ELIGIBILITY_MEANING: Record<ProviderOption['eligibility'], string> = {
  PENDING_EVALUATION: 'هذا الخيار قيد التقييم حاليًا؛ لا حاجة لاتخاذ أي إجراء إضافي ما لم يُطلب منك ذلك صراحة.',
  ELIGIBLE: 'هذا الخيار متاح للحجز حاليًا.',
  SUSPENDED: 'هذا الخيار غير متاح للحجز حاليًا.',
  NOT_ELIGIBLE: 'هذا الخيار غير متاح للحجز حاليًا؛ يمكن اختيار خيار آخر.',
};

/**
 * SCR-ELIG-003 — Provider decision card. Gives the patient the full decision card for one
 * provider/service/branch combination so they can commit to it. The eligibility explanation is
 * composed inline here (WGT-ELIG-002's controlling-reason content) rather than a separate screen —
 * see the Slice 1 traceability notes for why SCR-ELIG-004/005 were deferred beyond this slice.
 */
export function ProviderDecisionScreen({ option, onBook, onBackToResults }: ProviderDecisionScreenProps) {
  const [showWhy, setShowWhy] = useState(false);
  const bookable = option.eligibility === 'ELIGIBLE';

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
        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: showWhy }}
            accessibilityLabel={showWhy ? 'إخفاء معنى حالة التوفر' : 'عرض معنى حالة التوفر'}
            onPress={() => setShowWhy((value) => !value)}
            style={({ pressed }) => ({
              minHeight: size('target-primary'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space('inline-sm'),
              paddingVertical: space('inset-sm'),
              borderTopWidth: borderWidth('hairline'),
              borderBottomWidth: borderWidth('hairline'),
              borderColor: color('border.subtle'),
              backgroundColor: pressed ? color('action.secondary-hover') : 'transparent',
            })}
          >
            <BodyStrong>ما معنى حالة التوفر؟</BodyStrong>
            <Icon name={showWhy ? 'minus-circle' : 'plus-circle'} color={color('text.secondary')} />
          </Pressable>
          {showWhy ? (
            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-sm'),
                borderBottomLeftRadius: radius('surface'),
                borderBottomRightRadius: radius('surface'),
                backgroundColor: color('surface.subtle'),
              }}
            >
              <Body>{ELIGIBILITY_MEANING[option.eligibility]}</Body>
              <Helper>تُراجع حالة التوفر مرة أخرى عند تأكيد الحجز؛ لا تمثل ترتيبًا أو تقييمًا عامًا للطبيب.</Helper>
            </View>
          ) : null}
        </View>
      </Stack>
    </Screen>
  );
}
