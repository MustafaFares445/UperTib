import { Pressable, View } from 'react-native';
import { formatDateTime, formatRemaining } from '../foundations/format';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { PatientAttentionEntry } from '../mocks/platform';
import { borderWidth, color, radius, resolve, size, space } from '../theme/tokens';
import { DeadlineIndicator } from './DeadlineIndicator';
import { resolveTriple, StateChip } from './StateChip';

export type AttentionItemVariant = 'attention' | 'notification';

export interface AttentionItemProps {
  entry: PatientAttentionEntry;
  variant: AttentionItemVariant;
  nowIso?: string;
  onOpen: () => void;
}

/**
 * CMP-PLATFORM-015 — one durable Patient obligation. The same record is intentionally reusable on
 * the attention surface and in the notification centre; transport delivery is never required for
 * correctness. Opening it delegates to the owning screen, which must re-read the linked record.
 */
export function AttentionItem({ entry, variant, nowIso, onOpen }: AttentionItemProps) {
  const triple = resolveTriple(entry.status.machine, entry.status.value);
  const deadlineText = entry.dueAtIso && entry.deadlineKnown !== false
    ? `المهلة ${formatRemaining(entry.dueAtIso, nowIso)}, حتى ${formatDateTime(entry.dueAtIso)}`
    : entry.deadlineKnown === false
      ? 'تعذر قراءة وقت المهلة الحالي'
      : 'لا توجد مهلة معروضة';
  const subjectText = entry.subjectLabel ? `للمريض ${entry.subjectLabel}` : '';
  const unreadText = variant === 'notification' && !entry.read ? 'غير مقروء' : '';
  const accessibilityLabel = [entry.title, entry.status.label, deadlineText, subjectText, unreadText]
    .filter(Boolean)
    .join('. ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onOpen}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: variant === 'notification' && !entry.read
          ? color('action.primary-subtle')
          : color('surface.default'),
        opacity: pressed ? (resolve('semantic.opacity.pressed') as number) : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
        <Icon name={triple.icon as IconName} color={color(`tone.${triple.tone}.icon`)} scale="md" />
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <BodyStrong>{entry.title}</BodyStrong>
          <Body tone="secondary">{entry.summary}</Body>
          {entry.subjectLabel ? <Helper>هذه المهمة تخص: {entry.subjectLabel}</Helper> : null}
          {variant === 'notification' ? (
            <Helper>
              {entry.read ? 'مقروء' : 'غير مقروء'} · {formatDateTime(entry.createdAtIso)}
            </Helper>
          ) : null}
        </View>
      </View>

      <StateChip machine={entry.status.machine} status={entry.status.value} label={entry.status.label} />

      {entry.dueAtIso && entry.deadlineKnown !== false ? (
        <DeadlineIndicator
          deadlineIso={entry.dueAtIso}
          obligation={entry.title}
          nowIso={nowIso}
          state={entry.deadlineState}
        />
      ) : entry.deadlineKnown === false ? (
        <View
          style={{
            gap: space('stack-xs'),
            padding: space('inset-sm'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('tone.warning.border'),
            backgroundColor: color('tone.warning.fill'),
          }}
        >
          <BodyStrong style={{ color: color('tone.warning.text') }}>المهلة غير متاحة الآن</BodyStrong>
          <Helper style={{ color: color('tone.warning.text') }}>
            هذه المهمة مرتبطة بمهلة، لكن تعذر قراءة وقتها الحالي. افتح السجل للتحقق من الحالة المحدثة.
          </Helper>
        </View>
      ) : null}

      <BodyStrong tone="link">فتح السجل المحدث</BodyStrong>
    </Pressable>
  );
}
