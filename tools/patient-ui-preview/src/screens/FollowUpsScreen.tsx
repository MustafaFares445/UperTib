import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EmptyState } from '../components/EmptyState';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientFollowUpProjection } from '../mocks/followups';
import { PLATFORM_NOW_ISO } from '../mocks/platform';
import { borderWidth, chipVisual, color, radius, resolve, size, space } from '../theme/tokens';

export type FollowUpsScreenState = 'success' | 'empty-no-data' | 'partial' | 'stale' | 'offline' | 'error-fetch' | 'error-permission';

export interface FollowUpsScreenProps {
  followUps: PatientFollowUpProjection[];
  state?: FollowUpsScreenState;
  subject?: string;
  authority?: string;
  asOfIso?: string;
  nowIso?: string;
  onOpenFollowUp: (followUp: PatientFollowUpProjection) => void;
  onRefresh?: () => void;
}

function FollowUpRow({
  followUp,
  nowIso,
  onOpen,
}: {
  followUp: PatientFollowUpProjection;
  nowIso: string;
  onOpen: () => void;
}) {
  const tone = followUp.dueState === 'due' ? 'warning' : followUp.dueState === 'completed' ? 'success' : 'info';
  const visual = chipVisual(tone, 'subtle');
  const icon = followUp.dueState === 'due' ? 'exclamation-circle' : followUp.dueState === 'completed' ? 'check-circle' : 'calendar-days';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        followUp.dueLabel,
        followUp.serviceLabel,
        followUp.stageLabel,
        followUp.requirement,
        followUp.dueAtIso ? `موعد المتابعة ${formatDateTime(followUp.dueAtIso)}` : '',
        followUp.subjectLabel ? `تخص ${followUp.subjectLabel}` : '',
      ].filter(Boolean).join('. ')}
      onPress={onOpen}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: visual.border,
        backgroundColor: followUp.dueState === 'completed' ? color('surface.default') : visual.background,
        opacity: pressed ? (resolve('semantic.opacity.pressed') as number) : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
        <Icon name={icon} color={visual.icon} />
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <BodyStrong style={{ color: visual.text }}>{followUp.dueLabel}</BodyStrong>
          <BodyStrong>{followUp.serviceLabel}</BodyStrong>
          <Helper>{followUp.stageLabel} · {followUp.caseId}</Helper>
        </View>
      </View>
      <View style={{ gap: space('stack-xs') }}>
        <Helper>المطلوب منك</Helper>
        <Body>{followUp.requirement}</Body>
      </View>
      {followUp.dueAtIso ? (
        <DeadlineIndicator
          deadlineIso={followUp.dueAtIso}
          obligation="موعد المتابعة"
          nowIso={nowIso}
          state={followUp.deadlineState}
        />
      ) : followUp.completedAtIso ? (
        <Helper>اكتملت: {formatDateTime(followUp.completedAtIso)}</Helper>
      ) : null}
      <BodyStrong tone="link">{followUp.patientActionLabel ?? 'فتح الحالة'}</BodyStrong>
    </Pressable>
  );
}

/** SCR-CLINICAL-007 — Patient-safe due follow-ups, requirements, deadlines and authoritative case re-entry. */
export function FollowUpsScreen({
  followUps,
  state = 'success',
  subject = 'متابعاتك العلاجية',
  authority,
  asOfIso,
  nowIso = PLATFORM_NOW_ISO,
  onOpenFollowUp,
  onRefresh,
}: FollowUpsScreenProps) {
  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const empty = state === 'empty-no-data' || (state === 'success' && followUps.length === 0);
  const due = followUps.filter((item) => item.dueState === 'due');
  const upcoming = followUps.filter((item) => item.dueState === 'upcoming');
  const completed = followUps.filter((item) => item.dueState === 'completed');
  const refreshAction = onRefresh ? {
    key: 'refresh', label: 'تحديث المتابعات', role: 'secondary' as const,
    availability: { status: 'available' as const }, onPress: onRefresh,
  } : undefined;

  const renderGroup = (title: string, items: PatientFollowUpProjection[]) => items.length ? (
    <View style={{ gap: space('stack-sm') }}>
      <Heading3>{title}</Heading3>
      <View accessibilityRole="list" accessibilityLabel={`${title}، ${items.length}`} style={{ gap: space('stack-sm') }}>
        {items.map((followUp) => (
          <View key={followUp.id} role="listitem">
            <FollowUpRow followUp={followUp} nowIso={nowIso} onOpen={() => onOpenFollowUp(followUp)} />
          </View>
        ))}
      </View>
    </View>
  ) : null;

  return (
    <Screen footer={refreshAction && !permissionDenied ? <ActionBar actions={[refreshAction]} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="رعايتي"
          title="المتابعات"
          description="المتابعات المستحقة وما تحتاجه منك تظهر أولًا. فتح أي متابعة يعيدك إلى الحالة أو المرحلة الموثوقة المرتبطة بها."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك قراءة هذه المتابعات ضمن الصلاحية الحالية."
            guidance="يُعاد تقييم نطاق المريض والتمثيل في الخادم، ولا تكشف الشاشة أي ملاحظات سريرية خاصة."
          />
        ) : fetchFailed ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر تحميل المتابعات."
            stillTrue="عدم وصول تنبيه أو فشل القراءة لا يعني عدم وجود متابعة مستحقة."
            guidance="أعد قراءة الحالة الموثوقة قبل اعتبار المتابعة غير مطلوبة."
            action={refreshAction}
          />
        ) : empty ? (
          <EmptyState
            variant="no-data"
            icon="check-circle"
            statement="لا توجد متابعة مطلوبة الآن."
            reason="ستظهر المتابعة هنا عندما يسجل النظام موعدها ومتطلباتها ضمن حالتك العلاجية."
          />
        ) : (
          <Stack gap="stack-lg">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'أنت غير متصل الآن.' : 'قد لا تكون المتابعات المعروضة هي الأحدث.'}
                stillTrue="نعرض آخر بيانات آمنة معروفة، وفتح الحالة يعيد القراءة عند توفر الاتصال."
                asOf={asOfIso ? `آخر قراءة: ${formatDateTime(asOfIso)}` : undefined}
                guidance="لا تعتبر متابعة مكتملة أو ملغاة اعتمادًا على نسخة قديمة."
                action={refreshAction}
              />
            ) : state === 'partial' ? (
              <RecoveryState
                variant="fetch-failure"
                whatFailed="تعذر تحميل جزء من المتابعات."
                stillTrue="العناصر الظاهرة معروفة، لكن القائمة غير مكتملة."
                guidance="حدّث الصفحة قبل استنتاج أن هذه كل المتابعات."
                action={refreshAction}
              />
            ) : null}

            {renderGroup('تحتاجك الآن', due)}
            {renderGroup('قادمة', upcoming)}
            {renderGroup('السجل المكتمل', completed)}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
