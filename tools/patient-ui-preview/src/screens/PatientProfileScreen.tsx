import { Pressable, View } from 'react-native';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Icon, type IconName } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientProfileProjection } from '../mocks/profile';
import { borderWidth, chipVisual, color, radius, resolve, size, space } from '../theme/tokens';

export type PatientProfileScreenState = 'success' | 'stale' | 'offline' | 'error-fetch' | 'error-permission';

export interface PatientProfileScreenProps {
  profile: PatientProfileProjection;
  state?: PatientProfileScreenState;
  onOpenRepresentation?: () => void;
  onOpenPendingSubmissions?: () => void;
  onOpenNotifications?: () => void;
  onRefresh?: () => void;
}

function UtilityDestination({
  icon,
  label,
  description,
  onPress,
}: {
  icon: IconName;
  label: string;
  description: string;
  onPress?: () => void;
}) {
  if (!onPress) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${description}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space('inline-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
        opacity: pressed ? (resolve('semantic.opacity.pressed') as number) : 1,
      })}
    >
      <Icon name={icon} color={color('action.primary')} scale="md" />
      <View style={{ flex: 1, gap: space('stack-xs') }}>
        <BodyStrong tone="link">{label}</BodyStrong>
        <Body tone="secondary">{description}</Body>
      </View>
    </Pressable>
  );
}

/** SCR-IDENTITY-004 — Patient identity plus governed representation and utility destinations. */
export function PatientProfileScreen({
  profile,
  state = 'success',
  onOpenRepresentation,
  onOpenPendingSubmissions,
  onOpenNotifications,
  onRefresh,
}: PatientProfileScreenProps) {
  const permissionDenied = state === 'error-permission';
  const fetchFailed = state === 'error-fetch';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const represented = Boolean(profile.representedSubjectName);
  const verifiedVisual = chipVisual(profile.contactVerified ? 'success' : 'warning', 'subtle');

  return (
    <Screen>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الملف الشخصي"
          title="ملفي"
          description="هويتك، سياق التمثيل، والوجهات المساعدة الموثقة في بنية التطبيق."
        />

        <SubjectContextHeader
          subject={represented ? `السجل الحالي: ${profile.representedSubjectName}` : `السجل الحالي: ${profile.displayName}`}
          authority={represented ? `${profile.displayName} يتصرف بصفته المستخدم المسجل. ${profile.representationAuthority ?? ''}` : 'لحسابك'}
        />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك قراءة ملف المريض ضمن الصلاحية الحالية."
            guidance="تغيير المريض المعروض لا يمنح صلاحيات جديدة؛ كل وجهة محمية تعيد تقييم النطاق من الخادم."
          />
        ) : fetchFailed ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر تحميل بيانات الملف الشخصي."
            stillTrue="لم نغيّر هوية المستخدم أو نطاق التمثيل بسبب فشل القراءة."
            guidance="أعد قراءة الملف الموثوق قبل استخدام وجهات التمثيل."
            action={onRefresh ? { key: 'refresh', label: 'إعادة القراءة', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh } : undefined}
          />
        ) : (
          <Stack gap="stack-lg">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'أنت غير متصل الآن.' : 'قد تكون بيانات الملف أقدم من حالتها الحالية.'}
                stillTrue="نعرض آخر هوية آمنة معروفة، لكن كل وجهة محمية تتحقق من الصلاحية عند فتحها."
                guidance="حدّث الملف عندما يعود الاتصال قبل الاعتماد على سياق تمثيل تغيّر مؤخرًا."
                action={onRefresh ? { key: 'refresh', label: 'تحديث الملف', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh } : undefined}
              />
            ) : null}

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>هويتك في UberTib</Heading3>
              <View
                accessible
                accessibilityLabel={`${profile.displayName}. رقم التواصل ${profile.contactLabel}. ${profile.contactVerified ? 'التواصل موثق' : 'التواصل يحتاج تحققًا'}.`}
                style={{
                  gap: space('stack-sm'),
                  padding: space('inset-md'),
                  borderRadius: radius('surface'),
                  borderWidth: borderWidth('hairline'),
                  borderColor: color('border.subtle'),
                  backgroundColor: color('surface.default'),
                }}
              >
                <BodyStrong>{profile.displayName}</BodyStrong>
                <Body>{profile.contactLabel}</Body>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
                  <Icon name={profile.contactVerified ? 'check-circle' : 'exclamation-circle'} color={verifiedVisual.icon} scale="sm" />
                  <BodyStrong style={{ color: verifiedVisual.text }}>
                    {profile.contactVerified ? 'بيانات التواصل موثقة' : 'بيانات التواصل تحتاج تحققًا'}
                  </BodyStrong>
                </View>
                <Helper>لا تُعرض هنا أي تفاصيل داخلية عن الصلاحيات أو رموز التحقق.</Helper>
              </View>
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>العائلة والتمثيل</Heading3>
              <Body tone="secondary">إدارة الأشخاص الذين تمثلهم أو منحتهم صلاحية موجودة في شاشة التمثيل المخصصة، حتى يبقى النطاق واضحًا ولا يتكرر هنا.</Body>
              <UtilityDestination
                icon="eye"
                label="العائلة والتمثيل"
                description="راجع الصلاحيات والمرضى الذين يمكنك تمثيلهم ضمن النطاق المسموح."
                onPress={onOpenRepresentation}
              />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>وجهات مساعدة</Heading3>
              <UtilityDestination
                icon="arrow-path"
                label="الطلبات المعلّقة"
                description="تحقق من نتيجة طلب انقطع اتصاله قبل إرسال أي طلب مكرر."
                onPress={onOpenPendingSubmissions}
              />
              <UtilityDestination
                icon="inbox-arrow-down"
                label="مركز الإشعارات"
                description="السجل الزمني الدائم للتغييرات. هذه وجهة مساعدة وليست تبويبًا رئيسيًا خامسًا."
                onPress={onOpenNotifications}
              />
            </View>
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
