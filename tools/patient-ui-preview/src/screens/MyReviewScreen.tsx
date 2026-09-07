import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { REVIEW_NOW_ISO, type PatientReviewProjection } from '../mocks/reviews';
import { borderWidth, color, radius, space } from '../theme/tokens';

const REVIEW_LABEL = { ACTIVE: 'منشور', RETIRED: 'مؤرشَف' } as const;
const APPEAL_LABEL = { SUBMITTED: 'مُقدَّم', DECIDED: 'صدر القرار' } as const;

/** SCR-REVIEWS-003 — the patient's own immutable review projection and governed publication history. */
export function MyReviewScreen({
  review,
  subject = 'تقييمك',
  authority,
  onBackToExperiences,
  onAppeal,
}: {
  review: PatientReviewProjection;
  subject?: string;
  authority?: string;
  onBackToExperiences: () => void;
  onAppeal?: () => void;
}) {
  const actions: ActionSpec[] = [];
  const appeal = review.appealPolicy;
  const appealExpired = appeal?.windowState === 'lapsed'
    || Boolean(appeal?.windowEndsAtIso && new Date(appeal.windowEndsAtIso).getTime() <= new Date(REVIEW_NOW_ISO).getTime());
  const canOfferAppeal = review.state === 'RETIRED' && appeal?.allowed && !review.appeal;

  if (canOfferAppeal && onAppeal) {
    actions.push({
      key: 'appeal',
      label: 'الاعتراض على قرار الأرشفة',
      role: 'primary',
      availability: appealExpired
        ? { status: 'disabled', reason: 'انتهت مهلة الاعتراض لهذا القرار.' }
        : { status: 'available' },
      onPress: onAppeal,
    });
  }
  actions.push({
    key: 'back',
    label: 'العودة إلى تجاربي',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onBackToExperiences,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تقييمي"
          title={review.serviceLabel}
          description="هنا ترى التقييم كما أرسلته وحالته الحالية. لا يمكن تعديل نص التقييم أو قيمته من هذه الصفحة."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm') }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space('inline-sm') }}>
            <Heading3>حالة التقييم</Heading3>
            <StateChip machine="review" status={review.state} label={REVIEW_LABEL[review.state]} />
          </View>
          <Helper>{review.providerName} · {review.branchName} · {review.treatingDentist}</Helper>
          <Helper>أُرسل في {formatDateTime(review.submittedAtIso)}</Helper>
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
          <Helper>التقييم كما أرسلته</Helper>
          <BodyStrong>{review.ratingValue}</BodyStrong>
          <Body>{review.content}</Body>
          <Helper>هذا تقييم تجربة موثّقة، وهو مستقل عن الأهلية العلمية للطبيب ولا يدخل في حسابها.</Helper>
        </View>

        {review.state === 'RETIRED' ? (
          <View
            accessibilityLiveRegion="polite"
            style={{
              gap: space('stack-sm'),
              padding: space('inset-md'),
              borderRadius: radius('surface'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('tone.restricted.border'),
              backgroundColor: color('tone.restricted.fill'),
            }}
          >
            <BodyStrong>لم يعد التقييم منشورًا</BodyStrong>
            {review.retirement ? (
              <>
                <Body>{review.retirement.reason}</Body>
                <Helper>{review.retirement.decidedByLabel} · {formatDateTime(review.retirement.decidedAtIso)}</Helper>
              </>
            ) : (
              <Body>سبب الأرشفة غير متاح حاليًا. يبقى التقييم محفوظًا كسجل تاريخي.</Body>
            )}
          </View>
        ) : null}

        {review.appeal ? (
          <View style={{ gap: space('stack-sm') }}>
            <Heading3>الاعتراض المسجّل</Heading3>
            <StateChip machine="review-appeal" status={review.appeal.state} label={APPEAL_LABEL[review.appeal.state]} />
            <Helper>قُدّم في {formatDateTime(review.appeal.submittedAtIso)}</Helper>
            {review.appeal.state === 'DECIDED' && review.appeal.decisionReason ? <Body>{review.appeal.decisionReason}</Body> : null}
          </View>
        ) : null}

        {canOfferAppeal && appeal?.windowEndsAtIso ? (
          <View style={{ gap: space('stack-xs') }}>
            <Heading3>مهلة الاعتراض</Heading3>
            <DeadlineIndicator
              deadlineIso={appeal.windowEndsAtIso}
              obligation="مهلة الاعتراض على قرار الأرشفة"
              nowIso={REVIEW_NOW_ISO}
              state={appealExpired ? 'lapsed' : appeal.windowState}
            />
            <Helper>إذا كانت المهلة مفتوحة والسياسة تمنحك هذا الحق، يمكنك الاعتراض على أساس القرار دون تعديل نص تقييمك الأصلي.</Helper>
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
