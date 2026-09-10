import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { EmptyState } from '../components/EmptyState';
import { FilterSearchBar } from '../components/FilterSearchBar';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Helper } from '../foundations/Text';
import type { PatientAttentionEntry } from '../mocks/platform';
import { PLATFORM_NOW_ISO } from '../mocks/platform';
import { borderWidth, color, radius, size, space } from '../theme/tokens';
import { AttentionNotificationFeed } from '../widgets/AttentionNotificationFeed';

export type NotificationCentreState = 'success' | 'stale' | 'error-fetch' | 'error-permission' | 'offline';

export interface NotificationCentreScreenProps {
  entries: PatientAttentionEntry[];
  state?: NotificationCentreState;
  subject?: string;
  authority?: string;
  asOfIso?: string;
  nowIso?: string;
  initialQuery?: string;
  initialUnreadOnly?: boolean;
  onOpenNotification: (entry: PatientAttentionEntry) => void;
  onMarkRead?: (entry: PatientAttentionEntry) => void;
  onRefresh?: () => void;
}

/** SCR-PLATFORM-009 — durable chronological Patient notification record, independent of transport. */
export function NotificationCentreScreen({
  entries,
  state = 'success',
  subject = 'إشعاراتك',
  authority,
  asOfIso,
  nowIso = PLATFORM_NOW_ISO,
  initialQuery = '',
  initialUnreadOnly = false,
  onOpenNotification,
  onMarkRead,
  onRefresh,
}: NotificationCentreScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [unreadOnly, setUnreadOnly] = useState(initialUnreadOnly);
  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const staleOrOffline = state === 'stale' || state === 'offline';

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return entries.filter((entry) => {
      if (unreadOnly && entry.read) return false;
      if (!normalized) return true;
      return `${entry.title} ${entry.summary} ${entry.status.label}`.toLocaleLowerCase('ar').includes(normalized);
    });
  }, [entries, query, unreadOnly]);

  const refreshAction = onRefresh ? {
    key: 'refresh',
    label: 'تحديث',
    role: 'secondary' as const,
    availability: { status: 'available' as const },
    onPress: onRefresh,
  } : undefined;

  return (
    <Screen footer={refreshAction && !permissionDenied ? <ActionBar actions={[refreshAction]} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="سجل التغييرات"
          title="مركز الإشعارات"
          description="سجل زمني دائم لما أخبرك به النظام. الرسائل النصية والتنبيهات الخارجية وسائل مساعدة فقط؛ فتح أي إشعار يقرأ السجل المرتبط من جديد."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك قراءة هذه الإشعارات ضمن الصلاحية الحالية."
            guidance="تُقيَّد القائمة بالشخص ونطاق التمثيل المسموح بهما من الخادم."
          />
        ) : fetchFailed ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر تحميل مركز الإشعارات."
            stillTrue="فشل القراءة لا يحذف السجل الدائم ولا يعني أن التنبيهات الخارجية هي المصدر الوحيد."
            guidance="أعد القراءة من السجل الموثوق."
            action={refreshAction}
          />
        ) : (
          <Stack gap="stack-md">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'أنت غير متصل الآن.' : 'قد لا تكون هذه أحدث نسخة من السجل.'}
                stillTrue="نعرض آخر سجل آمن معروف، وكل سجل مرتبط سيُقرأ بحالته الحالية عند توفر الاتصال."
                asOf={asOfIso ? `آخر قراءة: ${formatDateTime(asOfIso)}` : undefined}
                guidance="لا تعتمد على نص إشعار قديم لاتخاذ قرار تغيّر منذ إنشائه."
                action={refreshAction}
              />
            ) : null}

            <FilterSearchBar
              label="ابحث في الإشعارات"
              value={query}
              onChangeText={setQuery}
              placeholder="ابحث بالعنوان أو الحالة"
              onClear={() => setQuery('')}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: unreadOnly }}
              accessibilityLabel={unreadOnly ? 'إظهار كل الإشعارات' : 'إظهار غير المقروء فقط'}
              onPress={() => setUnreadOnly((current) => !current)}
              style={({ pressed }) => ({
                minHeight: size('target-primary'),
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: space('inset-md'),
                borderRadius: radius('control'),
                borderWidth: borderWidth('hairline'),
                borderColor: unreadOnly ? color('state.selected.border') : color('action.secondary-border'),
                backgroundColor: unreadOnly
                  ? color('state.selected.surface')
                  : pressed
                    ? color('action.secondary-hover')
                    : color('action.secondary-surface'),
              })}
            >
              <BodyStrong tone="link">{unreadOnly ? 'عرض الكل' : 'غير المقروء فقط'}</BodyStrong>
            </Pressable>

            <Helper>المعروض: {filteredEntries.length} من {entries.length}</Helper>

            {filteredEntries.length === 0 ? (
              <EmptyState
                variant={entries.length === 0 ? 'no-data' : 'filtered-empty'}
                icon="inbox-arrow-down"
                statement={entries.length === 0 ? 'لا توجد إشعارات في السجل بعد.' : 'لا توجد إشعارات تطابق البحث الحالي.'}
                reason={entries.length === 0
                  ? 'عند وجود تغيير يخاطبك به النظام سيبقى له سجل هنا حتى لو لم يصل تنبيه خارجي.'
                  : 'غيّر البحث أو اعرض كل الإشعارات دون تغيير أي حالة عمل.'}
              />
            ) : (
              <AttentionNotificationFeed
                entries={filteredEntries}
                variant="notification"
                nowIso={nowIso}
                onOpen={(entry) => {
                  if (!entry.read) onMarkRead?.(entry);
                  onOpenNotification(entry);
                }}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
