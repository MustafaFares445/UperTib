import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { PatientTimelineEvent } from '../mocks/clinical';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function TimelineRow({ event, onOpenRecord }: { event: PatientTimelineEvent; onOpenRecord?: (event: PatientTimelineEvent) => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(event.details?.length || event.recordedAtIso || event.correctionOf);

  return (
    <View
      role="listitem"
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: event.correctionOf ? color('tone.info.border') : color('border.subtle'),
        backgroundColor: event.correctionOf ? color('tone.info.fill') : color('surface.default'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <Helper>{event.sourceLabel} · {formatDateTime(event.occurredAtIso)}</Helper>
        <BodyStrong>{event.title}</BodyStrong>
        <Body>{event.summary}</Body>
        <Helper>سجّله: {event.attribution}</Helper>
      </View>

      {event.correctionOf ? <Helper>هذا حدث لاحق يصحح أو يحدّث حدثًا سابقًا؛ الحدث السابق لم يُحذف.</Helper> : null}

      {hasDetails ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={({ pressed }) => ({
            minHeight: size('target-primary'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: space('inline-sm'),
            paddingVertical: space('inset-xs'),
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <BodyStrong tone="link">{expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</BodyStrong>
          <Icon name={expanded ? 'minus-circle' : 'plus-circle'} color={color('text.link')} scale="sm" />
        </Pressable>
      ) : null}

      {expanded ? (
        <View style={{ gap: space('stack-xs'), paddingTop: space('stack-xs'), borderTopWidth: borderWidth('hairline'), borderTopColor: color('border.subtle') }}>
          {event.recordedAtIso ? <Helper>وقت التسجيل: {formatDateTime(event.recordedAtIso)}</Helper> : null}
          {event.details?.map((detail) => <Body key={detail} tone="secondary">• {detail}</Body>)}
        </View>
      ) : null}

      {event.owningRecordLabel && onOpenRecord ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpenRecord(event)}
          style={({ pressed }) => ({ minHeight: size('target-primary'), justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}
        >
          <BodyStrong tone="link">{event.owningRecordLabel}</BodyStrong>
        </Pressable>
      ) : null}
    </View>
  );
}

/** CMP-PLATFORM-008 `record` projection for one unified, append-only patient case history. */
export function CaseEventTimeline({
  events,
  hasOlder,
  scopeLimited = false,
  onLoadOlder,
  onOpenRecord,
}: {
  events: PatientTimelineEvent[];
  hasOlder: boolean;
  scopeLimited?: boolean;
  onLoadOlder?: () => void;
  onOpenRecord?: (event: PatientTimelineEvent) => void;
}) {
  return (
    <View style={{ gap: space('stack-md') }}>
      {scopeLimited ? (
        <View style={{ padding: space('inset-sm'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Body>يعرض هذا السجل الأحداث التي يسمح بها نطاق الصلاحية الحالي فقط، وليس كل تفاصيل الحالة.</Body>
        </View>
      ) : null}

      <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
        {events.map((event) => <TimelineRow key={event.id} event={event} onOpenRecord={onOpenRecord} />)}
      </View>

      <View style={{ gap: space('stack-xs'), paddingTop: space('stack-sm'), borderTopWidth: borderWidth('hairline'), borderTopColor: color('border.subtle') }}>
        {hasOlder ? (
          <>
            <Helper>توجد أحداث أقدم من المعروضة هنا.</Helper>
            {onLoadOlder ? (
              <Pressable accessibilityRole="button" onPress={onLoadOlder} style={{ minHeight: size('target-primary'), justifyContent: 'center' }}>
                <BodyStrong tone="link">تحميل أحداث أقدم</BodyStrong>
              </Pressable>
            ) : null}
          </>
        ) : (
          <Helper>هذه بداية السجل المتاح لهذه الحالة.</Helper>
        )}
      </View>
    </View>
  );
}
