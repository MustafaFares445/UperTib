import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { DisclosureSection } from '../components/DisclosureSection';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Bdi } from '../foundations/Bdi';
import { formatCurrency, formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper, Label, NumericStrong } from '../foundations/Text';
import type { AcceptedFinancialTermsSnapshot } from '../mocks/finance';
import { borderWidth, color, radius, space } from '../theme/tokens';

function Amount({ amount, currency }: { amount: number; currency: string }) {
  return <NumericStrong><Bdi>{formatCurrency(amount, currency)}</Bdi></NumericStrong>;
}

/** SCR-FINANCE-001 — immutable accepted financial terms for one case. */
export function AcceptedFinancialTermsScreen({ snapshot, subject = 'حالتك العلاجية', authority, onOpenTimeline, onBackToCase }: {
  snapshot: AcceptedFinancialTermsSnapshot; subject?: string; authority?: string; onOpenTimeline: () => void; onBackToCase?: () => void;
}) {
  const policyTerms = [
    { title: 'طريقة السداد', body: snapshot.dueSummary },
    { title: 'الإلغاء', body: snapshot.cancellationSummary },
    { title: 'الاسترداد', body: snapshot.refundSummary },
    { title: 'الحماية', body: snapshot.protectionSummary },
  ];
  return (
    <Screen footer={<ActionBar actions={[
      { key: 'timeline', label: 'فتح السجل المالي', role: 'primary', availability: { status: 'available' }, onPress: onOpenTimeline },
      ...(onBackToCase ? [{ key: 'case', label: 'العودة إلى الحالة', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: onBackToCase }] : []),
    ]} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="الشروط المالية المقبولة" title={snapshot.serviceLabel} description="هذه هي النسخة التي وافقت عليها لهذه الحالة؛ تبقى ثابتة حتى لو تغيّرت إعدادات اليوم." />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View accessible accessibilityLabel={`${snapshot.versionLabel}، مقبولة ${formatDateTime(snapshot.acceptedAtIso)}`} style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
          <Helper>لقطة مالية مقبولة</Helper>
          {snapshot.complete ? <><Label>الإجمالي المقبول</Label><Amount amount={snapshot.total} currency={snapshot.currency} /><Helper>المبلغ محفوظ بالعملة التي تم الاتفاق بها ولا يُعاد احتسابه بسعر صرف لاحق.</Helper></> : <><BodyStrong>لن نعرض إجماليًا ناقصًا.</BodyStrong><Body>{snapshot.missingLabel ?? 'تعذّر تحميل جزء من البنود المقبولة.'}</Body></>}
          <Helper>{snapshot.versionLabel} · قُبلت {formatDateTime(snapshot.acceptedAtIso)}</Helper>
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>البنود المقبولة</Heading3>
          <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
            {snapshot.lines.map((line, index) => (
              <View key={line.id} role="listitem" style={{ gap: space('stack-xs'), paddingVertical: space('stack-sm'), borderBottomWidth: index < snapshot.lines.length - 1 ? borderWidth('hairline') : 0, borderBottomColor: color('border.subtle') }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: space('inline-sm') }}><BodyStrong style={{ flex: 1, minWidth: 160 }}>{line.title}</BodyStrong><Amount amount={line.amount} currency={snapshot.currency} /></View>
                {line.note ? <Helper>{line.note}</Helper> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>الشروط التي تحكم هذه اللقطة</Heading3>
          {policyTerms.map((term) => <DisclosureSection key={term.title} label={term.title} summary={term.body}><Body>{term.body}</Body></DisclosureSection>)}
        </View>

        <DisclosureSection label="تفاصيل الشروط والمراجع" summary={`${snapshot.governingReferences.length} مراجع تاريخية مرتبطة بهذه النسخة`}>
          {snapshot.governingReferences.map((reference) => <Helper key={reference}>• {reference}</Helper>)}
        </DisclosureSection>
      </Stack>
    </Screen>
  );
}
