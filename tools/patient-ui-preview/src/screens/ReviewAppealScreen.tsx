import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
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

export interface AppealEvidenceSummary {
  id: string;
  label: string;
}

const APPEAL_LABEL = {
  SUBMITTED: 'مُقدَّم',
  DECIDED: 'صدر القرار',
} as const;

function ScopeRow({ icon, title, detail }: { icon: 'check-circle' | 'no-symbol'; title: string; detail: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space('inline-sm'),
        paddingVertical: space('stack-xs'),
      }}
    >
      <Icon name={icon} color={color('text.secondary')} />
      <View style={{ flex: 1, gap: space('stack-xs') }}>
        <BodyStrong>{title}</BodyStrong>
        <Helper>{detail}</Helper>
      </View>
    </View>
  );
}

function DecisionCard({ review }: { review: PatientReviewProjection }) {
  if (!review.retirement) return null;

  return (
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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space('inline-sm') }}>
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <Helper>القرار الذي تعترض عليه</Helper>
          <BodyStrong>أرشفة تقييم {review.serviceLabel}</BodyStrong>
        </View>
        <StateChip machine="review" status="RETIRED" label="مؤرشَف" />
      </View>
      <Body>{review.retirement.reason}</Body>
      <Helper>{review.retirement.decidedByLabel} · {formatDateTime(review.retirement.decidedAtIso)}</Helper>
    </View>
  );
}

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

