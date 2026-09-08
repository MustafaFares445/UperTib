import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { PriceDisplay } from '../components/PriceDisplay';
import { RecoveryState } from '../components/RecoveryState';
import { StateChip } from '../components/StateChip';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { ApprovedRefundDecisionProjection, ExternalRefundExecutionDraft } from '../mocks/finance';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type ReportRefundExecutionState = 'editing' | 'submitting' | 'submitted' | 'mismatch';

export interface ReportRefundExecutionScreenProps {
  decision?: ApprovedRefundDecisionProjection;
  state?: ReportRefundExecutionState;
  initialAmount?: string;
  initialCurrency?: string;
  initialOccurredAt?: string;
  evidenceIds?: string[];
  evidenceSummary?: string;
  onSubmit: (draft: ExternalRefundExecutionDraft) => void;
  onCancel: () => void;
  onOpenTimeline?: () => void;
}

/** SCR-FINANCE-005 — record-only assertion that an approved refund was executed outside UberTib. */
export function ReportRefundExecutionScreen({
  decision,
  state = 'editing',
  initialAmount = decision ? String(decision.amount) : '',
  initialCurrency = decision?.currency ?? '',
  initialOccurredAt = '',
  evidenceIds = [],
  evidenceSummary,
  onSubmit,
  onCancel,
  onOpenTimeline,
}: ReportRefundExecutionScreenProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [currency, setCurrency] = useState(initialCurrency);
  const [occurredAt, setOccurredAt] = useState(initialOccurredAt);
  const [attempted, setAttempted] = useState(false);

  const parsedAmount = Number(amount.replace(/,/g, '').trim());
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const currencyValid = currency.trim().length > 0;
  const occurredAtValid = occurredAt.trim().length > 0;
  const amountMatches = Boolean(decision && amountValid && parsedAmount === decision.amount);
  const currencyMatches = Boolean(
    decision
      && currencyValid
      && currency.trim().toUpperCase() === decision.currency.trim().toUpperCase(),
  );
  const exactDecisionMatch = amountMatches && currencyMatches;
  const canRecord = Boolean(decision && exactDecisionMatch && occurredAtValid && state !== 'mismatch');
  const submitting = state === 'submitting';
  const submitted = state === 'submitted';

  const recordAvailability: ActionSpec['availability'] = !decision
    ? { status: 'absent', reason: 'لا يوجد قرار استرداد معتمد يمكن ربط واقعة التنفيذ به.' }
    : submitting
      ? { status: 'loading' }
      : state === 'mismatch'
        ? { status: 'disabled', reason: 'لا يمكن تسجيل الواقعة حتى تتطابق مع القرار والسجل الحاليين.' }
        : { status: 'available' };

  const submit = () => {
    setAttempted(true);
    if (!decision || !canRecord) return;
    onSubmit({
      amount: parsedAmount,
      currency: currency.trim(),
      occurredAtIso: occurredAt.trim(),
      evidenceIds: [...evidenceIds],
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
            key: 'record-refund-execution',
            label: 'تسجيل تنفيذ الاسترداد الخارجي',
            role: 'primary',
            availability: recordAvailability,
            onPress: submit,
          },
          ...(!submitting ? [{
            key: 'cancel',
            label: decision ? 'إلغاء' : 'العودة إلى السجل المالي',
            role: 'secondary' as const,
            availability: { status: 'available' as const },
            onPress: onCancel,
          }] : []),
        ]} />
      )}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تنفيذ استرداد خارجي"
          title={submitted ? 'تم تسجيل واقعة التنفيذ' : 'سجّل أن الاسترداد المعتمد نُفّذ خارج UberTib'}
          description={submitted
            ? 'أضيفت الواقعة إلى السجل بانتظار رد الطرف الآخر على دقتها.'
            : 'UberTib لا ينفّذ الاسترداد. هذه الصفحة تسجّل فقط ما حدث بين الأطراف خارج المنصة.'}
        />

        {!decision ? (
          <RecoveryState
            variant="not-retryable"
            whatFailed="لا يوجد قرار استرداد معتمد يمكن تسجيل تنفيذ له."
            stillTrue="لا تُنشأ أي واقعة تنفيذ من دون قرار معتمد يمكن الرجوع إليه."
            guidance="ارجع إلى السجل المالي أو إلى قرار المطالبة عند توفر قرار استرداد معتمد."
          />
        ) : (
          <>
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
              <Heading3>قرار الاسترداد المعتمد</Heading3>
              <BodyStrong>{decision.sourceLabel}</BodyStrong>
              <Helper>اعتمد في {formatDateTime(decision.approvedAtIso)}</Helper>
              <PriceDisplay price={{ mode: 'fixed', amount: decision.amount, currency: decision.currency }} compact />
              <Body>{decision.reasonSummary}</Body>
              <Helper>يجب أن تشير واقعة التنفيذ إلى هذا القرار بالمبلغ والعملة نفسيهما بالكامل.</Helper>
            </View>

            {submitted ? (
              <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm') }}>
                <StateChip machine="external-financial-event" status="REPORTED_UNCONFIRMED" label="مُبلَّغ عنه — غير مؤكَّد" />
                <BodyStrong>تمت إضافة واقعة تنفيذ واحدة إلى السجل.</BodyStrong>
                <Body>يبقى تنفيذ الاسترداد واقعة مُبلَّغًا عنها حتى يؤكد الطرف الآخر دقة السجل أو يعترض عليها.</Body>
                <Helper>لا يعني هذا أن UberTib نفّذ الاسترداد أو حوّل الأموال.</Helper>
              </View>
            ) : (
              <>
                <View style={{ gap: space('stack-md') }}>
                  <Heading3>تفاصيل التنفيذ الذي حدث خارج المنصة</Heading3>
                  <ValidationField
                    label="مبلغ الاسترداد المنفّذ خارج المنصة"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="number-pad"
                    helper={`المبلغ المعتمد: ${decision.amount} ${decision.currency}. لا يُسجّل تنفيذ جزئي لهذا القرار.`}
                    error={attempted && !amountMatches ? 'يجب أن يطابق المبلغ قرار الاسترداد المعتمد تمامًا.' : undefined}
                    autoFocus
                  />
                  <ValidationField
                    label="عملة الاسترداد"
                    value={currency}
                    onChangeText={setCurrency}
                    helper={`العملة المعتمدة: ${decision.currency}.`}
                    error={attempted && !currencyMatches ? 'يجب أن تطابق العملة قرار الاسترداد المعتمد.' : undefined}
                  />
                  <ValidationField
                    label="وقت تنفيذ الاسترداد خارج المنصة"
                    value={occurredAt}
                    onChangeText={setOccurredAt}
                    helper="أدخل الوقت الذي نفّذ فيه الطرفان الاسترداد فعليًا خارج UberTib."
                    error={attempted && !occurredAtValid ? 'وقت التنفيذ الخارجي مطلوب.' : undefined}
                  />
                </View>

                {evidenceSummary || evidenceIds.length > 0 ? (
                  <View
                    style={{
                      gap: space('stack-xs'),
                      padding: space('inset-md'),
                      borderRadius: radius('surface'),
                      backgroundColor: color('surface.subtle'),
                    }}
                  >
                    <BodyStrong>مرجع الإثبات المرتبط</BodyStrong>
                    {evidenceSummary ? <Body>{evidenceSummary}</Body> : null}
                    <Helper>يستخدم هذا النموذج مراجع الأدلة المتاحة مسبقًا؛ لا توجد هنا أداة رفع جديدة أو مسار تحويل أموال.</Helper>
                  </View>
                ) : null}

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
                  <BodyStrong>ماذا يعني التسجيل؟</BodyStrong>
                  <Body>يُضاف ادعاء تنفيذ خارجي إلى السجل، ثم ينتظر رد الطرف الآخر. القرار المعتمد لا يعني وحده أن الاسترداد تم.</Body>
                  <Helper>الاستحقاق، قرار الاسترداد، والتنفيذ الخارجي مراحل منفصلة.</Helper>
                </View>

                {state === 'mismatch' ? (
                  <RecoveryState
                    variant="not-retryable"
                    whatFailed="لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة."
                    stillTrue="قرار الاسترداد المعتمد ما زال ظاهرًا، ولم ينفّذ UberTib أي استرداد."
                    guidance="يجب أن يطابق مبلغ الواقعة وعملتها القرار المعتمد بالكامل؛ اختلافهما لا يُعامل كتنفيذ جزئي."
                  />
                ) : null}

                {submitting ? <SubmissionStateIndicator status="pending" /> : null}
              </>
            )}
          </>
        )}
      </Stack>
    </Screen>
  );
}
