import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { ReviewAppealDraft, ReviewAppealRecord } from '../mocks/reviewAppeals';
import { REVIEW_NOW_ISO, type PatientReviewProjection } from '../mocks/reviews';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type ReviewAppealSubmitState = 'editing' | 'submitting' | 'retryable-failure';
export interface AppealEvidenceSummary { id: string; label: string; }
const APPEAL_LABEL = { SUBMITTED: 'مُقدَّم', DECIDED: 'صدر القرار' } as const;

function DecisionCard({ review }: { review: PatientReviewProjection }) {
  if (!review.retirement) return null;
  return (
    <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space('inline-sm') }}>
        <View style={{ flex: 1, gap: space('stack-xs') }}><Helper>القرار الذي تعترض عليه</Helper><BodyStrong>أرشفة تقييم {review.serviceLabel}</BodyStrong></View>
        <StateChip machine="review" status="RETIRED" label="مؤرشَف" />
      </View>
      <Body>{review.retirement.reason}</Body>
      <Helper>{review.retirement.decidedByLabel} · {formatDateTime(review.retirement.decidedAtIso)}</Helper>
    </View>
  );
}

function BlockedState({ title, body }: { title: string; body: string }) {
  return <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}><BodyStrong>{title}</BodyStrong><Body>{body}</Body></View>;
}

function ExistingAppeal({ appeal }: { appeal: ReviewAppealRecord }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space('inline-sm') }}><Heading3>حالة الاعتراض</Heading3><StateChip machine="review-appeal" status={appeal.state} label={APPEAL_LABEL[appeal.state]} /></View>
      <Helper>قُدّم في {formatDateTime(appeal.submittedAtIso)}</Helper>
      <BodyStrong>الأساس الذي قدّمته</BodyStrong><Body>{appeal.grounds}</Body>
      {appeal.state === 'SUBMITTED' ? <Body>الاعتراض بانتظار قرار مراجع نزاهة مستقل لم يصدر القرار الأصلي.</Body> : null}
      {appeal.state === 'DECIDED' && appeal.decisionReason ? <><BodyStrong>سبب القرار</BodyStrong><Body>{appeal.decisionReason}</Body>{appeal.decidedAtIso ? <Helper>{appeal.decidedByLabel ?? 'مراجع نزاهة مستقل'} · {formatDateTime(appeal.decidedAtIso)}</Helper> : null}</> : null}
    </View>
  );
}

