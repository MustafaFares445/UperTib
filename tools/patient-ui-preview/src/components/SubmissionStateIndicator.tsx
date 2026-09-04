import { View } from 'react-native';
import { Body } from '../foundations/Text';
import { chipVisual, space } from '../theme/tokens';

export type SubmissionStatus = 'pending' | 'failed' | 'retrying' | 'completed';

const COPY: Record<SubmissionStatus, string> = {
  pending: 'جارٍ الإرسال…',
  retrying: 'جارٍ إعادة المحاولة…',
  failed: 'تعذر الإرسال. لم يُعرف ما إذا وصل الطلب أم لا.',
  completed: 'تم الإرسال بنجاح.',
};

/**
 * CMP-PLATFORM-011 — Submission state indicator. The visible face of the idempotency contract:
 * pending, failed, retrying, completed — never an optimistic guess at the outcome.
 */
export function SubmissionStateIndicator({ status }: { status: SubmissionStatus }) {
  const tone = status === 'completed' ? 'success' : status === 'failed' ? 'warning' : 'info';
  const visual = chipVisual(tone, 'subtle');
  return (
    <View
      accessible
      accessibilityLiveRegion="polite"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space('inline-xs'),
        paddingHorizontal: space('inset-sm'),
        paddingVertical: space('inset-xs'),
        backgroundColor: visual.background,
      }}
    >
      <Body style={{ color: visual.text }}>{COPY[status]}</Body>
    </View>
  );
}