function ExistingAppeal({ appeal }: { appeal: ReviewAppealRecord }) {
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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space('inline-sm') }}>
        <Heading3>حالة الاعتراض</Heading3>
        <StateChip machine="review-appeal" status={appeal.state} label={APPEAL_LABEL[appeal.state]} />
      </View>
      <Helper>قُدّم في {formatDateTime(appeal.submittedAtIso)}</Helper>
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>الأساس الذي قدّمته</BodyStrong>
        <Body>{appeal.grounds}</Body>
      </View>
      {appeal.state === 'SUBMITTED' ? (
        <Body>الاعتراض بانتظار قرار مراجع نزاهة مستقل لم يصدر القرار الأصلي.</Body>
      ) : null}
      {appeal.state === 'DECIDED' && appeal.decisionReason ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>سبب القرار</BodyStrong>
          <Body>{appeal.decisionReason}</Body>
          {appeal.decidedAtIso ? (
            <Helper>{appeal.decidedByLabel ?? 'مراجع نزاهة مستقل'} · {formatDateTime(appeal.decidedAtIso)}</Helper>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** SCR-REVIEWS-004 — patient-safe appeal of a governed decision about the patient's own review. */
export function ReviewAppealScreen({
  review,
  appealRecord,
  actorAuthorized = true,
  submitState = 'editing',
  subject = 'الاعتراض على قرار التقييم',
  authority,
  initialGrounds = '',
  supportingEvidence = [],
  onSubmit,
  onBackToReview,
  onRetryDecision,
}: {
  review: PatientReviewProjection;
  appealRecord?: ReviewAppealRecord;
  actorAuthorized?: boolean;
  submitState?: ReviewAppealSubmitState;
  subject?: string;
  authority?: string;
  initialGrounds?: string;
  supportingEvidence?: AppealEvidenceSummary[];
  onSubmit: (draft: ReviewAppealDraft) => void;
  onBackToReview: () => void;
  onRetryDecision?: () => void;
}) {
  const [grounds, setGrounds] = useState(initialGrounds);
  useEffect(() => setGrounds(initialGrounds), [initialGrounds]);

  const decisionAvailable = review.state === 'RETIRED' && Boolean(review.retirement);
  const appealAllowed = Boolean(review.appealPolicy?.allowed);
  const deadlineIso = review.appealPolicy?.windowEndsAtIso;
  const deadlineExpired = !deadlineIso
    || review.appealPolicy?.windowState === 'lapsed'
    || new Date(deadlineIso).getTime() <= new Date(REVIEW_NOW_ISO).getTime();
  const existingAppeal = appealRecord;
  const canAuthor = decisionAvailable && appealAllowed && actorAuthorized && !deadlineExpired && !existingAppeal;
  const groundsComplete = grounds.trim().length > 0;

  const actions: ActionSpec[] = [];
  if (!decisionAvailable && onRetryDecision) {
    actions.push({
      key: 'retry-decision',
      label: 'إعادة تحميل القرار',
      role: 'primary',
      availability: { status: 'available' },
      onPress: onRetryDecision,
    });
  } else if (canAuthor) {
    actions.push({
      key: 'submit-appeal',
      label: submitState === 'retryable-failure' ? 'إعادة إرسال الاعتراض' : 'تقديم الاعتراض',
      role: 'primary',
      availability: submitState === 'submitting'
        ? { status: 'loading' }
        : groundsComplete
          ? { status: 'available' }
          : { status: 'disabled', reason: 'اكتب أساس الاعتراض قبل الإرسال.' },
      onPress: () => onSubmit({
        grounds: grounds.trim(),
        evidenceIds: supportingEvidence.map((item) => item.id),
      }),
    });
  }
  actions.push({
    key: 'back',
    label: 'العودة إلى تقييمي',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onBackToReview,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="اعتراض على قرار مراجعة"
          title="راجع نطاق الاعتراض قبل أن تكتب"
          description="يمكنك الاعتراض على أساس القرار نفسه، وليس إعادة كتابة تقييمك. نوضح النطاق أولًا حتى لا تبذل جهدًا في طلب لا يستطيع هذا المسار تغييره."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {decisionAvailable ? <DecisionCard review={review} /> : (
          <BlockedCard
            title="لا يمكن بدء الاعتراض قبل عرض القرار."
            body="تعذّر عرض القرار الأصلي وسببه الآن، لذلك أوقفنا نموذج الاعتراض حتى لا ترسل اعتراضًا بلا سياق واضح."
          />
        )}

        {decisionAvailable ? (
          <View
            accessibilityLabel="نطاق الاعتراض"
            style={{
              gap: space('stack-sm'),
              padding: space('inset-md'),
              borderRadius: radius('surface'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('border.subtle'),
              backgroundColor: color('surface.subtle'),
            }}
          >
            <Heading3>ما الذي يمكن لهذا الاعتراض مراجعته؟</Heading3>
            <ScopeRow icon="check-circle" title="الأهلية" detail="هل كان القرار قابلًا للتطبيق على هذه التجربة والطرف المتأثر؟" />
            <ScopeRow icon="check-circle" title="التحقق" detail="هل اعتمد القرار على تحقق صحيح وكافٍ؟" />
            <ScopeRow icon="check-circle" title="الالتزام بالسياسة" detail="هل طُبّقت سياسة النشر والقرار الحاكمة كما يجب؟" />
            <View style={{ height: borderWidth('hairline'), backgroundColor: color('border.subtle') }} />
            <ScopeRow
              icon="no-symbol"
              title="لا يغيّر قيمة التقييم أو نصه"
              detail="إذا كان سبب الاعتراض هو أنك تريد تعديل التقييم نفسه، فهذا المسار لا يحرره ولا يعيد كتابته."
            />
          </View>
        ) : null}

        {decisionAvailable ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: space('inline-sm'),
              padding: space('inset-md'),
              borderRadius: radius('surface'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('border.subtle'),
              backgroundColor: color('surface.default'),
            }}
          >
            <Icon name="scale" color={color('text.secondary')} />
            <View style={{ flex: 1, gap: space('stack-xs') }}>
              <BodyStrong>من يقرر الاعتراض؟</BodyStrong>
              <Body>يصدر القرار من مراجع نزاهة مستقل لم يتخذ القرار الأصلي.</Body>
            </View>
          </View>
        ) : null}

        {decisionAvailable && deadlineIso ? (
          <DeadlineIndicator
            deadlineIso={deadlineIso}
            obligation="مهلة تقديم الاعتراض"
            nowIso={REVIEW_NOW_ISO}
            state={deadlineExpired ? 'lapsed' : review.appealPolicy?.windowState}
          />
        ) : null}

        {existingAppeal ? <ExistingAppeal appeal={existingAppeal} /> : null}

        {!existingAppeal && decisionAvailable && !appealAllowed ? (
          <BlockedCard
            title="لا يتضمن هذا القرار حق اعتراض من حسابك."
            body="لا نعرض نموذج إرسال عندما لا تمنح السياسة لهذا الطرف حق الاعتراض. يبقى القرار وسببه ظاهرين للقراءة."
          />
        ) : null}

        {!existingAppeal && decisionAvailable && appealAllowed && !actorAuthorized ? (
          <BlockedCard
            title="لا تملك صلاحية تقديم هذا الاعتراض."
            body="يمكن للمريض الذي كتب التقييم، أو وليّه ضمن نطاق تمثيل فعّال، تقديم الاعتراض. تغيير المريض المعروض لا يمنح هذه الصلاحية."
          />
        ) : null}

        {!existingAppeal && decisionAvailable && appealAllowed && actorAuthorized && deadlineExpired ? (
          <BlockedCard
            title="انتهت مهلة تقديم هذا الاعتراض."
            body="انتهاء المهلة ليس خطأ إرسال، وإعادة المحاولة لا تعيد فتح نافذة الاعتراض."
          />
        ) : null}

        {canAuthor ? (
          <View style={{ gap: space('stack-lg') }}>
            {submitState === 'retryable-failure' ? (
              <BlockedCard
                title="تعذّر تأكيد إرسال الاعتراض."
                body="احتفظنا بما كتبته. أعد الإرسال من هنا؛ إعادة المحاولة تستخدم محاولة الإرسال نفسها بدل إنشاء اعتراض جديد."
              />
            ) : null}

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>أساس اعتراضك</Heading3>
              <ValidationField
                label="اشرح سبب الاعتراض"
                value={grounds}
                onChangeText={setGrounds}
                helper="اشرح ما تعتقد أنه يحتاج مراجعة في الأهلية أو التحقق أو تطبيق السياسة. لا تطلب تعديل نص التقييم من هذا الحقل."
                placeholder="اكتب أساس الاعتراض"
                maxLength={1200}
                multiline
                numberOfLines={6}
                autoFocus
              />
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
              <BodyStrong>مستندات داعمة</BodyStrong>
              {supportingEvidence.length > 0 ? supportingEvidence.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}>
                  <Icon name="document-check" color={color('text.secondary')} />
                  <Body>{item.label}</Body>
                </View>
              )) : (
                <Helper>لا توجد مستندات مرفقة. المستندات اختيارية في هذا الاعتراض، ويمكن إرسال الأساس النصي وحده.</Helper>
              )}
            </View>
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
