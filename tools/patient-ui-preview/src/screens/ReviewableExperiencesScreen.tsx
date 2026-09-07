import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EmptyState } from '../components/EmptyState';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientReviewProjection, ReviewableExperienceProjection } from '../mocks/reviews';
import { REVIEW_NOW_ISO } from '../mocks/reviews';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

const REVIEW_LABEL = {
  ACTIVE: 'منشور',
  RETIRED: 'مؤرشَف',
} as const;

function ReviewableCard({
  experience,
  onWriteReview,
}: {
  experience: ReviewableExperienceProjection;
  onWriteReview: () => void;
}) {
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
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{experience.serviceLabel}</BodyStrong>
        <Body>{experience.providerName}</Body>
        <Helper>{experience.branchName} · {experience.treatingDentist}</Helper>
        <Helper>اكتملت التجربة الموثّقة: {formatDateTime(experience.completedAtIso)}</Helper>
      </View>

      <DeadlineIndicator
        deadlineIso={experience.reviewWindowEndsAtIso}
        obligation="مهلة كتابة التقييم"
        nowIso={REVIEW_NOW_ISO}
        state={experience.reviewWindowState}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`اكتب تقييمًا لتجربة ${experience.serviceLabel}`}
        onPress={onWriteReview}
        style={({ pressed }) => ({
          minHeight: size('target-primary'),
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: space('inset-md'),
          borderRadius: radius('control'),
          backgroundColor: pressed ? color('action.primary-hover') : color('action.primary'),
        })}
      >
        <BodyStrong style={{ color: color('text.on-action') }}>اكتب تقييمًا</BodyStrong>
      </Pressable>
    </View>
  );
}

function ExistingReviewCard({
  review,
  onOpen,
}: {
  review: PatientReviewProjection;
  onOpen?: () => void;
}) {
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
        <View style={{ gap: space('stack-xs'), flexShrink: 1 }}>
          <BodyStrong>{review.serviceLabel}</BodyStrong>
          <Helper>{review.providerName} · {review.branchName}</Helper>
        </View>
        <StateChip machine="review" status={review.state} label={REVIEW_LABEL[review.state]} />
      </View>
      <Helper>أرسلته في {formatDateTime(review.submittedAtIso)}</Helper>
      {onOpen ? (
        <Pressable
          accessibilityRole="button"
          onPress={onOpen}
          style={({ pressed }) => ({
            minHeight: size('target-secondary'),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: space('inset-md'),
            borderRadius: radius('control'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('action.secondary-border'),
            backgroundColor: pressed ? color('action.secondary-hover') : color('action.secondary-surface'),
          })}
        >
          <BodyStrong style={{ color: color('action.secondary-text') }}>عرض تقييمي</BodyStrong>
        </Pressable>
      ) : null}
    </View>
  );
}

/** SCR-REVIEWS-001 — structurally scoped list of verified completed experiences that can be reviewed. */
export function ReviewableExperiencesScreen({
  reviewable,
  existingReviews = [],
  subject = 'تجاربك العلاجية',
  authority,
  onWriteReview,
  onOpenReview,
  onBackToCase,
}: {
  reviewable: ReviewableExperienceProjection[];
  existingReviews?: PatientReviewProjection[];
  subject?: string;
  authority?: string;
  onWriteReview: (experience: ReviewableExperienceProjection) => void;
  onOpenReview?: (review: PatientReviewProjection) => void;
  onBackToCase?: () => void;
}) {
  return (
    <Screen
      footer={onBackToCase ? (
        <ActionBar actions={[{
          key: 'back',
          label: 'العودة إلى الحالة',
          role: 'secondary',
          availability: { status: 'available' },
          onPress: onBackToCase,
        }]} />
      ) : undefined}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="التقييمات الموثّقة"
          title="تجارب يمكنك تقييمها"
          description="نعرض هنا فقط تجربة مكتملة ومتحققًا من ارتباطها بك وما زالت ضمن مهلة التقييم. تقييمك يصف تجربتك ولا يغيّر الأهلية العلمية للطبيب."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>متاحة لكتابة تقييم</Heading3>
          {reviewable.length > 0 ? (
            <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
              {reviewable.map((experience) => (
                <View key={experience.id} role="listitem">
                  <ReviewableCard experience={experience} onWriteReview={() => onWriteReview(experience)} />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              variant="no-data"
              icon="check-circle"
              statement="لا توجد تجربة متاحة للتقييم الآن."
              reason="التجربة التي سبق تقييمها، أو التي لم يثبت اكتمالها، أو انتهت مهلة تقييمها لا تظهر كفرصة جديدة للتقييم."
            />
          )}
        </View>

        {existingReviews.length > 0 ? (
          <View style={{ gap: space('stack-sm') }}>
            <Heading3>تقييماتي السابقة</Heading3>
            <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
              {existingReviews.map((review) => (
                <View key={review.id} role="listitem">
                  <ExistingReviewCard review={review} onOpen={onOpenReview ? () => onOpenReview(review) : undefined} />
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
