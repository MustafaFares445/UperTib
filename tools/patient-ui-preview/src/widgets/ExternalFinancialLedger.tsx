import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatCurrency, formatDateTime } from '../foundations/format';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, BodyStrong, Heading3, Helper, Label, NumericStrong } from '../foundations/Text';
import type { FinancialEventProjection, FinancialEventState, FinancialLedgerProjection } from '../mocks/finance';
import { borderWidth, color, radius, space, toneColors, type Tone } from '../theme/tokens';
import { StateChip } from '../components/StateChip';

const EVENT_LABEL: Record<FinancialEventState, string> = {
  REPORTED_UNCONFIRMED: 'مُبلَّغ عنه — غير مؤكَّد',
  CONFIRMED: 'مؤكَّد',
  DISPUTED: 'محل اعتراض',
};

function Amount({ amount, currency }: { amount: number; currency: string }) {
  return (
    <NumericStrong>
      <Bdi>{formatCurrency(amount, currency)}</Bdi>
    </NumericStrong>
  );
}

function EventCard({ event }: { event: FinancialEventProjection }) {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${event.title}، ${formatCurrency(event.amount, event.currency)}، ${EVENT_LABEL[event.status]}`}
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space('inline-sm') }}>
          <BodyStrong>{event.title}</BodyStrong>
          <StateChip machine="external-financial-event" status={event.status} label={EVENT_LABEL[event.status]} />
        </View>
        <Amount amount={event.amount} currency={event.currency} />
        <Helper>{event.attribution} · {formatDateTime(event.occurredAtIso)}</Helper>
      </View>

      <Body>{event.summary}</Body>

      {event.externalMethodLabel ? (
        <View style={{ gap: space('stack-xs') }}>
          <Helper>طريقة الواقعة الخارجية</Helper>
          <BodyStrong>{event.externalMethodLabel}</BodyStrong>
        </View>
      ) : null}

      {event.response ? (
        <View
          style={{
            gap: space('stack-xs'),
            padding: space('inset-sm'),
            borderRadius: radius('control'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Label>{event.response.label}</Label>
          <BodyStrong>{event.response.attribution} · {formatDateTime(event.response.atIso)}</BodyStrong>
          <Body>{event.response.summary}</Body>
        </View>
      ) : null}

      <Helper>سُجِّل في UberTib: {formatDateTime(event.recordedAtIso)}</Helper>
    </View>
  );
}

interface PositionFactProps {
  label: string;
  amount: number;
  currency: string;
  tone: Tone;
  icon: IconName;
  meaning: string;
}

function PositionFact({ label, amount, currency, tone, icon, meaning }: PositionFactProps) {
  const colors = toneColors(tone);
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${formatCurrency(amount, currency)}. ${meaning}`}
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        minWidth: 140,
        gap: space('stack-xs'),
        padding: space('inset-sm'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: colors.border,
        backgroundColor: colors.fill,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
        <Icon name={icon} color={colors.icon} scale="sm" />
        <Label style={{ color: colors.text }}>{label}</Label>
      </View>
      <Amount amount={amount} currency={currency} />
      <Helper>{meaning}</Helper>
    </View>
  );
}

/**
 * WGT-FINANCE-001 — Patient external financial event ledger.
 *
 * This is deliberately a record-reading surface, not a wallet or payment surface. The immutable
 * agreed amount is shown first, assertions remain append-only, and the derived position disappears
 * completely when the event set is partial so a truncated history can never manufacture a balance.
 */
export function ExternalFinancialLedger({ ledger }: { ledger: FinancialLedgerProjection }) {
  const { snapshot, events, position } = ledger;

  return (
    <View style={{ gap: space('stack-lg') }}>
      <View
        accessible
        accessibilityLabel={`المتفق عليه في الشروط المقبولة: ${formatCurrency(snapshot.total, snapshot.currency)}، ${snapshot.versionLabel}`}
        style={{
          gap: space('stack-xs'),
          padding: space('inset-md'),
          borderRadius: radius('surface'),
          backgroundColor: color('surface.subtle'),
        }}
      >
        <Label>المتفق عليه في الشروط المقبولة</Label>
        <Amount amount={snapshot.total} currency={snapshot.currency} />
        <Helper>{snapshot.versionLabel} · قُبلت {formatDateTime(snapshot.acceptedAtIso)}</Helper>
      </View>

      <View style={{ gap: space('stack-sm') }}>
        <View style={{ gap: space('stack-xs') }}>
          <Heading3>الوقائع المسجَّلة</Heading3>
          <Helper>كل عنصر أدناه واقعة حدثت خارج UberTib. التأكيد أو الاعتراض يخص دقة السجل فقط.</Helper>
        </View>
        {events.length > 0 ? (
          <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
            {events.map((event) => (
              <View key={event.id} role="listitem">
                <EventCard event={event} />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ gap: space('stack-xs'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
            <BodyStrong>لا توجد وقائع مالية مسجَّلة بعد.</BodyStrong>
            <Helper>تبقى الشروط المقبولة أعلاه هي المرجع حتى يظهر حدث خارجي مسجَّل.</Helper>
          </View>
        )}
      </View>

      {ledger.completeHistory ? (
        <View style={{ gap: space('stack-sm') }}>
          <View style={{ gap: space('stack-xs') }}>
            <Heading3>الوضع الحالي المشتق</Heading3>
            <Helper>مشتق من الشروط المقبولة والسجل الكامل حتى {formatDateTime(position.asOfIso)}. هذه القيم ليست رصيد محفظة.</Helper>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('stack-sm') }}>
            <PositionFact label="المتفق عليه" amount={position.agreed} currency={position.currency} tone="neutral" icon="document-check" meaning="القيمة المحفوظة في اللقطة المقبولة." />
            <PositionFact label="مُبلَّغ عنه خارجيًا" amount={position.reported} currency={position.currency} tone="warning" icon="banknotes" meaning="وقائع أبلغ عنها أحد الأطراف، مهما كانت نتيجة التحقق." />
            <PositionFact label="مؤكَّد كسجل" amount={position.confirmed} currency={position.currency} tone="success" icon="check-circle" meaning="وقائع تأكدت دقة تسجيلها." />
            <PositionFact label="محل اعتراض" amount={position.disputed} currency={position.currency} tone="danger" icon="hand-raised" meaning="وقائع لا تُعامل كمؤكدة ما دام الاعتراض قائمًا." />
            <PositionFact label="استرداد خارجي مسجَّل" amount={position.refunded} currency={position.currency} tone="info" icon="arrow-path" meaning="قيمة استرداد جرى أو أُبلغ عن تنفيذه خارج المنصة." />
            <PositionFact label="بانتظار تنفيذ خارجي" amount={position.pendingExternalExecution} currency={position.currency} tone="warning" icon="clock" meaning="التزام مسجَّل للأطراف لتنفيذه خارج UberTib." />
          </View>
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
          <BodyStrong>السجل غير مكتمل.</BodyStrong>
          <Body>{ledger.gapLabel ?? 'تعذّر تحميل جزء من السجل؛ لن نعرض وضعًا مشتقًا قد يكون ناقصًا.'}</Body>
        </View>
      )}
    </View>
  );
}
