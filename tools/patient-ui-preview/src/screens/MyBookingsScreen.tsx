import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EmptyState } from '../components/EmptyState';
import { FilterSearchBar } from '../components/FilterSearchBar';
import { RecoveryState } from '../components/RecoveryState';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { PatientBookingSummary } from '../mocks/bookingRemaining';
import { PLATFORM_NOW_ISO } from '../mocks/platform';
import { borderWidth, color, radius, resolve, size, space } from '../theme/tokens';

export type MyBookingsScreenState = 'success' | 'empty-no-data' | 'stale' | 'error-fetch' | 'error-permission' | 'offline';

export interface MyBookingsScreenProps {
  bookings: PatientBookingSummary[];
  state?: MyBookingsScreenState;
  subject?: string;
  authority?: string;
  asOfIso?: string;
  nowIso?: string;
  initialQuery?: string;
  onOpenBooking: (booking: PatientBookingSummary) => void;
  onRefresh?: () => void;
}

function BookingRow({ booking, nowIso, onOpen }: { booking: PatientBookingSummary; nowIso: string; onOpen: () => void }) {
  const accessibleDeadline = booking.deadlineIso ? `المهلة حتى ${formatDateTime(booking.deadlineIso)}` : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        booking.serviceLabel,
        booking.providerName,
        booking.stateLabel,
        accessibleDeadline,
        booking.actionRequired ? booking.actionLabel ?? 'إجراء مطلوب' : 'لا يحتاج إجراء الآن',
      ].filter(Boolean).join('. ')}
      onPress={onOpen}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: booking.actionRequired ? color('tone.warning.border') : color('border.subtle'),
        backgroundColor: booking.actionRequired ? color('tone.warning.fill') : color('surface.default'),
        opacity: pressed ? (resolve('semantic.opacity.pressed') as number) : 1,
      })}
    >
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{booking.serviceLabel}</BodyStrong>
        <Body tone="secondary">{booking.providerName} · {booking.branchName}</Body>
        <Helper>الموعد: {formatDateTime(booking.appointmentIso)}</Helper>
      </View>
      <StateChip machine="booking" status={booking.state} label={booking.stateLabel} />
      {booking.actionRequired ? (
        <View style={{ gap: space('stack-xs') }}>
          <Helper>يحتاج منك</Helper>
          <BodyStrong>{booking.actionLabel ?? 'راجع الحجز الآن'}</BodyStrong>
        </View>
      ) : null}
      {booking.deadlineIso ? (
        <DeadlineIndicator
          deadlineIso={booking.deadlineIso}
          obligation={booking.actionLabel ?? 'المهلة المرتبطة بهذا الحجز'}
          nowIso={nowIso}
          state={booking.deadlineState}
        />
      ) : null}
      <BodyStrong tone="link">فتح تفاصيل الحجز</BodyStrong>
    </Pressable>
  );
}

/** SCR-BOOKING-003 — authoritative booking list with state, remaining time and action-required context. */
export function MyBookingsScreen({
  bookings,
  state = 'success',
  subject = 'حجوزاتك',
  authority,
  asOfIso,
  nowIso = PLATFORM_NOW_ISO,
  initialQuery = '',
  onOpenBooking,
  onRefresh,
}: MyBookingsScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    if (!normalized) return bookings;
    return bookings.filter((booking) =>
      `${booking.serviceLabel} ${booking.providerName} ${booking.branchName} ${booking.stateLabel}`
        .toLocaleLowerCase('ar')
        .includes(normalized),
    );
  }, [bookings, query]);

  const refreshAction = onRefresh ? {
    key: 'refresh',
    label: 'تحديث الحجوزات',
    role: 'secondary' as const,
    availability: { status: 'available' as const },
    onPress: onRefresh,
  } : undefined;
  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const empty = state === 'empty-no-data' || (state === 'success' && bookings.length === 0);

  return (
    <Screen footer={refreshAction && !permissionDenied ? <ActionBar actions={[refreshAction]} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="رعايتي"
          title="حجوزاتي"
          description="حالة كل حجز والوقت المتبقي لأي مهلة يظهران هنا قبل فتح التفاصيل."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك قراءة هذه الحجوزات ضمن الصلاحية الحالية."
            guidance="تغيير الشخص المعروض لا يمنح صلاحية جديدة؛ النطاق يُعاد تقييمه من الخادم."
          />
        ) : fetchFailed ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر تحميل الحجوزات."
            stillTrue="لا يعني فشل القراءة أن الحجز تغيّر أو أُلغي."
            guidance="أعد قراءة القائمة الموثوقة قبل اتخاذ أي قرار."
            action={refreshAction}
          />
        ) : empty ? (
          <EmptyState
            variant="no-data"
            icon="calendar-days"
            statement="لا توجد حجوزات بعد."
            reason="عندما ترسل طلب حجز سيظهر هنا بحالته الموثوقة."
          />
        ) : (
          <Stack gap="stack-md">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'أنت غير متصل الآن.' : 'قد تكون هذه الحجوزات أقدم من حالتها الحالية.'}
                stillTrue="نعرض آخر حالة آمنة معروفة، وفتح الحجز يعيد قراءته عند توفر الاتصال."
                asOf={asOfIso ? `آخر قراءة: ${formatDateTime(asOfIso)}` : undefined}
                guidance="لا تنفذ إجراءً يغيّر الحجز اعتمادًا على نسخة قديمة."
                action={refreshAction}
              />
            ) : null}

            <FilterSearchBar
              label="ابحث في حجوزاتك"
              value={query}
              onChangeText={setQuery}
              placeholder="الخدمة أو الطبيب أو الحالة"
              onClear={() => setQuery('')}
            />
            <Helper>المعروض: {filtered.length} من {bookings.length}</Helper>

            {filtered.length === 0 ? (
              <EmptyState
                variant="filtered-empty"
                icon="magnifying-glass"
                statement="لا توجد حجوزات تطابق البحث."
                reason="امسح البحث لعرض كل الحجوزات دون تغيير أي حالة."
              />
            ) : (
              <View accessibilityRole="list" accessibilityLabel={`الحجوزات، ${filtered.length}`} style={{ gap: space('stack-sm') }}>
                {filtered.map((booking) => (
                  <View key={booking.id} role="listitem">
                    <BookingRow booking={booking} nowIso={nowIso} onOpen={() => onOpenBooking(booking)} />
                  </View>
                ))}
              </View>
            )}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
