import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { RecoveryState } from '../components/RecoveryState';
import { SubmissionStateIndicator, type SubmissionStatus } from '../components/SubmissionStateIndicator';
import { formatDateTime } from '../foundations/format';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { PendingSubmissionProjection } from '../mocks/platform';
import { borderWidth, color, radius, space } from '../theme/tokens';

export interface SubmissionReconciliationPanelProps {
  entries: PendingSubmissionProjection[];
  onReconcile?: (entry: PendingSubmissionProjection) => void;
  onRetry?: (entry: PendingSubmissionProjection) => void;
  onOpenResolved?: (entry: PendingSubmissionProjection) => void;
  onDiscard?: (entry: PendingSubmissionProjection) => void;
}

function submissionStatus(entry: PendingSubmissionProjection): SubmissionStatus {
  switch (entry.reconciliationState) {
    case 'committed':
      return 'completed';
    case 'not-committed':
      return 'failed';
    case 'retrying':
      return 'retrying';
    case 'unknown':
    default:
      return 'pending';
  }
}

function SubmissionRow({
  entry,
  onReconcile,
  onRetry,
  onOpenResolved,
  onDiscard,
}: SubmissionReconciliationPanelProps & { entry: PendingSubmissionProjection }) {
  const actions: ActionSpec[] = [];

  if (entry.reconciliationState === 'not-committed' && !entry.retryConflict && onRetry) {
    actions.push({
      key: 'retry',
      label: 'إعادة المحاولة بأمان',
      role: 'primary',
      availability: { status: 'available' },
      onPress: () => onRetry(entry),
    });
  }
  if (entry.reconciliationState === 'committed' && entry.resolvedRecord && onOpenResolved) {
    actions.push({
      key: 'open',
      label: 'فتح السجل الملتزم',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: () => onOpenResolved(entry),
    });
  }
  if (entry.reconciliationState === 'not-committed' && !entry.retryConflict && onDiscard) {
    actions.push({
      key: 'discard',
      label: 'حذف هذه المحاولة المحلية',
      role: 'destructive',
      availability: { status: 'available' },
      onPress: () => onDiscard(entry),
    });
  }

  return (
    <View
      accessible
      accessibilityLabel={`${entry.intentLabel}. أُرسل في ${formatDateTime(entry.createdAtIso)}.`}
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
        <BodyStrong>{entry.intentLabel}</BodyStrong>
        <Helper>بدأ الطلب: {formatDateTime(entry.createdAtIso)}</Helper>
        <Helper>آخر تحقق موثوق: {formatDateTime(entry.asOfIso)}</Helper>
        {entry.subjectLabel ? <Helper>يخص: {entry.subjectLabel}</Helper> : null}
      </View>

      <SubmissionStateIndicator status={submissionStatus(entry)} />

      {entry.retryConflict ? (
        <RecoveryState
          variant="not-retryable"
          whatFailed="تعذر تكرار الطلب لأن مفتاح إعادة المحاولة استُخدم لطلب مختلف."
          stillTrue="المحاولة الأصلية لم تُستبدل، ولم ننشئ طلبًا جديدًا تلقائيًا."
          guidance="ارجع إلى النية الأصلية أو ابدأ إجراءً جديدًا فقط إذا كنت تقصد طلبًا مختلفًا فعلًا."
        />
      ) : entry.reconciliationState === 'unknown' ? (
        <RecoveryState
          variant="unknown-outcome"
          whatFailed="لم نتأكد بعد مما إذا كان الطلب قد التزم."
          stillTrue="الطلب يبقى ظاهرًا هنا حتى نقرأ السجل الفعلي. لن نعتبره فشلًا ولن نرسل نسخة ثانية."
          asOf={`آخر تحقق: ${formatDateTime(entry.asOfIso)}`}
          guidance="تحقق من النتيجة عبر قراءة السجل الموثوق قبل أي إعادة محاولة."
          action={onReconcile ? {
            key: 'reconcile',
            label: 'التحقق من النتيجة',
            role: 'secondary',
            availability: { status: 'available' },
            onPress: () => onReconcile(entry),
          } : undefined}
        />
      ) : entry.reconciliationState === 'not-committed' ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>أكدت القراءة الموثوقة أن الطلب لم يلتزم.</BodyStrong>
          <Body tone="secondary">يمكن إعادة نفس النية باستخدام مفتاحها الأصلي، دون إنشاء محاولة مكررة.</Body>
        </View>
      ) : entry.reconciliationState === 'retrying' ? (
        <Body tone="secondary">هذه إعادة لنفس الطلب. لا يوجد طلب ثانٍ موازٍ أثناء انتظار النتيجة.</Body>
      ) : entry.resolvedRecord ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>{entry.resolvedRecord.statusLabel}</BodyStrong>
          <Body tone="secondary">{entry.resolvedRecord.label}</Body>
        </View>
      ) : null}

      {actions.length > 0 ? <ActionBar actions={actions} /> : null}
    </View>
  );
}

/** WGT-PLATFORM-012 — durable queue that reconciles unknown mutation outcomes before any new command. */
export function SubmissionReconciliationPanel(props: SubmissionReconciliationPanelProps) {
  return (
    <View accessibilityRole="list" accessibilityLabel={`الطلبات المعلّقة، ${props.entries.length}`} style={{ gap: space('stack-sm') }}>
      {props.entries.map((entry) => (
        <View key={entry.id} role="listitem">
          <SubmissionRow {...props} entry={entry} />
        </View>
      ))}
    </View>
  );
}