/** SCR-REVIEWS-004 — patient-safe appeal of a governed decision about the patient's own review. */
export function ReviewAppealScreen({
  review, appealRecord, actorAuthorized = true, submitState = 'editing', subject = 'الاعتراض على قرار التقييم', authority,
  initialGrounds = '', supportingEvidence = [], onSubmit, onBackToReview, onRetryDecision,
}: {
  review: PatientReviewProjection; appealRecord?: ReviewAppealRecord; actorAuthorized?: boolean; submitState?: ReviewAppealSubmitState;
  subject?: string; authority?: string; initialGrounds?: string; supportingEvidence?: AppealEvidenceSummary[];
  onSubmit: (draft: ReviewAppealDraft) => void; onBackToReview: () => void; onRetryDecision?: () => void;
}) {
  const [grounds, setGrounds] = useState(initialGrounds);
  useEffect(() => setGrounds(initialGrounds), [initialGrounds]);
  const decisionAvailable = review.state === 'RETIRED' && Boolean(review.retirement);
  const appealAllowed = Boolean(review.appealPolicy?.allowed);
  const deadlineIso = review.appealPolicy?.windowEndsAtIso;
  const deadlineExpired = !deadlineIso || review.appealPolicy?.windowState === 'lapsed' || new Date(deadlineIso).getTime() <= new Date(REVIEW_NOW_ISO).getTime();
  const existingAppeal = appealRecord;
  const projectionAppeal = review.appeal;
  const hasExistingAppeal = Boolean(existingAppeal || projectionAppeal);
  const canAuthor = decisionAvailable && appealAllowed && actorAuthorized && !deadlineExpired && !hasExistingAppeal;

  const actions: ActionSpec[] = [];
  if (!decisionAvailable && onRetryDecision) actions.push({ key: 'retry-decision', label: 'إعادة تحميل القرار', role: 'primary', availability: { status: 'available' }, onPress: onRetryDecision });
  else if (canAuthor) actions.push({ key: 'submit-appeal', label: submitState === 'retryable-failure' ? 'إعادة إرسال الاعتراض' : 'تقديم الاعتراض', role: 'primary', availability: submitState === 'submitting' ? { status: 'loading' } : grounds.trim().length ? { status: 'available' } : { status: 'disabled', reason: 'اكتب أساس الاعتراض قبل الإرسال.' }, onPress: () => onSubmit({ grounds: grounds.trim(), evidenceIds: supportingEvidence.map((item) => item.id) }) });
  actions.push({ key: 'back', label: 'العودة إلى تقييمي', role: 'secondary', availability: { status: 'available' }, onPress: onBackToReview });

  if (!decisionAvailable) {
    return <Screen footer={<ActionBar actions={actions} />}><Stack gap="stack-lg"><ScreenHeader eyebrow="اعتراض على قرار مراجعة" title="القرار الأصلي غير متاح" /><SubjectContextHeader subject={subject} authority={authority} /><BlockedState title="لا يمكن بدء الاعتراض قبل عرض القرار." body="تعذّر عرض القرار الأصلي وسببه الآن، لذلك أوقفنا نموذج الاعتراض حتى لا ترسل اعتراضًا بلا سياق واضح." /></Stack></Screen>;
  }

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="اعتراض على قرار مراجعة" title={hasExistingAppeal ? 'حالة اعتراضك' : 'راجع القرار ثم اكتب سبب اعتراضك'} />
        <SubjectContextHeader subject={subject} authority={authority} />
        <DecisionCard review={review} />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>ما الذي يمكن لهذا الاعتراض مراجعته؟</Heading3>
          {['الأهلية', 'التحقق', 'الالتزام بالسياسة'].map((label) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}><Icon name="check-circle" color={color('text.secondary')} /><BodyStrong>{label}</BodyStrong></View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}><Icon name="no-symbol" color={color('text.secondary')} /><View style={{ flex: 1 }}><BodyStrong>لا يغيّر قيمة التقييم أو نصه</BodyStrong><Helper>هذا المسار يراجع القرار ولا يعيد كتابة تقييمك.</Helper></View></View>
        </View>

        <ContextNote icon="scale" title="مراجعة مستقلة" body="يصدر القرار من مراجع نزاهة مستقل لم يتخذ القرار الأصلي." />
        {deadlineIso ? <DeadlineIndicator deadlineIso={deadlineIso} obligation="مهلة تقديم الاعتراض" nowIso={REVIEW_NOW_ISO} state={deadlineExpired ? 'lapsed' : review.appealPolicy?.windowState} /> : null}

        {existingAppeal ? <ExistingAppeal appeal={existingAppeal} /> : projectionAppeal ? (
          <BlockedState title="يوجد اعتراض مسجّل بالفعل." body={projectionAppeal.state === 'DECIDED' ? 'صدر قرار لهذا الاعتراض. افتح سجل التقييم لقراءة النتيجة المسجّلة؛ لا يمكن إنشاء اعتراض ثانٍ على القرار نفسه.' : 'تم تسجيل اعتراض على هذا القرار وهو قيد المراجعة. لا نعرض نموذجًا ثانيًا حتى لا تنشأ مطالبتان بالمعنى نفسه.'} />
        ) : !appealAllowed ? (
          <BlockedState title="لا يتضمن هذا القرار حق اعتراض من حسابك." body="يبقى القرار وسببه ظاهرين للقراءة، لكن لا يتوفر نموذج إرسال لهذا الطرف." />
        ) : !actorAuthorized ? (
          <BlockedState title="لا تملك صلاحية تقديم هذا الاعتراض." body="يمكن للمريض الذي كتب التقييم، أو وليّه ضمن نطاق تمثيل فعّال، تقديم الاعتراض." />
        ) : deadlineExpired ? (
          <BlockedState title="انتهت مهلة تقديم هذا الاعتراض." body="انتهاء المهلة ليس خطأ إرسال، وإعادة المحاولة لا تعيد فتح نافذة الاعتراض." />
        ) : (
          <View style={{ gap: space('stack-lg') }}>
            {submitState === 'retryable-failure' ? <BlockedState title="تعذّر تأكيد إرسال الاعتراض." body="احتفظنا بما كتبته. أعد الإرسال من هنا؛ إعادة المحاولة تستخدم محاولة الإرسال نفسها بدل إنشاء اعتراض جديد." /> : null}
            <Heading3>أساس اعتراضك</Heading3>
            <ValidationField label="اشرح سبب الاعتراض" value={grounds} onChangeText={setGrounds} helper="اشرح ما يحتاج مراجعة في الأهلية أو التحقق أو تطبيق السياسة." placeholder="اكتب أساس الاعتراض" maxLength={1200} multiline numberOfLines={6} autoFocus />
            <View style={{ gap: space('stack-sm') }}><BodyStrong>مستندات داعمة</BodyStrong>{supportingEvidence.length ? supportingEvidence.map((item) => <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}><Icon name="document-check" color={color('text.secondary')} /><Body>{item.label}</Body></View>) : <Helper>لا توجد مستندات مرفقة. المستندات اختيارية في هذا الاعتراض.</Helper>}</View>
          </View>
        )}
      </Stack>
    </Screen>
  );
}
