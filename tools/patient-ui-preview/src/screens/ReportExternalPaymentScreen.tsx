import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { PriceDisplay } from '../components/PriceDisplay';
import { RecoveryState } from '../components/RecoveryState';
import { StateChip } from '../components/StateChip';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { AcceptedFinancialTermsSnapshot, ExternalPaymentReportDraft } from '../mocks/finance';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type ReportExternalPaymentState = 'editing' | 'submitting' | 'submitted' | 'mismatch';

export interface ReportExternalPaymentScreenProps {
  snapshot: AcceptedFinancialTermsSnapshot;
  state?: ReportExternalPaymentState;
  initialAmount?: string;
  initialCurrency?: string;
  initialMethod?: string;
  initialOccurredAt?: string;
  onSubmit: (draft: ExternalPaymentReportDraft) => void;
  onCancel: () => void;
  onOpenTimeline?: () => void;
}

/** SCR-FINANCE-003 — records a Patient assertion about money already moved outside UberTib. */
export function ReportExternalPaymentScreen({
  snapshot,
  state = 'editing',
  initialAmount = '',
  initialCurrency = snapshot.currency,
  initialMethod = '',
  initialOccurredAt = '',
  onSubmit,
  onCancel,
  onOpenTimeline,
}: ReportExternalPaymentScreenProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [currency, setCurrency] = useState(initialCurrency);
  const [method, setMethod] = useState(initialMethod);
  const [occurredAt, setOccurredAt] = useState(initialOccurredAt);
  const [attempted, setAttempted] = useState(false);

  const parsedAmount = Number(amount.replace(/,/g, '').trim());
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const currencyValid = currency.trim().length > 0;
  const methodValid = method.trim().length > 0;
  const occurredAtValid = occurredAt.trim().length > 0;
  const complete = amountValid && currencyValid && methodValid && occurredAtValid;
  const submitting = state === 'submitting';
  const submitted = state === 'submitted';

  const submit = () => {
    setAttempted(true);
    if (!complete) return;
    onSubmit({
      amount: parsedAmount,
      currency: currency.trim(),
      externalMethodCategory: method.trim(),
      occurredAtIso: occurredAt.trim(),
    });
  };

  return (
    <Screen
      footer={submitted ? (
        <ActionBar actions={[{
          key: 'timeline',
          label: 'عرض السجل المالي',
          role: 'primary',
          availability: { status: 'available' },
          onPress: onOpenTimeline ?? onCancel,
        }]} />
      ) : (
        <ActionBar actions={[
          {
            key: 'record',
            label: 'تسجيل هذه الواقعة',
            role: 'primary',
            availability: submitting
              ? { status: 'loading' }
              : complete
                ? { status: 'available' }
                : { status: 'disabled', reason: 'أكمل المبلغ والعملة وطريقة السداد ووقت حدوث الواقعة أولًا.' },
            onPress: submit,
          },
          ...(!submitting ? [{
            key: 'cancel',
            label: 'إلغاء',
            role: 'secondary' as const,
            availability: { status: 'available' as const },
            onPress: onCancel,
          }] : []),
        ]} />
      )}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تسجيل واقعة مالية"
          title={submitted ? 'تم تسجيل الواقعة' : 'سجّل ما دفعته خارج UberTib'}
          description={submitted
            ? 'أضيفت الواقعة إلى السجل بانتظار رد العيادة عليها.'
            : 'هذه الخطوة لا تدفع أي مبلغ. أنت تسجّل واقعة حدثت بينك وبين العيادة خارج المنصة.'}
        />

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
          <Heading3>الشروط التي ترتبط بها الواقعة</Heading3>
          <BodyStrong>{snapshot.serviceLabel} · {snapshot.versionLabel}</BodyStrong>
          <Helper>قُبلت في {formatDateTime(snapshot.acceptedAtIso)}</Helper>
          {snapshot.complete ? (
            <View style={{ gap: space('stack-xs') }}>
              <Helper>الإجمالي المقبول في هذه اللقطة</Helper>
              <PriceDisplay price={{ mode: 'fixed', amount: snapshot.total, currency: snapshot.currency }} compact />
            </View>
          ) : (
            <Body>لا يمكن تسجيل واقعة مالية بينما بيانات الشروط المقبولة غير مكتملة.</Body>
          )}
        </View>

        {submitted ? (
          <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm') }}>
            <StateChip machine="external-financial-event" status="REPORTED_UNCONFIRMED" label="مُبلَّغ عنه — غير مؤكَّد" />
            <BodyStrong>تمت إضافة سجل واحد لهذه المحاولة.</BodyStrong>
            <Body>ستظهر الواقعة الآن في التسلسل المالي، وتبقى غير مؤكدة حتى تسجّل العيادة ردها.</Body>
            <Helper>لا يعني ذلك أن UberTib قبض المبلغ أو حوّله أو سوّاه.</Helper>
          </View>
        ) : (
          <>
            <View style={{ gap: space('stack-md') }}>
              <Heading3>تفاصيل الواقعة الخارجية</Heading3>
              <ValidationField
                label="المبلغ الذي دفعته خارج المنصة"
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                helper="أدخل قيمة الواقعة كما حدثت فعليًا."
                error={attempted && !amountValid ? 'أدخل مبلغًا أكبر من صفر.' : undefined}
                autoFocus
              />
              <ValidationField
                label="العملة"
                value={currency}
                onChangeText={setCurrency}
                helper={`العملة المسجّلة في الشروط المقبولة هي ${snapshot.currency}.`}
                error={attempted && !currencyValid ? 'العملة مطلوبة.' : undefined}
              />
              <ValidationField
                label="طريقة السداد خارج المنصة"
                value={method}
                onChangeText={setMethod}
                helper="صف فئة الطريقة الخارجية فقط؛ لا توجد عملية دفع داخل UberTib."
                error={attempted && !methodValid ? 'طريقة السداد الخارجية مطلوبة.' : undefined}
              />
              <ValidationField
                label="وقت حدوث الواقعة"
                value={occurredAt}
                onChangeText={setOccurredAt}
                helper="أدخل الوقت الذي حدث فيه السداد خارج المنصة."
                error={attempted && !occurredAtValid ? 'وقت حدوث الواقعة مطلوب.' : undefined}
              />
              <Helper>هوية من قام بالسداد تُستمد من حسابك وصلاحيتك الحالية، لذلك لا توجد خانة لاختيار اسم الدافع.</Helper>
            </View>

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('tone.info.border'),
                backgroundColor: color('tone.info.fill'),
              }}
            >
              <BodyStrong>ماذا سيحدث بعد التسجيل؟</BodyStrong>
              <Body>يُنشأ سجل «مُبلَّغ عنه — غير مؤكَّد» وترى العيادة الواقعة لتؤكد دقتها أو تعترض عليها.</Body>
              <Helper>إعادة المحاولة لن تنشئ سجلًا ثانيًا لنفس الأمر المتطابق.</Helper>
            </View>

            {state === 'mismatch' ? (
              <RecoveryState
                variant="not-retryable"
                whatFailed="لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة."
                stillTrue="لم تتم محاولة دفع داخل UberTib، وما أدخلته ما زال ظاهرًا لتراجعه."
                guidance="راجع المبلغ والعملة وبقية تفاصيل الواقعة قبل إنشاء محاولة جديدة."
              />
            ) : null}

            {submitting ? <SubmissionStateIndicator status="pending" /> : null}
          </>
        )}
      </Stack>
    </Screen>
  );
}
