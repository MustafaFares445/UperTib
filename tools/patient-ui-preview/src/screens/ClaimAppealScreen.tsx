import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { type ClaimAppealDraft, type ClaimAppealProjection } from '../mocks/claimAppeals';
import { CLAIMS_NOW_ISO, type PatientClaimDetail } from '../mocks/claims';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type ClaimAppealSubmitState = 'editing' | 'submitting' | 'retryable-failure';
export interface ClaimAppealEvidenceSummary { id: string; label: string; }
const APPEAL_LABEL = { SUBMITTED: 'مُقدَّم', UNDER_REVIEW: 'قيد المراجعة', DECIDED: 'صدر القرار' } as const;

function BlockedState({ title, body }: { title: string; body: string }) {
  return <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}><BodyStrong>{title}</BodyStrong><Body>{body}</Body></View>;
}

function OriginalDecision({ claim }: { claim: PatientClaimDetail }) {
  if (!claim.decision) return null;
  return (
    <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <View style={{ flex: 1, gap: space('stack-xs') }}><Helper>القرار الأصلي — يبقى محفوظًا</Helper><BodyStrong>{claim.serviceLabel}</BodyStrong></View>
        <StateChip machine="claim-request" status="DECIDED" label="صدر القرار" />
      </View>
      <Body>{claim.decision.reason}</Body>
      <Helper>{claim.decision.decidedByLabel} · {formatDateTime(claim.decision.decidedAtIso)}</Helper>
    </View>
  );
}

function ExistingAppeal({ appeal }: { appeal: ClaimAppealProjection }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}><Heading3>حالة الاعتراض</Heading3><StateChip machine="claim-appeal" status={appeal.state} label={APPEAL_LABEL[appeal.state]} /></View>
      <Helper>قُدّم في {formatDateTime(appeal.submittedAtIso)}</Helper>
      {appeal.grounds ? <><BodyStrong>الأساس المسجّل</BodyStrong><Body>{appeal.grounds}</Body></> : <Body>يوجد اعتراض مسجّل لهذا القرار، لذلك لا نعرض نموذجًا ثانيًا.</Body>}
      {appeal.state === 'UNDER_REVIEW' ? <Body>الاعتراض قيد مراجعة الفريق المخوّل المستقل عن القرار الأصلي.</Body> : null}
      {appeal.state === 'SUBMITTED' ? <Body>تم تقديم الاعتراض وهو بانتظار بدء المراجعة.</Body> : null}
      {appeal.state === 'DECIDED' && appeal.decisionReason ? <><BodyStrong>سبب قرار الاعتراض</BodyStrong><Body>{appeal.decisionReason}</Body>{appeal.decidedAtIso ? <Helper>{appeal.decidedByLabel ?? 'مراجع اعتراضات مستقل'} · {formatDateTime(appeal.decidedAtIso)}</Helper> : null}</> : null}
    </View>
  );
}

