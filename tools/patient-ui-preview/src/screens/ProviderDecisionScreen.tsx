import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';

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
            {
              key: 'why',
              label: showWhy ? 'إخفاء السبب' : 'لماذا هذا الخيار متاح؟',
              role: 'secondary',
              availability: { status: 'available' },
              onPress: () => setShowWhy((v) => !v),
            },
            { key: 'back', label: 'رجوع إلى النتائج', role: 'secondary', availability: { status: 'available' }, onPress: onBackToResults },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading2>تفاصيل الخيار</Heading2>
        <ProviderDecisionCard option={option} variant="card" />
        {showWhy ? <Body tone="secondary">{ELIGIBILITY_MEANING[option.eligibility]}</Body> : null}
      </Stack>
    </Screen>
  );
}
