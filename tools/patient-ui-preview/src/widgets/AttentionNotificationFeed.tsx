import { View } from 'react-native';
import { AttentionItem, type AttentionItemVariant } from '../components/AttentionItem';
import type { PatientAttentionEntry } from '../mocks/platform';
import { space } from '../theme/tokens';

export interface AttentionNotificationFeedProps {
  entries: PatientAttentionEntry[];
  variant: AttentionItemVariant;
  nowIso?: string;
  onOpen: (entry: PatientAttentionEntry) => void;
}

/**
 * WGT-PLATFORM-009 — shared durable attention/notification feed. Ordering is supplied by the
 * authoritative projection for the owning surface: task priority for `attention`, chronology for
 * `notification`. The widget never guesses or re-sorts business priority.
 */
export function AttentionNotificationFeed({ entries, variant, nowIso, onOpen }: AttentionNotificationFeedProps) {
  return (
    <View
      accessibilityRole="list"
      accessibilityLabel={variant === 'attention' ? `المهام التي تحتاجك الآن، ${entries.length}` : `الإشعارات، ${entries.length}`}
      style={{ gap: space('stack-sm') }}
    >
      {entries.map((entry) => (
        <View key={entry.id} role="listitem">
          <AttentionItem entry={entry} variant={variant} nowIso={nowIso} onOpen={() => onOpen(entry)} />
        </View>
      ))}
    </View>
  );
}
