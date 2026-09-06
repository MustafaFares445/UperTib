import { Pressable, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { RecoveryState } from '../components/RecoveryState';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { PatientCase } from '../mocks/clinical';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export type MyCasesState = 'success' | 'empty-no-data' | 'error-fetch';

export interface MyCasesScreenProps {
  cases: PatientCase[];
  state?: MyCasesState;
  subject?: string;
  authority?: string;
  onOpenCase: (item: PatientCase) => void;
  onDiscoverServices?: () => void;
  onRetry?: () => void;
}

function CaseRow({ item, onOpen }: { item: PatientCase; onOpen: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.serviceLabel}. ${item.providerName}. ${item.statusLabel}. ${item.outstandingAction ? `مطلوب منك: ${item.outstandingAction.label}` : 'لا يوجد إجراء مطلوب منك الآن'}`}
      onPress={onOpen}
      style={({ pressed }) => ({
        gap: space('stack-sm'),
        minHeight: size('target-primary'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: item.outstandingAction ? color('tone.warning.border') : color('border.subtle'),
        backgroundColor: item.outstandingAction ? color('tone.warning.fill') : color('surface.default'),
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{item.serviceLabel}</BodyStrong>
        <Body tone="secondary">{item.providerName}</Body>
        <Helper>{item.branchName} · {item.areaLabel}</Helper>
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{item.statusLabel}</BodyStrong>
        {item.acceptedPlanVersion ? <Helper>الخطة المقبولة: {item.acceptedPlanVersion}</Helper> : <Helper>لا توجد خطة مقبولة بعد.</Helper>}
        {item.nextFollowUpIso ? <Helper>المتابعة التالية: {formatDateTime(item.nextFollowUpIso)}</Helper> : null}
      </View>

      {item.outstandingAction ? (
        <View style={{ gap: space('stack-xs'), paddingTop: space('stack-xs'), borderTopWidth: borderWidth('hairline'), borderTopColor: color('tone.warning.border') }}>
          <Helper>مطلوب منك الآن</Helper>
          <BodyStrong>{item.outstandingAction.label}</BodyStrong>
        </View>
      ) : (
        <Helper>لا يوجد إجراء مطلوب منك الآن.</Helper>
      )}

      <BodyStrong tone="link">فتح الحالة</BodyStrong>
    </Pressable>
  );
}

/** SCR-CLINICAL-001 — case navigation container; one case block per reading column. */
export function MyCasesScreen({
  cases,
  state = 'success',
  subject = 'حالاتك العلاجية',
  authority,
  onOpenCase,
  onDiscoverServices,
  onRetry,
}: MyCasesScreenProps) {
  return (
    <Screen>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="رعايتي" title="حالاتي العلاجية" description="كل خطة وسجل ومتابعة تبدأ من الحالة التي تخصها." />
        <SubjectContextHeader subject={subject} authority={authority} />

        {state === 'error-fetch' ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر تحميل الحالات العلاجية."
            stillTrue="لا يعني ذلك أن حالاتك حُذفت أو أُغلقت."
            guidance="أعد المحاولة لقراءة القائمة المحدثة."
            action={onRetry ? { key: 'retry', label: 'إعادة المحاولة', role: 'primary', availability: { status: 'available' }, onPress: onRetry } : undefined}
          />
        ) : state === 'empty-no-data' || cases.length === 0 ? (
          <EmptyState
            variant="no-data"
            icon="document-text"
            statement="لا توجد لديك حالة علاجية بعد."
            reason="تبدأ الحالة عندما تصبح هناك رعاية مرتبطة بك ضمن النظام. يمكنك العودة إلى الخدمات للبحث عن الخطوة المناسبة."
            action={onDiscoverServices ? { key: 'discover', label: 'تصفح الخدمات', role: 'primary', availability: { status: 'available' }, onPress: onDiscoverServices } : undefined}
          />
        ) : (
          <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
            {cases.map((item) => (
              <View key={item.id} role="listitem">
                <CaseRow item={item} onOpen={() => onOpenCase(item)} />
              </View>
            ))}
          </View>
        )}
      </Stack>
    </Screen>
  );
}
