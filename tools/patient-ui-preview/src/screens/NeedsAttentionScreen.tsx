import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { EmptyState } from '../components/EmptyState';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientAttentionEntry } from '../mocks/platform';
import { PLATFORM_NOW_ISO } from '../mocks/platform';
import { borderWidth, color, radius, resolve, size, space } from '../theme/tokens';
import { AttentionNotificationFeed } from '../widgets/AttentionNotificationFeed';

export type NeedsAttentionState =
  | 'success'
  | 'empty-no-data'
  | 'partial'
  | 'stale'
  | 'error-fetch'
  | 'error-permission'
  | 'offline';

export interface NeedsAttentionScreenProps {
  entries: PatientAttentionEntry[];
  state?: NeedsAttentionState;
  subject?: string;
  authority?: string;
  asOfIso?: string;
  nowIso?: string;
  onOpenAttention: (entry: PatientAttentionEntry) => void;
  onRefresh?: () => void;
  onFindCare?: () => void;
  onOpenMyCare?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

function NavigationRow({ label, hint, onPress }: { label: string; hint: string; onPress?: () => void }) {
  if (!onPress) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${hint}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
        opacity: pressed ? (resolve('semantic.opacity.pressed') as number) : 1,
      })}
    >
      <BodyStrong tone="link">{label}</BodyStrong>
      <Helper>{hint}</Helper>
    </Pressable>
  );
}

/** SCR-PLATFORM-001 — Patient re-entry surface driven by durable, authoritative obligations. */
export function NeedsAttentionScreen({
  entries,
  state = 'success',
  subject = 'ما يحتاج انتباهك',
  authority,
  asOfIso,
  nowIso = PLATFORM_NOW_ISO,
  onOpenAttention,
  onRefresh,
  onFindCare,
  onOpenMyCare,
  onOpenProfile,
  onOpenNotifications,
}: NeedsAttentionScreenProps) {
  const refreshAction = onRefresh
    ? {
        key: 'refresh',
        label: 'تحديث',
        role: 'secondary' as const,
        availability: { status: 'available' as const },
        onPress: onRefresh,
      }
    : undefined;

  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const empty = state === 'empty-no-data' || (state === 'success' && entries.length === 0);
  const showEntries = !permissionDenied && !fetchFailed && !empty && entries.length > 0;
  const isStale = state === 'stale' || state === 'offline';

  return (
    <Screen footer={refreshAction && !permissionDenied ? <ActionBar actions={[refreshAction]} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الرئيسية"
          title="ما يحتاجك الآن"
          description="الأولوية لما يحتاج منك إجراء الآن. فتح أي عنصر يقرأ سجله الحالي من جديد قبل عرض حالته."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>يحتاج إجراء منك</Heading3>

          {permissionDenied ? (
            <RecoveryState
              variant="permission-denied"
              whatFailed="لا يمكنك الوصول إلى هذه البيانات ضمن الصلاحية الحالية."
              stillTrue="تغيير الشخص المعروض لا يمنح صلاحية جديدة، ويعاد التحقق من نطاق الوصول في الخادم."
              guidance="ارجع إلى ملفك أو نطاق التمثيل المسموح لك به."
            />
          ) : fetchFailed ? (
            <RecoveryState
              variant="fetch-failure"
              whatFailed="تعذر تحميل ما يحتاج انتباهك الآن."
              stillTrue="هذا لا يعني أنه لا توجد مهام أو مواعيد مرتبطة بك."
              guidance="أعد القراءة قبل الاستنتاج أنه لا يوجد شيء مطلوب."
              action={refreshAction}
            />
          ) : empty ? (
            <EmptyState
              variant="no-data"
              icon="check-circle"
              statement="لا شيء يحتاج منك إجراء الآن."
              reason="سنُظهر هنا فقط ما يحتاجك فعلًا، بدل إنشاء نشاط لا يفيدك."
            />
          ) : (
            <>
              {isStale ? (
                <RecoveryState
                  variant="stale"
                  whatFailed={state === 'offline' ? 'أنت غير متصل الآن.' : 'قد لا تكون هذه البيانات الأحدث.'}
                  stillTrue="نعرض آخر بيانات آمنة معروفة، لكن حالة السجل الحالية تُقرأ من جديد عند توفر الاتصال."
                  asOf={asOfIso ? `آخر قراءة: ${formatDateTime(asOfIso)}` : undefined}
                  guidance="لا تعتمد على هذه النسخة لتنفيذ إجراء يغيّر الحالة."
                  action={refreshAction}
                />
              ) : state === 'partial' ? (
                <RecoveryState
                  variant="fetch-failure"
                  whatFailed="تعذر تحميل جزء من عناصر الانتباه."
                  stillTrue="العناصر الظاهرة أدناه معروفة، لكن القائمة غير مكتملة ولا تعني أن هذه كل المهام."
                  guidance="حدّث الصفحة لإعادة قراءة المصادر التي لم تكتمل."
                  action={refreshAction}
                />
              ) : null}

              <AttentionNotificationFeed
                entries={entries}
                variant="attention"
                nowIso={nowIso}
                onOpen={onOpenAttention}
              />
            </>
          )}
        </View>

        {!permissionDenied && !fetchFailed ? (
          <View style={{ gap: space('stack-sm') }}>
            <Heading3>الوصول السريع</Heading3>
            <NavigationRow label="ابحث عن رعاية" hint="تصفح مجالات وخدمات الرعاية المتاحة." onPress={onFindCare} />
            <NavigationRow label="رعايتي" hint="افتح حجوزاتك وحالاتك ومتابعاتك من سياقها الحالي." onPress={onOpenMyCare} />
            <NavigationRow label="ملفي" hint="راجع هويتك وإعدادات التمثيل والوجهات المسموح بها." onPress={onOpenProfile} />
          </View>
        ) : null}

        {!permissionDenied && onOpenNotifications ? (
          <View style={{ gap: space('stack-xs') }}>
            <Helper>سجل التغييرات</Helper>
            <NavigationRow
              label="مركز الإشعارات"
              hint="سجل زمني دائم للتغييرات. ليس تبويبًا رئيسيًا إضافيًا."
              onPress={onOpenNotifications}
            />
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
