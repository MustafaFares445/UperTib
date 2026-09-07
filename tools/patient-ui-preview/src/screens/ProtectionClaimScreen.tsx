import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import {
  CLAIMS_NOW_ISO,
} from '../mocks/claims';
import {
  acceptedProtectionEvidenceIds,
  protectionEvidenceRequirements,
  type ProtectionClaimDraft,
  type ProtectionEntitlementProjection,
} from '../mocks/protectionClaims';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { ClaimEvidenceDeadlinePanel } from '../widgets/ClaimEvidenceDeadlinePanel';
import { EvidenceTransferPanel } from '../widgets/EvidenceTransferPanel';

export type ProtectionClaimSubmitState = 'editing' | 'submitting' | 'retryable-failure';

function BlockedCard({ title, body }: { title: string; body: string }) {
  return (
    <View
      accessibilityRole="alert"
      style={{
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.subtle'),
      }}
    >
      <BodyStrong>{title}</BodyStrong>
      <Body>{body}</Body>
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

  const entitlementAvailable = entitlement.snapshotAvailable && entitlement.eligible && entitlement.activeProtection;
  const windowOpen = entitlement.claimWindowState !== 'lapsed'
    && new Date(entitlement.claimWindowEndsAtIso).getTime() > new Date(CLAIMS_NOW_ISO).getTime();
  const fieldsComplete = requestedRemedy.trim().length > 0 && narrative.trim().length > 0;
  const canSubmit = entitlementAvailable && windowOpen && outstanding.length === 0;

  const actions: ActionSpec[] = [];
  if (entitlementAvailable && windowOpen && outstanding.length > 0 && onSupplyEvidence) {
    actions.push({
      key: 'supply-evidence',
      label: `استكمال: ${outstanding[0].label}`,
      role: 'primary',
      availability: { status: 'available' },
      onPress: onSupplyEvidence,
    });
  } else if (canSubmit) {
    actions.push({
      key: 'submit-protection-claim',
      label: submitState === 'retryable-failure' ? 'إعادة إرسال المطالبة' : 'تقديم مطالبة الحماية',
      role: 'primary',
      availability: submitState === 'submitting'
        ? { status: 'loading' }
        : fieldsComplete
          ? { status: 'available' }
          : { status: 'disabled', reason: 'اكتب المعالجة المطلوبة وما حدث قبل الإرسال.' },
      onPress: () => onSubmit({
        requestedRemedy: requestedRemedy.trim(),
        narrative: narrative.trim(),
        evidenceIds: acceptedEvidenceIds,
      }),
    });
  }
  actions.push({
    key: 'cancel',
    label: 'إلغاء',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onCancel,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="مطالبة حماية"
          title="ابدأ من الحماية المسجّلة، لا من وعد عام"
          description="هذه المطالبة متاحة فقط لأن الشروط المقبولة للحالة تحتوي حماية فعّالة تنطبق عليها. الحماية مشروطة وليست تأمينًا أو نتيجة مضمونة."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {!entitlement.snapshotAvailable ? (
          <BlockedCard
            title="تعذّر قراءة لقطة الحماية الحاكمة."
            body="لا نعرض نموذج المطالبة من إعدادات حالية بديلة؛ يجب أولًا قراءة الشروط التي كانت مقبولة لهذه الحالة."
          />
        ) : !entitlement.eligible || !entitlement.activeProtection ? (
          <BlockedCard
            title="لا توجد حماية فعّالة تتيح هذه المطالبة."
            body="لا يمكن إنشاء مطالبة حماية من هذه الحالة. تغيير الحالة المعروضة لا ينشئ استحقاقًا جديدًا."
          />
        ) : (
          <>
            <View
              style={{
                gap: space('stack-sm'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.subtle'),
                backgroundColor: color('surface.default'),
              }}
            >
              <Helper>الحماية الفعّالة في الشروط المقبولة</Helper>
              <Heading3>{entitlement.protectionLabel}</Heading3>
              <Body>{entitlement.protectionSummary}</Body>
              <BodyStrong>{entitlement.serviceLabel}</BodyStrong>
              <Helper>{entitlement.providerName}</Helper>
              <Helper>{entitlement.governingSnapshotLabel}</Helper>
            </View>

            <DeadlineIndicator
              deadlineIso={entitlement.claimWindowEndsAtIso}
              obligation="مهلة تقديم مطالبة الحماية"
              nowIso={CLAIMS_NOW_ISO}
              state={entitlement.claimWindowState}
            />

            {!windowOpen ? (
              <BlockedCard
                title="انتهت مهلة تقديم مطالبة الحماية."
                body="انتهاء هذه النافذة ليس فشل إرسال قابلًا لإعادة المحاولة، ولا نعيد فتحها من إعدادات السياسة الحالية."
              />
            ) : null}

            <ClaimEvidenceDeadlinePanel
              originalDeadlineIso={entitlement.claimWindowEndsAtIso}
              effectiveDeadlineIso={entitlement.claimWindowEndsAtIso}
              deadlineState={entitlement.claimWindowState}
              deadlineEvents={[]}
              requirements={requirements}
            />

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>المستندات المرتبطة بالمتطلبات</Heading3>
              <EvidenceTransferPanel
                requirements={entitlement.evidenceRequirements}
                onAddItem={onAddEvidence}
                onResume={onResumeEvidence}
                onRetry={onRetryEvidence}
                onReplace={onReplaceEvidence}
              />
            </View>

            {outstanding.length > 0 ? (
              <BlockedCard
                title={`يلزم استكمال: ${outstanding[0].label}`}
                body="لا يصبح زر تقديم المطالبة متاحًا قبل قبول كل متطلب. الملف قيد النقل أو الفحص لا يُحسب كمستند مقبول."
              />
            ) : null}

            {windowOpen ? (
              <View style={{ gap: space('stack-md') }}>
                <Heading3>ما الذي تطلب مراجعته؟</Heading3>
                <View
                  style={{
                    gap: space('stack-xs'),
                    padding: space('inset-md'),
                    borderRadius: radius('surface'),
                    backgroundColor: color('surface.subtle'),
                  }}
                >
                  <Helper>نوع المطالبة من لقطة الحماية</Helper>
                  <BodyStrong>{entitlement.claimTypeLabel}</BodyStrong>
                  <Helper>لا نطلب منك اختيار تصنيف داخلي أو مستوى حماية تقني.</Helper>
                </View>

                <ValidationField
                  label="المعالجة التي تطلب مراجعتها"
                  value={requestedRemedy}
                  onChangeText={setRequestedRemedy}
                  helper="اكتب ما تريد من فريق المراجعة النظر فيه. لا نعد بنتيجة أو مبلغ مالي."
                  placeholder="مثال: مراجعة الحاجة إلى متابعة إضافية ضمن الحماية"
                  maxLength={500}
                />
                <ValidationField
                  label="اشرح ما حدث"
                  value={narrative}
                  onChangeText={setNarrative}
                  helper="اذكر الوقائع المرتبطة بالحالة باختصار. لا تكتب بيانات تخزين أو روابط ملفات هنا."
                  placeholder="اكتب وصفًا واضحًا لما حدث"
                  maxLength={1600}
                  multiline
                  numberOfLines={6}
                />
              </View>
            ) : null}

            {submitState === 'retryable-failure' && canSubmit ? (
              <BlockedCard
                title="تعذّر تأكيد إرسال المطالبة."
                body="احتفظنا بما كتبته. إعادة الإرسال تستخدم نية الإرسال نفسها ولا تنشئ مطالبة ثانية لمجرد تعذر وصول الاستجابة."
              />
            ) : null}

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.subtle'),
                backgroundColor: color('surface.subtle'),
              }}
            >
              <BodyStrong>ما الذي يحدث إذا قُبلت المطالبة؟</BodyStrong>
              <Body>يسجّل النظام القرار والالتزام الناتج عنه فقط. لا تنفّذ UberTib دفعًا أو استردادًا، ولا تضمن نتيجة مالية.</Body>
            </View>
          </>
        )}
      </Stack>
    </Screen>
  );
}
