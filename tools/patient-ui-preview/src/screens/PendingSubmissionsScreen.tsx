import { ActionBar } from '../components/ActionBar';
import { EmptyState } from '../components/EmptyState';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { PendingSubmissionProjection } from '../mocks/platform';
import { SubmissionReconciliationPanel } from '../widgets/SubmissionReconciliationPanel';

export type PendingSubmissionsScreenState =
  | 'success'
  | 'empty-no-data'
  | 'partial'
  | 'stale'
  | 'error-fetch'
  | 'error-permission'
  | 'offline';

export interface PendingSubmissionsScreenProps {
  entries: PendingSubmissionProjection[];
  state?: PendingSubmissionsScreenState;
  subject?: string;
  authority?: string;
  asOfIso?: string;
  onRefresh?: () => void;
  onReconcile?: (entry: PendingSubmissionProjection) => void;
  onRetry?: (entry: PendingSubmissionProjection) => void;
  onOpenResolved?: (entry: PendingSubmissionProjection) => void;
  onDiscard?: (entry: PendingSubmissionProjection) => void;
}

/** SCR-PLATFORM-002 — durable reconciliation home for mutations whose outcome was not known locally. */
export function PendingSubmissionsScreen({
  entries,
  state = 'success',
  subject = 'طلباتك المعلّقة',
  authority,
  asOfIso,
  onRefresh,
  onReconcile,
  onRetry,
  onOpenResolved,
  onDiscard,
}: PendingSubmissionsScreenProps) {
  const refreshAction = onRefresh
    ? {
        key: 'refresh',
        label: 'تحديث القراءة',
        role: 'secondary' as const,
        availability: { status: 'available' as const },
        onPress: onRefresh,
      }
    : undefined;
  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const empty = state === 'empty-no-data' || (state === 'success' && entries.length === 0);
  const staleOrOffline = state === 'stale' || state === 'offline';

  return (
    <Screen footer={refreshAction && !permissionDenied ? <ActionBar actions={[refreshAction]} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="استعادة الطلبات"
          title="الطلبات المعلّقة"
          description="إذا انقطع الاتصال بعد الإرسال، نتحقق أولًا من السجل الموثوق. لا نعتبر النتيجة فشلًا ولا ننشئ طلبًا ثانيًا بالحدس."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك قراءة هذه الطلبات ضمن الصلاحية الحالية."
            guidance="الطلبات لا تُعرض ولا تُعاد محاولتها خارج نطاق الشخص الذي أُنشئت له."
          />
        ) : fetchFailed ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر التحقق من الطلبات المعلّقة."
            stillTrue="لا يعني ذلك أن الطلبات فشلت أو اختفت. تبقى حالتها غير محسومة حتى تنجح القراءة الموثوقة."
            guidance="أعد التحقق قبل تنفيذ أي طلب جديد من نفس النوع."
            action={refreshAction}
          />
        ) : empty ? (
          <EmptyState
            variant="no-data"
            icon="check-circle"
            statement="لا توجد طلبات تنتظر التحقق."
            reason="كل طلب سابق معروف النتيجة، لذلك لا يوجد شيء تحتاج لمصالحته الآن."
          />
        ) : (
          <Stack gap="stack-md">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'الاتصال غير متاح الآن.' : 'قد تكون نتائج المصالحة قديمة.'}
                stillTrue="تبقى النتائج غير المحسومة ظاهرة ولا تتحول إلى فشل بسبب ضعف الاتصال."
                asOf={asOfIso ? `آخر قراءة: ${formatDateTime(asOfIso)}` : undefined}
                guidance="تُسحب أوامر الإعادة حتى تعود القراءة الموثوقة، إلا إذا كان الاستئناف الآمن متاحًا لنفس النية."
                action={refreshAction}
              />
            ) : state === 'partial' ? (
              <RecoveryState
                variant="fetch-failure"
                whatFailed="اكتملت مصالحة بعض الطلبات فقط."
                stillTrue="العناصر الظاهرة صحيحة بقدر آخر قراءة لها، لكن القائمة ليست نتيجة مكتملة."
                guidance="أعد القراءة لمصادر النتائج التي لم تستجب."
                action={refreshAction}
              />
            ) : null}

            <SubmissionReconciliationPanel
              entries={entries}
              onReconcile={staleOrOffline ? undefined : onReconcile}
              onRetry={staleOrOffline ? undefined : onRetry}
              onOpenResolved={onOpenResolved}
              onDiscard={staleOrOffline ? undefined : onDiscard}
            />
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
