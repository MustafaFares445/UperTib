import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { CLAIMS_NOW_ISO, type ClaimRequestState, type PatientClaimDetail } from '../mocks/claims';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { ClaimEvidenceDeadlinePanel } from '../widgets/ClaimEvidenceDeadlinePanel';

const CLAIM_LABEL: Record<ClaimRequestState, string> = {
  SUBMITTED: 'مُقدَّم',
  EVIDENCE_INCOMPLETE: 'أدلة ناقصة — إجراء مطلوب',
  UNDER_REVIEW: 'قيد المراجعة',
  DECIDED: 'صدر القرار',
  CLOSED: 'مُغلَق',
};

function DecisionSection({ claim }: { claim: PatientClaimDetail }) {
  if (!claim.decision) return null;
  const refund = claim.decision.approvedRefund;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <Heading3>القرار المسجّل</Heading3>
        <StateChip machine="claim-request" status="DECIDED" label="صدر القرار" />
      </View>
      <Body>{claim.decision.reason}</Body>
      <Helper>{claim.decision.decidedByLabel} · {formatDateTime(claim.decision.decidedAtIso)}</Helper>

      {refund ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>المبلغ المسجّل كنتيجة للقرار</BodyStrong>
          <PriceDisplay price={{ mode: 'fixed', amount: refund.amount, currency: refund.currency }} compact />
          <Body>هذا مبلغ مستحق للتنفيذ الخارجي بين الأطراف. القرار لا يعني أن UberTib دفع أو احتفظ أو أعاد أي مبلغ.</Body>
          <Helper>
            {refund.externalExecutionStatus === 'PENDING_EXTERNAL_EXECUTION'
              ? 'التنفيذ الخارجي لم يُسجّل بعد.'
              : refund.externalExecutionStatus === 'REPORTED_UNCONFIRMED'
                ? 'تم الإبلاغ عن تنفيذ خارجي، وما يزال بانتظار التأكيد.'
                : 'تم تأكيد تسجيل التنفيذ الخارجي كواقعة.'}
          </Helper>
        </View>
      ) : null}
    </View>
  );
}

/** SCR-CLAIMS-004 — authoritative patient claim detail with decision as a section, not a separate screen. */
export function ClaimDetailScreen({
  claim,
  subject = 'تفاصيل الطلب',
  authority,
  onBack,
  onSupplyEvidence,
  onAppeal,
  onReportRefundExecution,
}: {
  claim: PatientClaimDetail;
  subject?: string;
  authority?: string;
  onBack: () => void;
  onSupplyEvidence?: () => void;
  onAppeal?: () => void;
  onReportRefundExecution?: () => void;
}) {
  const outstanding = claim.evidenceRequirements.filter((item) => item.state !== 'ACCEPTED');
  const deadlineKnown = Boolean(claim.effectiveDeadlineIso);
  const deadlineOpen = Boolean(
    claim.effectiveDeadlineIso
      && new Date(claim.effectiveDeadlineIso).getTime() > new Date(CLAIMS_NOW_ISO).getTime(),
  );
  const appealOpen = Boolean(
    claim.decision
      && claim.appealEligible
      && claim.appealWindowEndsAtIso
      && new Date(claim.appealWindowEndsAtIso).getTime() > new Date(CLAIMS_NOW_ISO).getTime(),
  );
  const refundExecutionAvailable = Boolean(
    claim.decision?.approvedRefund?.externalExecutionStatus === 'PENDING_EXTERNAL_EXECUTION',
  );

  const actions: ActionSpec[] = [];
  if (outstanding.length > 0 && deadlineOpen && onSupplyEvidence) {
    actions.push({
      key: 'evidence',
      label: `استكمال: ${outstanding[0].label}`,
      role: 'primary',
      availability: { status: 'available' },
      onPress: onSupplyEvidence,
    });
  } else if (appealOpen && onAppeal) {
    actions.push({
      key: 'appeal',
      label: 'الاعتراض على القرار',
      role: 'primary',
      availability: { status: 'available' },
      onPress: onAppeal,
    });
  }

  if (refundExecutionAvailable && onReportRefundExecution) {
    actions.push({
      key: 'refund-execution',
      label: 'تسجيل تنفيذ الاسترداد خارج UberTib',
      role: actions.some((action) => action.role === 'primary') ? 'secondary' : 'primary',
      availability: { status: 'available' },
      onPress: onReportRefundExecution,
    });
  }

  actions.push({
    key: 'back',
    label: 'العودة إلى المطالبات',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onBack,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={claim.type === 'REFUND_REQUEST' ? 'طلب استرداد' : 'مطالبة حماية'}
          title="أين وصل هذا الطلب؟"
          description="نقرأ الحالة، المتطلبات والمهلة من السجل الحاكم نفسه. القرارات والتغييرات تبقى كسجل تاريخي ولا تمسح ما سبقها."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm') }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
            <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}>
              <BodyStrong>{claim.serviceLabel}</BodyStrong>
              <Body>{claim.providerName}</Body>
            </View>
            <StateChip machine="claim-request" status={claim.state} label={CLAIM_LABEL[claim.state]} />
          </View>
          <Helper>{claim.governingSnapshotLabel}</Helper>
          <Helper>قُدّم في {formatDateTime(claim.submittedAtIso)}</Helper>
        </View>

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
          <BodyStrong>ما الذي طلبته؟</BodyStrong>
          {claim.requestedAmount !== undefined && claim.currency ? (
            <PriceDisplay price={{ mode: 'fixed', amount: claim.requestedAmount, currency: claim.currency }} compact />
          ) : null}
          <Body>{claim.narrative}</Body>
        </View>

        <ClaimEvidenceDeadlinePanel
          originalDeadlineIso={claim.originalDeadlineIso}
          effectiveDeadlineIso={claim.effectiveDeadlineIso}
          deadlineState={claim.deadlineState}
          deadlineEvents={claim.deadlineEvents}
          requirements={claim.evidenceRequirements}
        />

        {outstanding.length > 0 && !deadlineKnown ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
            <Icon name="exclamation-triangle" color={color('text.secondary')} />
            <View style={{ flex: 1, gap: space('stack-xs') }}>
              <BodyStrong>المهلة الفعّالة غير متاحة حاليًا.</BodyStrong>
              <Body>لا نعرض إجراء استكمال الأدلة حتى نعرف المهلة الحاكمة؛ غياب الموعد لا يعني أن الطلب بلا مهلة.</Body>
            </View>
          </View>
        ) : null}

        {outstanding.length > 0 && deadlineKnown && !deadlineOpen ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
            <Icon name="stop-circle" color={color('text.secondary')} />
            <View style={{ flex: 1, gap: space('stack-xs') }}>
              <BodyStrong>انتهت مهلة استكمال المتطلبات.</BodyStrong>
              <Body>انتهاء المهلة غير قابل لإعادة المحاولة من زر رفع جديد؛ اقرأ القرار أو سجل الطلب لمعرفة الخطوة التالية المتاحة.</Body>
            </View>
          </View>
        ) : null}

        <DecisionSection claim={claim} />

        {claim.decision && claim.appealEligible && claim.appealWindowEndsAtIso && !appealOpen ? (
          <Helper>انتهت مهلة الاعتراض على هذا القرار في {formatDateTime(claim.appealWindowEndsAtIso)}؛ انتهاء المهلة ليس فشلًا قابلًا لإعادة المحاولة.</Helper>
        ) : null}
      </Stack>
    </Screen>
  );
}
