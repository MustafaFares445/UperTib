import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientCase } from '../mocks/clinical';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function RouteCard({ label, detail, onPress }: { label: string; detail: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: pressed ? color('action.secondary-hover') : color('surface.default'),
      })}
    >
      <BodyStrong tone="link">{label}</BodyStrong>
      <Helper>{detail}</Helper>
    </Pressable>
  );
}

export function CaseSummaryScreen({
  item,
  subject = 'حالتك العلاجية',
  authority,
  onOpenPlan,
  onOpenTimeline,
  onActOutstanding,
  onOpenFinance,
  onOpenReviews,
}: {
  item: PatientCase;
  subject?: string;
  authority?: string;
  onOpenPlan?: () => void;
  onOpenTimeline: () => void;
  onActOutstanding?: () => void;
  onOpenFinance?: () => void;
  onOpenReviews?: () => void;
}) {
  return (
    <Screen
      footer={item.outstandingAction && onActOutstanding ? (
        <ActionBar actions={[{
          key: 'outstanding',
          label: 'تنفيذ الإجراء المطلوب',
          role: 'primary',
          availability: { status: 'available' },
          onPress: onActOutstanding,
        }]} />
      ) : undefined}
    >
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="الحالة العلاجية" title={item.serviceLabel} description="هذه الصفحة هي نقطة البداية لكل ما يخص هذه الحالة فقط." />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Helper>الحالة الآن</Helper>
          <BodyStrong>{item.statusLabel}</BodyStrong>
          <Body>{item.providerName}</Body>
          <Helper>{item.branchName} · {item.areaLabel}</Helper>
          <Helper>الطبيب المعالج: {item.treatingDentist}</Helper>
        </View>

        {item.outstandingAction ? (
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
            <Helper>مطلوب منك الآن</Helper>
            <BodyStrong>{item.outstandingAction.label}</BodyStrong>
          </View>
        ) : (
          <View style={{ gap: space('stack-xs') }}>
            <BodyStrong>أنت محدّث الآن</BodyStrong>
            <Helper>لا يوجد إجراء مطلوب منك لهذه الحالة في الوقت الحالي.</Helper>
          </View>
        )}

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>الخطة والمتابعة</Heading3>
          <View style={{ gap: space('stack-xs') }}>
            <Helper>الخطة المقبولة</Helper>
            <BodyStrong>{item.acceptedPlanVersion ?? 'لا توجد خطة مقبولة بعد'}</BodyStrong>
          </View>
          <View style={{ gap: space('stack-xs') }}>
            <Helper>المتابعة التالية</Helper>
            <BodyStrong>{item.nextFollowUpIso ? formatDateTime(item.nextFollowUpIso) : 'لا توجد متابعة مجدولة حاليًا'}</BodyStrong>
          </View>
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>تفاصيل هذه الحالة</Heading3>
          {onOpenPlan ? <RouteCard label="الخطة العلاجية" detail="اقرأ البنود والمبالغ وما الذي تشمله الخطة." onPress={onOpenPlan} /> : null}
          <RouteCard label="سجل الحالة" detail="تابع الأحداث بالترتيب، بما فيها التصحيحات التي تظهر كأحداث لاحقة." onPress={onOpenTimeline} />
          {item.financialSnapshotAvailable && onOpenFinance ? (
            <RouteCard label="الشروط المالية المسجّلة" detail="عرض سجل الشروط المالية الخارجية المقبولة لهذه الحالة." onPress={onOpenFinance} />
          ) : null}
          {onOpenReviews ? (
            <RouteCard label="تقييم التجربة" detail="اكتب تقييمًا فقط إذا كانت التجربة مكتملة وموثّقة وما زالت ضمن المهلة، أو افتح تقييمك الموجود." onPress={onOpenReviews} />
          ) : null}
        </View>
      </Stack>
    </Screen>
  );
}
