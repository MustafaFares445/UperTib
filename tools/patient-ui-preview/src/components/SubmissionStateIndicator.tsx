import { View } from 'react-native';
import { Icon, type IconName } from '../foundations/Icon';
import { Body } from '../foundations/Text';
import { borderWidth, chipVisual, radius, space } from '../theme/tokens';

export type SubmissionStatus = 'pending' | 'failed' | 'retrying' | 'completed';

const COPY: Record<SubmissionStatus, string> = {
  pending: 'جارٍ الإرسال…',
  retrying: 'جارٍ إعادة المحاولة…',
  failed: 'تعذر الإرسال. لم يُعرف ما إذا وصل الطلب أم لا.',
  completed: 'تم الإرسال بنجاح.',
};

const ICON: Record<SubmissionStatus, IconName> = {
  pending: 'clock',
  retrying: 'arrow-path',
  failed: 'exclamation-triangle',
  completed: 'check-circle',
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
        padding: space('inset-sm'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: visual.border,
        backgroundColor: visual.background,
      }}
    >
      <Icon name={ICON[status]} color={visual.icon} scale="sm" />
      <Body style={{ color: visual.text }}>{COPY[status]}</Body>
    </View>
  );
}
