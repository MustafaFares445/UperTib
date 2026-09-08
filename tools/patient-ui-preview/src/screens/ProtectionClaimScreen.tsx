import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { CLAIMS_NOW_ISO } from '../mocks/claims';
import {
  acceptedProtectionEvidenceIds,
  protectionEvidenceRequirements,
  type ProtectionClaimDraft,
  type ProtectionEntitlementProjection,
} from '../mocks/protectionClaims';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { EvidenceTransferPanel } from '../widgets/EvidenceTransferPanel';

export type ProtectionClaimSubmitState = 'editing' | 'submitting' | 'retryable-failure';

function BlockedState({ title, body }: { title: string; body: string }) {
  return (
    <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
      <BodyStrong>{title}</BodyStrong><Body>{body}</Body>
    </View>
  );
}

/** SCR-CLAIMS-003 — protection claim, reachable only from an applicable active accepted protection. */
export function ProtectionClaimScreen({
  entitlement,
  submitState = 'editing',
  subject = 'مطالبة حماية',
  authority,
  initialRequestedRemedy = '',
  initialNarrative = '',
  onSubmit,
  onCancel,
  onSupplyEvidence,
  onAddEvidence,
  onResumeEvidence,
  onRetryEvidence,
  onReplaceEvidence,
}: {
  entitlement: ProtectionEntitlementProjection;
  submitState?: ProtectionClaimSubmitState;
  subject?: string;
  authority?: string;
  initialRequestedRemedy?: string;
  initialNarrative?: string;
  onSubmit: (draft: ProtectionClaimDraft) => void;
  onCancel: () => void;
  onSupplyEvidence?: () => void;
  onAddEvidence?: (requirementId: string) => void;
  onResumeEvidence?: (itemId: string) => void;
  onRetryEvidence?: (itemId: string) => void;
  onReplaceEvidence?: (itemId: string) => void;
}) {
  const [requestedRemedy, setRequestedRemedy] = useState(initialRequestedRemedy);
  const [narrative, setNarrative] = useState(initialNarrative);
  useEffect(() => setRequestedRemedy(initialRequestedRemedy), [initialRequestedRemedy]);
  useEffect(() => setNarrative(initialNarrative), [initialNarrative]);

  const requirements = useMemo(() => protectionEvidenceRequirements(entitlement), [entitlement]);
  const outstanding = requirements.filter((item) => item.state !== 'ACCEPTED');
  const acceptedEvidenceIds = useMemo(() => acceptedProtectionEvidenceIds(entitlement), [entitlement]);
  const actionableEvidenceRequirement = entitlement.evidenceRequirements.find((requirement) =>
    requirement.items.length === 0 || requirement.items.some((item) =>
      item.state === 'SELECTED' || item.state === 'PAUSED' || item.state === 'FAILED_RETRYABLE' || item.state === 'REJECTED',
    ),
  );
  const evidencePendingValidation = entitlement.evidenceRequirements.some((requirement) =>
    requirement.items.some((item) => item.state === 'UPLOADING' || item.state === 'UPLOADED' || item.state === 'VALIDATING_SCANNING'),
  );
  const entitlementAvailable = entitlement.snapshotAvailable && entitlement.eligible && entitlement.activeProtection;
  const windowOpen = entitlement.claimWindowState !== 'lapsed'
    && new Date(entitlement.claimWindowEndsAtIso).getTime() > new Date(CLAIMS_NOW_ISO).getTime();
  const fieldsComplete = requestedRemedy.trim().length > 0 && narrative.trim().length > 0;
  const canSubmit = entitlementAvailable && windowOpen && outstanding.length === 0;

  const actions: ActionSpec[] = [];
  if (entitlementAvailable && windowOpen && actionableEvidenceRequirement && onSupplyEvidence) {
    actions.push({ key: 'supply-evidence', label: `استكمال: ${actionableEvidenceRequirement.title}`, role: 'primary', availability: { status: 'available' }, onPress: onSupplyEvidence });
  } else if (canSubmit) {
    actions.push({
      key: 'submit-protection-claim',
      label: submitState === 'retryable-failure' ? 'إعادة إرسال المطالبة' : 'تقديم مطالبة الحماية',
      role: 'primary',
      availability: submitState === 'submitting' ? { status: 'loading' } : fieldsComplete ? { status: 'available' } : { status: 'disabled', reason: 'اكتب المعالجة المطلوبة وما حدث قبل الإرسال.' },
      onPress: () => onSubmit({ requestedRemedy: requestedRemedy.trim(), narrative: narrative.trim(), evidenceIds: acceptedEvidenceIds }),
    });
  }
  actions.push({ key: 'cancel', label: 'إلغاء', role: 'secondary', availability: { status: 'available' }, onPress: onCancel });

  if (!entitlement.snapshotAvailable) {
    return (
      <Screen footer={<ActionBar actions={actions} />}>
        <Stack gap="stack-lg">
          <ScreenHeader eyebrow="مطالبة حماية" title="تعذّر فتح الحماية الحاكمة" />
          <SubjectContextHeader subject={subject} authority={authority} />
          <BlockedState title="تعذّر قراءة لقطة الحماية الحاكمة." body="لا نستخدم إعدادات حالية بديلة؛ يجب قراءة الشروط التي كانت مقبولة لهذه الحالة أولًا." />
        </Stack>
      </Screen>
    );
  }

  if (!entitlement.eligible || !entitlement.activeProtection) {
    return (
      <Screen footer={<ActionBar actions={actions} />}>
        <Stack gap="stack-lg">
          <ScreenHeader eyebrow="مطالبة حماية" title="لا توجد حماية فعّالة لهذه الحالة" />
          <SubjectContextHeader subject={subject} authority={authority} />
          <BlockedState title="لا توجد حماية فعّالة تتيح هذه المطالبة." body="لا يمكن إنشاء مطالبة حماية من هذه الحالة، ولا يغيّر تبدل إعدادات اليوم الاستحقاق التاريخي." />
        </Stack>
      </Screen>
    );
  }

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="مطالبة حماية" title="ما الذي تحتاجه مطالبتك الآن؟" />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
          <Helper>1. الحماية الفعّالة في الشروط المقبولة</Helper>
          <Heading3>{entitlement.protectionLabel}</Heading3>
          <Body>{entitlement.protectionSummary}</Body>
          <BodyStrong>{entitlement.serviceLabel}</BodyStrong>
          <Helper>{entitlement.providerName}</Helper>
          <Helper>{entitlement.governingSnapshotLabel}</Helper>
        </View>

        <DeadlineIndicator deadlineIso={entitlement.claimWindowEndsAtIso} obligation="مهلة تقديم مطالبة الحماية" nowIso={CLAIMS_NOW_ISO} state={entitlement.claimWindowState} />

        {!windowOpen ? (
          <BlockedState title="انتهت مهلة تقديم مطالبة الحماية." body="انتهاء هذه النافذة ليس فشل إرسال قابلًا لإعادة المحاولة، ولا نعيد فتحها من إعدادات السياسة الحالية." />
        ) : (
          <>
            <View style={{ gap: space('stack-sm') }}>
              <Heading3>2. جاهزية الأدلة</Heading3>
              <BodyStrong>{requirements.length - outstanding.length} من {requirements.length} متطلبات مكتملة</BodyStrong>
              {requirements.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
                  <Icon name={item.state === 'ACCEPTED' ? 'check-circle' : 'exclamation-triangle'} color={color('text.secondary')} />
                  <View style={{ flex: 1, gap: space('stack-xs') }}><BodyStrong>{item.label}</BodyStrong><Helper>{item.state === 'ACCEPTED' ? 'مقبول' : 'ما زال مطلوبًا'}</Helper></View>
                </View>
              ))}
              <EvidenceTransferPanel requirements={entitlement.evidenceRequirements} onAddItem={onAddEvidence} onResume={onResumeEvidence} onRetry={onRetryEvidence} onReplace={onReplaceEvidence} />
              {outstanding.length > 0 ? (
                <ContextNote
                  icon={evidencePendingValidation && !actionableEvidenceRequirement ? 'clock' : 'document-check'}
                  title={evidencePendingValidation && !actionableEvidenceRequirement ? 'المستند قيد النقل أو الفحص.' : `يلزم استكمال: ${outstanding[0].label}`}
                  body={evidencePendingValidation && !actionableEvidenceRequirement ? 'ننتظر اكتمال النقل أو الفحص؛ لا يصبح المتطلب مستوفيًا إلا بعد القبول.' : 'أكمل المتطلب الحالي أولًا. فشل النقل القابل لإعادة المحاولة يختلف عن رفض المستند.'}
                />
              ) : null}
            </View>

            {outstanding.length === 0 ? (
              <View style={{ gap: space('stack-md') }}>
                <Heading3>3. طلبك</Heading3>
                <ContextNote title={`نوع المطالبة: ${entitlement.claimTypeLabel}`} body="لا تحتاج إلى اختيار تصنيف داخلي أو مستوى حماية تقني." />
                <ValidationField label="المعالجة التي تطلب مراجعتها" value={requestedRemedy} onChangeText={setRequestedRemedy} helper="اكتب ما تريد من فريق المراجعة النظر فيه." placeholder="مثال: مراجعة الحاجة إلى متابعة إضافية ضمن الحماية" maxLength={500} />
                <ValidationField label="اشرح ما حدث" value={narrative} onChangeText={setNarrative} helper="اذكر الوقائع المرتبطة بالحالة باختصار." placeholder="اكتب وصفًا واضحًا لما حدث" maxLength={1600} multiline numberOfLines={6} />
                {submitState === 'retryable-failure' ? <BlockedState title="تعذّر تأكيد إرسال المطالبة." body="احتفظنا بما كتبته. إعادة الإرسال تستخدم نية الإرسال نفسها ولا تنشئ مطالبة ثانية." /> : null}
                <ContextNote icon="document-check" title="4. قبل الإرسال" body="المطالبة تنشئ طلب مراجعة فقط. إذا نتج قرار مالي، يسجل UberTib الالتزام ولا ينفذ دفعًا أو استردادًا داخل المنصة." />
              </View>
            ) : null}
          </>
        )}
      </Stack>
    </Screen>
  );
}