/** SCR-CLAIMS-005 — appeal a claim decision under the historical policy snapshot that governed it. */
export function ClaimAppealScreen({
  claim, appeal, actorAuthorized = true, submitState = 'editing', subject = 'الاعتراض على قرار المطالبة', authority,
  initialGrounds = '', supportingEvidence = [], onSubmit, onBack,
}: {
  claim: PatientClaimDetail; appeal?: ClaimAppealProjection; actorAuthorized?: boolean; submitState?: ClaimAppealSubmitState;
  subject?: string; authority?: string; initialGrounds?: string; supportingEvidence?: ClaimAppealEvidenceSummary[];
  onSubmit: (draft: ClaimAppealDraft) => void; onBack: () => void;
}) {
  const [grounds, setGrounds] = useState(initialGrounds);
  useEffect(() => setGrounds(initialGrounds), [initialGrounds]);
  const decisionAvailable = Boolean(claim.decision);
  const policyAllows = claim.appealEligible;
  const deadlineIso = claim.appealWindowEndsAtIso;
  const deadlineExpired = !deadlineIso || new Date(deadlineIso).getTime() <= new Date(CLAIMS_NOW_ISO).getTime();
  const canAuthor = decisionAvailable && policyAllows && actorAuthorized && !deadlineExpired && !appeal;
  const actions: ActionSpec[] = [];
  if (canAuthor) actions.push({ key: 'submit-claim-appeal', label: submitState === 'retryable-failure' ? 'إعادة إرسال الاعتراض' : 'تقديم الاعتراض', role: 'primary', availability: submitState === 'submitting' ? { status: 'loading' } : grounds.trim().length ? { status: 'available' } : { status: 'disabled', reason: 'اكتب أساس الاعتراض قبل الإرسال.' }, onPress: () => onSubmit({ grounds: grounds.trim(), evidenceIds: supportingEvidence.map((item) => item.id) }) });
  actions.push({ key: 'back', label: 'العودة إلى المطالبة', role: 'secondary', availability: { status: 'available' }, onPress: onBack });

  if (!decisionAvailable) {
    return <Screen footer={<ActionBar actions={actions} />}><Stack gap="stack-lg"><ScreenHeader eyebrow="اعتراض على قرار مطالبة" title="القرار الأصلي غير متاح" /><SubjectContextHeader subject={subject} authority={authority} /><BlockedState title="لا يمكن بدء الاعتراض قبل قراءة القرار الأصلي." body="لا نعرض نموذجًا ضد قرار لا يمكن قراءته مع سببه. عد إلى المطالبة وأعد تحميل السجل أولًا." /></Stack></Screen>;
  }

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="اعتراض على قرار مطالبة" title={appeal ? 'حالة اعتراضك' : 'اعترض على القرار نفسه دون محو تاريخه'} />
        <SubjectContextHeader subject={subject} authority={authority} />
        <OriginalDecision claim={claim} />
        <ContextNote icon="document-check" title="لقطة السياسة الحاكمة للاعتراض" body={`${claim.governingSnapshotLabel} — النافذة والشروط تأتي من النسخة التاريخية التي حكمت القرار.`} />
        {deadlineIso ? <DeadlineIndicator deadlineIso={deadlineIso} obligation="مهلة الاعتراض على هذا القرار" nowIso={CLAIMS_NOW_ISO} state={deadlineExpired ? 'lapsed' : 'running'} /> : null}

        {appeal ? <ExistingAppeal appeal={appeal} /> : !policyAllows ? (
          <BlockedState title="لا تمنح لقطة السياسة لهذا القرار حق اعتراض من حسابك." body="يبقى القرار وسببه ظاهرين، لكن لا يتوفر إرسال اعتراض لهذا الطرف." />
        ) : !actorAuthorized ? (
          <BlockedState title="لا تملك صلاحية تقديم هذا الاعتراض." body="يستطيع الطرف المخوّل في الحالة، أو وليّه ضمن نطاق تمثيل فعّال، تقديم الاعتراض." />
        ) : deadlineExpired ? (
          <BlockedState title="انتهت مهلة الاعتراض." body="هذه النافذة التاريخية انتهت ولا تُعامل كفشل قابل لإعادة المحاولة أو كسبب لإنشاء نية إرسال جديدة." />
        ) : (
          <View style={{ gap: space('stack-lg') }}>
            {submitState === 'retryable-failure' ? <BlockedState title="تعذّر تأكيد إرسال الاعتراض." body="احتفظنا بما كتبته. إعادة الإرسال تستخدم محاولة الإرسال نفسها بدل إنشاء اعتراض ثانٍ." /> : null}
            <Heading3>أساس الاعتراض</Heading3>
            <ValidationField label="أساس الاعتراض" value={grounds} onChangeText={setGrounds} helper="اشرح لماذا يحتاج القرار إلى مراجعة وفق الوقائع والسياسة التي حكمته." placeholder="اكتب أساس الاعتراض" maxLength={1600} multiline numberOfLines={6} autoFocus />
            <View style={{ gap: space('stack-xs') }}>
              <BodyStrong>مستندات داعمة موجودة مسبقًا</BodyStrong>
              {supportingEvidence.length ? supportingEvidence.map((item) => <Body key={item.id}>{item.label}</Body>) : <Helper>لا توجد مستندات مرتبطة بالاعتراض. يمكن إرسال الأساس النصي وحده عندما تسمح السياسة بذلك.</Helper>}
              <Helper>لا توجد هنا مساحة رفع عامة جديدة؛ الأدلة تُربط عبر متطلبات السجل الحاكم فقط.</Helper>
            </View>
            <ContextNote title="قبل الإرسال" body="الاعتراض يراجع القرار ولا يمحوه، ولا يضمن نتيجة أو مبلغًا ماليًا، ولا ينفذ حركة أموال داخل UberTib." />
          </View>
        )}
      </Stack>
    </Screen>
  );
}