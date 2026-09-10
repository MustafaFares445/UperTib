import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { PriceDisplay } from '../components/PriceDisplay';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { ValidationField } from '../components/ValidationField';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { CLAIMS_NOW_ISO, type RefundEntitlementProjection, type RefundRequestDraft } from '../mocks/claims';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type RefundRequestSubmitState = 'editing' | 'submitting' | 'retryable-failure';

function StatusState({ title, body }: { title: string; body: string }) {
  return (
    <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
      <BodyStrong>{title}</BodyStrong>
      <Body>{body}</Body>
    </View>
  );
}

/** SCR-CLAIMS-002 — patient refund request against one immutable accepted-terms snapshot. */
export function RefundRequestScreen({
  entitlement,
  submitState = 'editing',
  subject = 'طلب استرداد',
  authority,
  initialRequestedAmount = '',
  initialReason = '',
  initialOccurrenceContext = '',
  onSubmit,
  onCancel,
  onSupplyEvidence,
}: {
  entitlement: RefundEntitlementProjection;
  submitState?: RefundRequestSubmitState;
  subject?: string;
  authority?: string;
  initialRequestedAmount?: string;
  initialReason?: string;
  initialOccurrenceContext?: string;
  onSubmit: (draft: RefundRequestDraft) => void;
  onCancel: () => void;
  onSupplyEvidence?: () => void;
}) {
  const [requestedAmount, setRequestedAmount] = useState(initialRequestedAmount);
  const [reason, setReason] = useState(initialReason);
  const [occurrenceContext, setOccurrenceContext] = useState(initialOccurrenceContext);
  const [attempted, setAttempted] = useState(false);
  useEffect(() => setRequestedAmount(initialRequestedAmount), [initialRequestedAmount]);
  useEffect(() => setReason(initialReason), [initialReason]);
  useEffect(() => setOccurrenceContext(initialOccurrenceContext), [initialOccurrenceContext]);

  const expired = entitlement.requestWindowState === 'lapsed'
    || new Date(entitlement.requestWindowEndsAtIso).getTime() <= new Date(CLAIMS_NOW_ISO).getTime();
  const missingEvidence = entitlement.requiredEvidence.filter((item) => !item.satisfied);
  const amountNumber = Number(requestedAmount.replace(/,/g, '').trim());
  const amountError = requestedAmount.trim().length === 0
    ? attempted ? 'أدخل المبلغ المطلوب.' : undefined
    : !Number.isFinite(amountNumber) || amountNumber <= 0
      ? 'أدخل مبلغًا صالحًا أكبر من صفر.'
      : amountNumber > entitlement.maxRequestedAmount
        ? 'المبلغ يتجاوز الحد المتاح وفق الشروط المقبولة لهذا الطلب.'
        : undefined;
  const reasonError = attempted && reason.trim().length === 0 ? 'اكتب سبب طلب الاسترداد قبل الإرسال.' : undefined;
  const canAuthor = entitlement.snapshotAvailable && entitlement.eligible && !expired;
  const fieldsComplete = requestedAmount.trim().length > 0 && reason.trim().length > 0 && !amountError;
  const canSubmit = canAuthor && fieldsComplete && missingEvidence.length === 0;

  const actions: ActionSpec[] = [];
  if (canAuthor) {
    actions.push({
      key: 'submit',
      label: submitState === 'retryable-failure' ? 'إعادة إرسال الطلب' : 'تقديم طلب الاسترداد',
      role: 'primary',
      availability: submitState === 'submitting'
        ? { status: 'loading' }
        : missingEvidence.length > 0
          ? { status: 'disabled', reason: `أكمل المتطلب: ${missingEvidence[0].label}` }
          : { status: 'available' },
      onPress: () => {
        setAttempted(true);
        if (!canSubmit) return;
        onSubmit({
          requestedAmount: requestedAmount.trim(),
          reason: reason.trim(),
          occurrenceContext: occurrenceContext.trim(),
          evidenceIds: entitlement.requiredEvidence.filter((item) => item.satisfied).map((item) => item.id),
        });
      },
    });
  }
  if (canAuthor && missingEvidence.length > 0 && onSupplyEvidence) {
    actions.push({ key: 'evidence', label: 'استكمال المستند المطلوب', role: 'secondary', availability: { status: 'available' }, onPress: onSupplyEvidence });
  }
  actions.push({ key: 'cancel', label: 'إلغاء والعودة', role: 'secondary', availability: { status: 'available' }, onPress: onCancel });

  const blocked = !entitlement.snapshotAvailable || !entitlement.eligible || expired;
  const blockedCopy = !entitlement.snapshotAvailable
    ? { title: 'لا يمكن عرض الشروط الحاكمة الآن.', body: 'أوقفنا نموذج الإرسال لأن تقديم طلب من دون قراءة الشروط المالية التي تحكمه قد ينتج طلبًا غير صحيح. أعد المحاولة بعد توفر السجل.' }
    : !entitlement.eligible
      ? { title: 'هذه الحالة غير مؤهلة لطلب استرداد جديد.', body: 'الأهلية يحددها السجل والسياسة الحاكمان لهذه الحالة. لا نعرض نموذجًا سيُرفض بعد أن تبذل جهدًا في تعبئته.' }
      : { title: 'انتهت مهلة طلب الاسترداد.', body: 'انتهاء المهلة ليس فشل إرسال، وإعادة المحاولة لا تعيد فتحها. يبقى سجل الحالة متاحًا للقراءة.' };

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="طلب استرداد" title={blocked ? 'حالة طلب الاسترداد' : 'راجع الشروط أولًا، ثم اكتب طلبك'} />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
          <Helper>الاستحقاق الذي يحكم هذا الطلب</Helper>
          <BodyStrong>{entitlement.serviceLabel}</BodyStrong>
          <Body>{entitlement.providerName}</Body>
          {entitlement.snapshotAvailable ? (
            <>
              <PriceDisplay price={{ mode: 'fixed', amount: entitlement.maxRequestedAmount, currency: entitlement.currency }} compact />
              <Helper>الحد المتاح وفق {entitlement.governingSnapshotLabel}</Helper>
            </>
          ) : <Helper>تعذّر قراءة لقطة الشروط المقبولة.</Helper>}
        </View>

        {blocked ? (
          <StatusState title={blockedCopy.title} body={blockedCopy.body} />
        ) : (
          <>
            <DeadlineIndicator deadlineIso={entitlement.requestWindowEndsAtIso} obligation="مهلة تقديم طلب الاسترداد" nowIso={CLAIMS_NOW_ISO} state={entitlement.requestWindowState} />
            {submitState === 'retryable-failure' ? <StatusState title="تعذّر تأكيد إرسال الطلب." body="احتفظنا بما أدخلته. إعادة الإرسال تستخدم محاولة الإرسال نفسها بدل إنشاء طلب جديد بالخطأ." /> : null}

            <View style={{ gap: space('stack-lg') }}>
              <Heading3>طلبك</Heading3>
              <ValidationField label="المبلغ المطلوب" value={requestedAmount} onChangeText={setRequestedAmount} error={amountError} keyboardType="number-pad" placeholder="مثال: 50000" />
              <Helper>استخدم العملة نفسها للشروط المقبولة: <Bdi>{entitlement.currency}</Bdi></Helper>
              <ValidationField label="سبب الطلب" value={reason} onChangeText={setReason} error={reasonError} helper="اشرح الواقعة التي تريد مراجعتها باختصار ووضوح." placeholder="اكتب سبب طلب الاسترداد" multiline numberOfLines={5} maxLength={1200} />
              <ValidationField label="سياق إضافي — اختياري" value={occurrenceContext} onChangeText={setOccurrenceContext} helper="أضف وقتًا أو ظرفًا متعلقًا بالواقعة إن كان مفيدًا للمراجعة." placeholder="تفصيل إضافي اختياري" multiline numberOfLines={3} maxLength={600} />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>المستندات المطلوبة</Heading3>
              <BodyStrong>{entitlement.requiredEvidence.length - missingEvidence.length} من {entitlement.requiredEvidence.length} مكتملة</BodyStrong>
              {entitlement.requiredEvidence.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
                  <Icon name={item.satisfied ? 'check-circle' : 'exclamation-triangle'} color={color('text.secondary')} />
                  <View style={{ flex: 1, gap: space('stack-xs') }}>
                    <BodyStrong>{item.label}</BodyStrong>
                    <Helper>{item.satisfied ? 'مستوفى' : 'ما زال مطلوبًا قبل الإرسال'}</Helper>
                  </View>
                </View>
              ))}
            </View>

            <ContextNote
              icon="document-check"
              title="ماذا تعني الموافقة إن صدرت؟"
              body={`تسجّل الموافقة مبلغًا مستحقًا للتنفيذ الخارجي بين الأطراف. UberTib لا يدفع المبلغ، ولا يحتفظ به، ولا ينفذ الاسترداد داخل المنصة. موعد الاستجابة المتوقع: ${formatDateTime(entitlement.responseDeadlineIso)}`}
            />
          </>
        )}
      </Stack>
    </Screen>
  );
}
