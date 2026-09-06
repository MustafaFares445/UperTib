import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Bdi } from '../foundations/Bdi';
import { formatCurrency, formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper, Label, NumericStrong } from '../foundations/Text';
import type { AcceptedFinancialTermsSnapshot } from '../mocks/finance';
import { borderWidth, color, radius, space } from '../theme/tokens';

function Amount({ amount, currency }: { amount: number; currency: string }) {
  return (
    <NumericStrong>
      <Bdi>{formatCurrency(amount, currency)}</Bdi>
    </NumericStrong>
  );
}

function TermBlock({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ gap: space('stack-xs'), padding: space('inset-sm'), borderRadius: radius('control'), backgroundColor: color('surface.subtle') }}>
      <Label>{title}</Label>
      <Body>{body}</Body>
    </View>
  );
}

/** SCR-FINANCE-001 — immutable accepted financial terms for one case. */
export function AcceptedFinancialTermsScreen({
  snapshot,
  subject = 'حالتك العلاجية',
  authority,
  onOpenTimeline,
  onBackToCase,
}: {
  snapshot: AcceptedFinancialTermsSnapshot;
  subject?: string;
  authority?: string;
  onOpenTimeline: () => void;
  onBackToCase?: () => void;
}) {
  return (
    <Screen
      footer={(
        <ActionBar actions={[
          {
            key: 'timeline',
            label: 'فتح السجل المالي',
            role: 'primary',
            availability: { status: 'available' },
            onPress: onOpenTimeline,
          },
          ...(onBackToCase ? [{
            key: 'case',
            label: 'العودة إلى الحالة',
            role: 'secondary' as const,
            availability: { status: 'available' as const },
            onPress: onBackToCase,
          }] : []),
        ]} />
      )}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الشروط المالية المقبولة"
          title={snapshot.serviceLabel}
          description="هذه لقطة ثابتة لما تم الاتفاق عليه لهذه الحالة. أي مبالغ لاحقة تظهر في السجل كوقائع خارجية منفصلة."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View
          accessible
          accessibilityLabel={`${snapshot.versionLabel}، مقبولة ${formatDateTime(snapshot.acceptedAtIso)}`}
          style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}
        >
          <Label>النسخة المقبولة</Label>
          <BodyStrong>{snapshot.versionLabel}</BodyStrong>
          <Helper>قُبلت {formatDateTime(snapshot.acceptedAtIso)}</Helper>
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>البنود المقبولة</Heading3>
          <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
            {snapshot.lines.map((line) => (
              <View
                key={line.id}
                role="listitem"
                style={{
                  gap: space('stack-xs'),
                  padding: space('inset-md'),
                  borderRadius: radius('surface'),
                  borderWidth: borderWidth('hairline'),
                  borderColor: color('border.subtle'),
                  backgroundColor: color('surface.default'),
                }}
              >
                <BodyStrong>{line.title}</BodyStrong>
                <Amount amount={line.amount} currency={snapshot.currency} />
                {line.note ? <Helper>{line.note}</Helper> : null}
              </View>
            ))}
          </View>

          {snapshot.complete ? (
            <View
              accessible
              accessibilityLabel={`الإجمالي المقبول: ${formatCurrency(snapshot.total, snapshot.currency)}`}
              style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}
            >
              <Label>الإجمالي المقبول</Label>
              <Amount amount={snapshot.total} currency={snapshot.currency} />
              <Helper>المبلغ محفوظ بالعملة التي تم الاتفاق بها ولا يُعاد احتسابه بسعر صرف لاحق.</Helper>
            </View>
          ) : (
            <View
              accessibilityLiveRegion="polite"
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('tone.warning.border'),
                backgroundColor: color('tone.warning.fill'),
              }}
            >
              <BodyStrong>لن نعرض إجماليًا ناقصًا.</BodyStrong>
              <Body>{snapshot.missingLabel ?? 'تعذّر تحميل جزء من البنود المقبولة.'}</Body>
            </View>
          )}
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>ما الذي تحكمه هذه اللقطة؟</Heading3>
          <TermBlock title="طريقة السداد" body={snapshot.dueSummary} />
          <TermBlock title="الإلغاء" body={snapshot.cancellationSummary} />
          <TermBlock title="الاسترداد" body={snapshot.refundSummary} />
          <TermBlock title="الحماية" body={snapshot.protectionSummary} />
        </View>

        <View style={{ gap: space('stack-xs') }}>
          <Heading3>المراجع التي كانت سارية عند القبول</Heading3>
          {snapshot.governingReferences.map((reference) => <Helper key={reference}>• {reference}</Helper>)}
        </View>
      </Stack>
    </Screen>
  );
}
