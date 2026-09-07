import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { REVIEW_NOW_ISO, type ReviewSubmissionDraft, type ReviewableExperienceProjection } from '../mocks/reviews';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { useState } from 'react';

export type SubmitReviewState =
  | 'editing'
  | 'submitting'
  | 'window-expired'
  | 'active-review-exists'
  | 'not-verified';

function BlockedMessage({ state }: { state: Exclude<SubmitReviewState, 'editing' | 'submitting'> }) {
  const copy = {
    'window-expired': {
      title: 'انتهت مهلة كتابة هذا التقييم.',
      body: 'انتهاء المهلة ليس خطأ إرسال، وإعادة المحاولة لا تعيد فتح نافذة التقييم.',
    },
    'active-review-exists': {
      title: 'يوجد تقييم نشط لهذه التجربة بالفعل.',
      body: 'لا ننشئ تقييمًا نشطًا ثانيًا للتجربة نفسها. يمكنك الرجوع إلى تقييمك الموجود.',
    },
    'not-verified': {
      title: 'هذه التجربة ليست متاحة للتقييم الآن.',
      body: 'يلزم أن تكون التجربة مكتملة وموثّقة قبل أن يقبل النظام تقييمًا مرتبطًا بها.',
    },
  }[state];

  return (
    <View
      accessibilityRole="alert"
      style={{
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('tone.warning.border'),
        backgroundColor: color('tone.warning.fill'),
      }}
    >
      <BodyStrong>{copy.title}</BodyStrong>
      <Body>{copy.body}</Body>
    </View>
  );
}

/** SCR-REVIEWS-002 — submit one review tied to one verified completed experience. */
export function SubmitReviewScreen({
  experience,
  state = 'editing',
  subject = 'تقييم تجربتك',
  authority,
  initialRating = '',
  initialContent = '',
  onSubmit,
  onCancel,
  onOpenExistingReview,
}: {
  experience: ReviewableExperienceProjection;
  state?: SubmitReviewState;
  subject?: string;
  authority?: string;
  initialRating?: string;
  initialContent?: string;
  onSubmit: (draft: ReviewSubmissionDraft) => void;
  onCancel: () => void;
  onOpenExistingReview?: () => void;
}) {
  const [ratingValue, setRatingValue] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const ratingMissing = state === 'editing' && ratingValue.trim().length === 0;
  const contentMissing = state === 'editing' && content.trim().length === 0;
  const fieldsComplete = ratingValue.trim().length > 0 && content.trim().length > 0;
  const domainReady = state === 'editing' && experience.verifiedCompleted && experience.reviewWindowState !== 'lapsed';

  const submit: ActionSpec = {
    key: 'submit-review',
    label: 'إرسال التقييم',
    role: 'primary',
    availability: state === 'submitting'
      ? { status: 'loading' }
      : domainReady && fieldsComplete
        ? { status: 'available' }
        : { status: 'disabled', reason: state === 'editing' ? 'أكمل التقييم والنص قبل الإرسال.' : 'لا يمكن إرسال تقييم جديد في الحالة الحالية.' },
    onPress: () => onSubmit({ ratingValue: ratingValue.trim(), content: content.trim() }),
  };

  const actions: ActionSpec[] = [];
  if (state === 'active-review-exists' && onOpenExistingReview) {
    actions.push({
      key: 'open-existing',
      label: 'عرض تقييمي الموجود',
      role: 'primary',
      availability: { status: 'available' },
      onPress: onOpenExistingReview,
    });
  } else if (state === 'editing' || state === 'submitting') {
    actions.push(submit);
  }
  actions.push({ key: 'cancel', label: 'إلغاء', role: 'secondary', availability: { status: 'available' }, onPress: onCancel });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تقييم موثّق"
          title="اكتب تقييمك عن هذه التجربة"
          description="هذا التقييم مرتبط بتجربة علاجية مكتملة وموثّقة. تقييم التجربة مستقل عن أهلية الطبيب العلمية ولا يغيّرها."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View
          style={{
            gap: space('stack-sm'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Helper>التجربة التي ستقيّمها</Helper>
          <BodyStrong>{experience.serviceLabel}</BodyStrong>
          <Body>{experience.providerName}</Body>
          <Helper>{experience.branchName} · {experience.treatingDentist}</Helper>
          <Helper>اكتملت وجرى توثيقها: {formatDateTime(experience.completedAtIso)}</Helper>
        </View>

        <DeadlineIndicator
          deadlineIso={experience.reviewWindowEndsAtIso}
          obligation="مهلة إرسال هذا التقييم"
          nowIso={REVIEW_NOW_ISO}
          state={experience.reviewWindowState}
        />

        {state === 'window-expired' || state === 'active-review-exists' || state === 'not-verified' ? (
          <BlockedMessage state={state} />
        ) : (
          <View style={{ gap: space('stack-lg') }}>
            <View style={{ gap: space('stack-sm') }}>
              <Heading3>تقييمك</Heading3>
              <ValidationField
                label="التقييم"
                value={ratingValue}
                onChangeText={setRatingValue}
                helper="قيمة التقييم تتبع سياسة المنتج لهذه التجربة؛ هذه المعاينة لا تفترض مقياسًا رقميًا محددًا."
                error={ratingMissing ? 'أدخل قيمة التقييم المطلوبة.' : undefined}
                placeholder="أدخل تقييمك"
                maxLength={40}
                autoFocus
              />
              <ValidationField
                label="اكتب تجربتك"
                value={content}
                onChangeText={setContent}
                helper="اكتب ما يفيد الآخرين عن تجربتك الفعلية. هذا النص لا يغيّر الأهلية العلمية أو تصنيف الطبيب."
                error={contentMissing ? 'اكتب نص التقييم قبل الإرسال.' : undefined}
                placeholder="صف تجربتك"
                maxLength={1000}
                multiline
                numberOfLines={5}
              />
            </View>

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.subtle'),
                backgroundColor: color('surface.default'),
              }}
            >
              <BodyStrong>قبل الإرسال</BodyStrong>
              <Body>سينشئ الإرسال تقييمًا واحدًا مرتبطًا بهذه التجربة الموثّقة. لا يستخدم UberTib تقييمك لتغيير الأهلية العلمية للطبيب.</Body>
            </View>
          </View>
        )}
      </Stack>
    </Screen>
  );
}
