import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateChip } from '../components/StateChip';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { FinancialEventProjection } from '../mocks/finance';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type FinancialEventResponseState = 'ready' | 'submitting-confirm' | 'submitting-dispute' | 'responded-confirmed' | 'responded-disputed';
export interface FinancialEventResponseScreenProps { event: FinancialEventProjection; state?: FinancialEventResponseState; initialReason?: string; onConfirm: () => void; onDispute: (reason: string) => void; onBackToTimeline: () => void; }

/** SCR-FINANCE-004 — append a Patient counterparty response without rewriting the clinic assertion. */
export function FinancialEventResponseScreen({ event, state = 'ready', initialReason = '', onConfirm, onDispute, onBackToTimeline }: FinancialEventResponseScreenProps) {
  const [reason, setReason] = useState(initialReason);
  const confirmed = state === 'responded-confirmed';
  const disputed = state === 'responded-disputed';
  const responded = confirmed || disputed;
  const submittingConfirm = state === 'submitting-confirm';
  const submittingDispute = state === 'submitting-dispute';
  const submitting = submittingConfirm || submittingDispute;
  const reasonValid = reason.trim().length > 0;
  return (
    <Screen footer={responded ? (
      <ActionBar actions={[{ key: 'timeline', label: 'العودة إلى السجل المالي', role: 'primary', availability: { status: 'available' }, onPress: onBackToTimeline }]} />
    ) : (
      <ActionBar actions={[
        { key: 'confirm', label: 'تأكيد دقة الواقعة', role: 'primary', availability: submittingConfirm ? { status: 'loading' } : submittingDispute ? { status: 'disabled', reason: 'هناك رد جارٍ تسجيله الآن.' } : { status: 'available' }, onPress: onConfirm },
        { key: 'dispute', label: 'الاعتراض على الواقعة', role: 'destructive', availability: submittingDispute ? { status: 'loading' } : submittingConfirm ? { status: 'disabled', reason: 'هناك رد جارٍ تسجيله الآن.' } : reasonValid ? { status: 'available' } : { status: 'disabled', reason: 'اكتب سبب الاعتراض قبل تسجيله.' }, onPress: () => onDispute(reason.trim()) },
        ...(!submitting ? [{ key: 'back', label: 'العودة إلى السجل', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: onBackToTimeline }] : []),
      ]} />
    )}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="رد على واقعة مالية" title={responded ? 'تمت إضافة ردك إلى السجل' : 'هل هذه الواقعة دقيقة؟'} description={responded ? 'بقيت الواقعة الأصلية كما سُجّلت، وأضيف ردك كسجل لاحق.' : undefined} />
        <ContextNote icon="banknotes" title="سجل مالي خارجي" body="هذه الواقعة حدثت خارج UberTib؛ هنا تؤكد دقة السجل أو تعترض عليه فقط." />

        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
          <View style={{ gap: space('stack-xs') }}><Heading3>الواقعة الأصلية</Heading3><StateChip machine="external-financial-event" status="REPORTED_UNCONFIRMED" label="مُبلَّغ عنه — غير مؤكَّد" /></View>
          <BodyStrong>{event.title}</BodyStrong><Body>{event.summary}</Body><PriceDisplay price={{ mode: 'fixed', amount: event.amount, currency: event.currency }} compact />
          <Helper>{event.attribution} · {formatDateTime(event.occurredAtIso)}</Helper>
          {event.externalMethodLabel ? <Helper>{event.externalMethodLabel}</Helper> : null}
        </View>

        {responded ? (
          <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: confirmed ? color('tone.success.border') : color('tone.danger.border'), backgroundColor: confirmed ? color('tone.success.fill') : color('tone.danger.fill') }}>
            <Heading3>الرد المضاف لاحقًا</Heading3>
            <StateChip machine="external-financial-event" status={confirmed ? 'CONFIRMED' : 'DISPUTED'} label={confirmed ? 'مؤكَّد' : 'محل اعتراض'} />
            <BodyStrong>{confirmed ? 'أكدت دقة السجل.' : 'سجّلت اعتراضك على دقة السجل.'}</BodyStrong>
            {disputed ? <Body>سبب الاعتراض: {reason || initialReason}</Body> : null}
            <Helper>هذا الرد لا يعدّل الواقعة الأصلية ولا ينفّذ دفعًا أو استردادًا داخل UberTib.</Helper>
          </View>
        ) : (
          <>
            <ValidationField label="سبب الاعتراض" value={reason} onChangeText={setReason} helper="مطلوب فقط إذا اخترت الاعتراض." />
            <ContextNote icon="scale" title="إذا اعترضت" body="الاعتراض يضيف ردًا يوضح أن دقة الواقعة محل خلاف ويحوّلها إلى مسار المراجعة المالية المناسب. لا يلغي الواقعة الأصلية ولا يعيد أي مبلغ تلقائيًا." />
            {submitting ? <SubmissionStateIndicator status="pending" /> : null}
          </>
        )}
      </Stack>
    </Screen>
  );
}
