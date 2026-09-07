import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
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

function StatusCard({ title, body }: { title: string; body: string }) {
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

  useEffect(() => setRequestedAmount(initialRequestedAmount), [initialRequestedAmount]);
  useEffect(() => setReason(initialReason), [initialReason]);
  useEffect(() => setOccurrenceContext(initialOccurrenceContext), [initialOccurrenceContext]);

  const expired = entitlement.requestWindowState === 'lapsed'
    || new Date(entitlement.requestWindowEndsAtIso).getTime() <= new Date(CLAIMS_NOW_ISO).getTime();
  const missingEvidence = entitlement.requiredEvidence.filter((item) => !item.satisfied);
  const amountNumber = Number(requestedAmount.replace(/,/g, '').trim());
  const amountError = requestedAmount.trim() && (!Number.isFinite(amountNumber) || amountNumber <= 0)
    ? 'أدخل مبلغًا صالحًا أكبر من صفر.'
    : amountNumber > entitlement.maxRequestedAmount
      ? 'المبلغ يتجاوز الحد المتاح وفق الشروط المقبولة لهذا الطلب.'
      : undefined;
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
        : canSubmit
          ? { status: 'available' }
          : { status: 'disabled', reason: missingEvidence.length > 0 ? `أكمل المتطلب: ${missingEvidence[0].label}` : 'أكمل المبلغ والسبب قبل الإرسال.' },
      onPress: () => onSubmit({
        requestedAmount: requestedAmount.trim(),
        reason: reason.trim(),
        occurrenceContext: occurrenceContext.trim(),
        evidenceIds: entitlement.requiredEvidence.filter((item) => item.satisfied).map((item) => item.id),
      }),
    });
  }
  if (canAuthor && missingEvidence.length > 0 && onSupplyEvidence) {
    actions.push({
      key: 'evidence',
      label: 'استكمال المستند المطلوب',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onSupplyEvidence,
    });
  }
  actions.push({
    key: 'cancel',
    label: 'إلغاء والعودة',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onCancel,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="طلب استرداد"
          title="راجع الشروط أولًا، ثم اكتب طلبك"
          description="هذا الطلب يُراجع مقابل الشروط المالية التي وافقت عليها لهذه الحالة، وليس مقابل إعدادات حالية قد تكون تغيّرت لاحقًا."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

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
          <Helper>الحالة</Helper>
          <BodyStrong>{entitlement.serviceLabel}</BodyStrong>
          <Body>{entitlement.providerName}</Body>
          <Helper>{entitlement.governingSnapshotLabel}</Helper>
          {entitlement.snapshotAvailable ? (
            <>
              <Helper>الحد المتاح لهذا الطلب حسب الشروط الحاكمة</Helper>
              <PriceDisplay price={{ mode: 'fixed', amount: entitlement.maxRequestedAmount, currency: entitlement.currency }} compact />
            </>
          ) : null}
        </View>

        {!entitlement.snapshotAvailable ? (
          <StatusCard
            title="لا يمكن عرض الشروط الحاكمة الآن."
            body="أوقفنا نموذج الإرسال لأن تقديم طلب من دون قراءة الشروط المالية التي تحكمه قد ينتج طلبًا غير صحيح. أعد المحاولة بعد توفر السجل."
          />
        ) : !entitlement.eligible ? (
          <StatusCard
            title="هذه الحالة غير مؤهلة لطلب استرداد جديد."
            body="الأهلية يحددها السجل والسياسة الحاكمان لهذه الحالة. لا نعرض نموذجًا سيُرفض بعد أن تبذل جهدًا في تعبئته."
          />
        ) : expired ? (
          <StatusCard
            title="انتهت مهلة طلب الاسترداد."
            body="انتهاء المهلة ليس فشل إرسال، وإعادة المحاولة لا تعيد فتحها. يبقى سجل الحالة متاحًا للقراءة."
          />
        ) : null}

        {entitlement.snapshotAvailable && entitlement.eligible ? (
          <DeadlineIndicator
            deadlineIso={entitlement.requestWindowEndsAtIso}
            obligation="مهلة تقديم طلب الاسترداد"
            nowIso={CLAIMS_NOW_ISO}
            state={expired ? 'lapsed' : entitlement.requestWindowState}
          />
        ) : null}

        {canAuthor ? (
          <>
            {submitState === 'retryable-failure' ? (
              <StatusCard
                title="تعذّر تأكيد إرسال الطلب."
                body="احتفظنا بما أدخلته. إعادة الإرسال تستخدم محاولة الإرسال نفسها بدل إنشاء طلب جديد بالخطأ."
              />
            ) : null}

            <View style={{ gap: space('stack-lg') }}>
              <ValidationField
                label="المبلغ المطلوب"
                value={requestedAmount}
                onChangeText={setRequestedAmount}
                helper={undefined}
                error={amountError}
                keyboardType="number-pad"
                placeholder="مثال: 50000"
              />
              <Helper>استخدم العملة نفسها للشروط المقبولة: <Bdi>{entitlement.currency}</Bdi></Helper>
              <ValidationField
                label="سبب الطلب"
                value={reason}
                onChangeText={setReason}
                helper="اشرح الواقعة التي تريد مراجعتها باختصار ووضوح."
                placeholder="اكتب سبب طلب الاسترداد"
                multiline
                numberOfLines={5}
                maxLength={1200}
              />
              <ValidationField
                label="سياق إضافي — اختياري"
                value={occurrenceContext}
                onChangeText={setOccurrenceContext}
                helper="يمكنك إضافة وقت أو ظرف متعلق بالواقعة إن كان مفيدًا للمراجعة."
                placeholder="تفصيل إضافي اختياري"
                multiline
                numberOfLines={3}
                maxLength={600}
              />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>المتطلبات قبل الإرسال</Heading3>
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

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.strong'),
                backgroundColor: color('surface.subtle'),
              }}
            >
              <BodyStrong>ماذا تعني الموافقة إن صدرت؟</BodyStrong>
              <Body>تسجّل الموافقة مبلغًا مستحقًا للتنفيذ الخارجي بين الأطراف. UberTib لا يدفع المبلغ، ولا يحتفظ به، ولا ينفذ الاسترداد داخل المنصة.</Body>
              <Helper>بعد التقديم، يظهر موعد الاستجابة المتوقع في سجل الطلب. الموعد الحالي المتوقع: {formatDateTime(entitlement.responseDeadlineIso)}</Helper>
            </View>
          </>
        ) : null}
      </Stack>
    </Screen>
  );
}
