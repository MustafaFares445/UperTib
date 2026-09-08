import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { ExperienceRatingField } from '../components/ExperienceRatingField';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { REVIEW_NOW_ISO, type ReviewSubmissionDraft, type ReviewableExperienceProjection } from '../mocks/reviews';
import type { ReviewRatingValue } from '../reviews/rating';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type SubmitReviewState = 'editing' | 'submitting' | 'window-expired' | 'active-review-exists' | 'not-verified';

function BlockedMessage({ state }: { state: Exclude<SubmitReviewState, 'editing' | 'submitting'> }) {
  const copy = {
    'window-expired': { title: 'انتهت مهلة كتابة هذا التقييم.', body: 'انتهاء المهلة ليس خطأ إرسال، وإعادة المحاولة لا تعيد فتح نافذة التقييم.' },
    'active-review-exists': { title: 'يوجد تقييم نشط لهذه التجربة بالفعل.', body: 'لا ننشئ تقييمًا نشطًا ثانيًا للتجربة نفسها. يمكنك الرجوع إلى تقييمك الموجود.' },
    'not-verified': { title: 'هذه التجربة ليست متاحة للتقييم الآن.', body: 'يلزم أن تكون التجربة مكتملة وموثّقة قبل أن يقبل النظام تقييمًا مرتبطًا بها.' },
  }[state];
  return <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('tone.warning.border'), backgroundColor: color('tone.warning.fill') }}><BodyStrong>{copy.title}</BodyStrong><Body>{copy.body}</Body></View>;
}

/** SCR-REVIEWS-002 — submit one review tied to one verified completed experience. */
export function SubmitReviewScreen({ experience, state = 'editing', subject = 'تقييم تجربتك', authority, initialRating, initialContent = '', onSubmit, onCancel, onOpenExistingReview }: {
  experience: ReviewableExperienceProjection; state?: SubmitReviewState; subject?: string; authority?: string; initialRating?: ReviewRatingValue; initialContent?: string;
  onSubmit: (draft: ReviewSubmissionDraft) => void; onCancel: () => void; onOpenExistingReview?: () => void;
}) {
  const [ratingValue, setRatingValue] = useState<ReviewRatingValue | null>(initialRating ?? null);
  const [content, setContent] = useState(initialContent);
  const ratingComplete = ratingValue !== null;
  const windowExpired = experience.reviewWindowState === 'lapsed' || new Date(experience.reviewWindowEndsAtIso).getTime() <= new Date(REVIEW_NOW_ISO).getTime();
  const effectiveState: SubmitReviewState = state === 'editing' && !experience.verifiedCompleted ? 'not-verified' : state === 'editing' && windowExpired ? 'window-expired' : state;
  const domainReady = effectiveState === 'editing';
  const submit: ActionSpec = {
    key: 'submit-review',
    label: 'إرسال التقييم',
    role: 'primary',
    availability: effectiveState === 'submitting'
      ? { status: 'loading' }
      : domainReady && ratingComplete
        ? { status: 'available' }
        : { status: 'disabled', reason: effectiveState === 'editing' ? 'اختر تقييمًا من نجمة إلى خمس نجوم قبل الإرسال.' : 'لا يمكن إرسال تقييم جديد في الحالة الحالية.' },
    onPress: () => {
      if (ratingValue === null) return;
      const trimmedContent = content.trim();
      onSubmit({ ratingValue, ...(trimmedContent ? { content: trimmedContent } : {}) });
    },
  };
  const actions: ActionSpec[] = [];
  if (effectiveState === 'active-review-exists' && onOpenExistingReview) actions.push({ key: 'open-existing', label: 'عرض تقييمي الموجود', role: 'primary', availability: { status: 'available' }, onPress: onOpenExistingReview });
  else if (effectiveState === 'editing' || effectiveState === 'submitting') actions.push(submit);
  actions.push({ key: 'cancel', label: 'إلغاء', role: 'secondary', availability: { status: 'available' }, onPress: onCancel });
  const blocked = effectiveState === 'window-expired' || effectiveState === 'active-review-exists' || effectiveState === 'not-verified';

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="تقييم موثّق" title="قيّم تجربتك في الزيارة" description="هذا التقييم مرتبط بتجربة علاجية مكتملة وموثّقة، ويقيس تجربتك في الزيارة فقط. لا يقيّم الكفاءة الطبية ولا يغيّر أهلية الطبيب العلمية." />
        <SubjectContextHeader subject={subject} authority={authority} />
        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Helper>التجربة التي ستقيّمها</Helper><BodyStrong>{experience.serviceLabel}</BodyStrong><Body>{experience.providerName}</Body><Helper>{experience.branchName} · {experience.treatingDentist}</Helper><Helper>اكتملت وجرى توثيقها: {formatDateTime(experience.completedAtIso)}</Helper>
        </View>
        <DeadlineIndicator deadlineIso={experience.reviewWindowEndsAtIso} obligation="مهلة إرسال هذا التقييم" nowIso={REVIEW_NOW_ISO} state={windowExpired ? 'lapsed' : experience.reviewWindowState} />
        {blocked ? <BlockedMessage state={effectiveState} /> : (
          <View style={{ gap: space('stack-lg') }}>
            <ExperienceRatingField value={ratingValue} onChange={setRatingValue} disabled={effectiveState === 'submitting'} />
            <ValidationField
              label="ملاحظات إضافية (اختياري)"
              value={content}
              onChangeText={setContent}
              helper="اختياري — شارك ما يفيد الآخرين عن تجربتك الفعلية."
              placeholder="اكتب ملاحظاتك إن رغبت"
              maxLength={1000}
              multiline
              numberOfLines={5}
            />
          </View>
        )}
      </Stack>
    </Screen>
  );
}
