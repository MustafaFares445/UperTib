import { useState } from 'react';
import { ActionBar } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import {
  activeHeldGrant,
  expiredGrant,
  selectRepresentationContext,
  unresolvedScopeGrant,
  type ActiveRepresentationContext,
} from '../mocks/representation';
import { ActivePatientContextScreen } from '../screens/ActivePatientContextScreen';

type Step = 'select' | 'represented';

/** FLOW-IDENTITY-003 — selecting a subject changes display context only and preserves acting identity. */
export function RepresentationContextFlow() {
  const [step, setStep] = useState<Step>('select');
  const [context, setContext] = useState<ActiveRepresentationContext | undefined>();
  const actingGuardianName = 'مصطفى فارس';

  if (step === 'represented' && context) {
    return (
      <Screen
        footer={<ActionBar actions={[{
          key: 'change-subject',
          label: 'تغيير المريض النشط',
          role: 'secondary',
          availability: { status: 'available' },
          onPress: () => setStep('select'),
        }]} />}
      >
        <Stack gap="stack-lg">
          <ScreenHeader
            eyebrow="سياق تمثيل نشط"
            title="المريض تغيّر، هويتك لم تتغير"
            description="هذه معاينة للسياق الذي يجب أن يبقى ظاهرًا على شاشات المريض عندما تعمل بصلاحية تمثيل."
          />
          <SubjectContextHeader
            subject={`سجل المريض: ${context.subjectPatientName}`}
            authority={`يتصرف الآن: ${context.actingGuardianName} بموجب صلاحية تمثيل فعّالة`}
          />
          <BodyStrong>التبديل لم ينشئ صلاحية جديدة.</BodyStrong>
          <Body>عند فتح حالة أو إنشاء حجز أو تنفيذ أي أمر، يعيد النظام تقييم الصلاحية نفسها للأمر ونطاق البيانات والغرض المطلوب.</Body>
          <Helper>النطاق المقروء عند الاختيار: {context.scopeSummary}</Helper>
        </Stack>
      </Screen>
    );
  }

  return (
    <ActivePatientContextScreen
      actingGuardianName={actingGuardianName}
      grants={[activeHeldGrant, expiredGrant, { ...unresolvedScopeGrant, direction: 'HELD' }]}
      onSelect={(grant) => {
        const next = selectRepresentationContext(grant, actingGuardianName);
        if (!next) return;
        setContext(next);
        setStep('represented');
      }}
      onCancel={() => undefined}
    />
  );
}
