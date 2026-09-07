import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { RepresentationGrantProjection } from '../mocks/representation';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { AuthorizationGrantPanel } from '../widgets/AuthorizationGrantPanel';

/** SCR-IDENTITY-007 — one grant, with unconditional revocation and preserved history. */
export function GrantDetailScreen({
  grant,
  onRevoke,
  onBack,
}: {
  grant: RepresentationGrantProjection;
  onRevoke: (reason?: string) => void;
  onBack: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const active = grant.status === 'ACCEPTED' && grant.scopeResolved;

  const actions: ActionSpec[] = [];
  if (active) {
    actions.push({
      key: 'revoke',
      label: confirming ? 'تأكيد إلغاء الصلاحية الآن' : 'إلغاء هذه الصلاحية',
      role: 'destructive',
      availability: { status: 'available' },
      onPress: confirming ? () => onRevoke('انتهت الحاجة إلى التمثيل.') : () => setConfirming(true),
    });
  }
  actions.push({
    key: 'back',
    label: 'العودة إلى العائلة والتمثيل',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onBack,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تفاصيل الصلاحية"
          title="النطاق الذي يحكم التمثيل"
          description="يمكنك قراءة الصلاحية كاملة كسجل. إذا كانت فعّالة، يبقى إلغاؤها متاحًا مهما كانت حالة الحجز أو الحالة العلاجية أو المطالبة."
        />

        <AuthorizationGrantPanel grant={grant} />

        <View
          style={{
            gap: space('stack-sm'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('border.subtle'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Heading3>ماذا يعني الإلغاء؟</Heading3>
          <BodyStrong>يوقف الصلاحية فورًا للأفعال اللاحقة.</BodyStrong>
          <Body>لا يلغي حجزًا موجودًا، ولا يحذف حالة علاجية أو مطالبة، ولا يمحو ما فعله الشخص سابقًا.</Body>
          <Body>كل إجراء تاريخي يبقى منسوبًا إلى الشخص الذي نفّذه، وإذا احتاجت استمرارية الرعاية إلى متابعة فهذه متابعة تشغيلية منفصلة وليست سببًا لرفض الإلغاء.</Body>
          <Helper>لا توجد حالة حجز أو حالة أو مطالبة تستطيع تعطيل زر إلغاء التمثيل.</Helper>
        </View>

        {confirming && active ? (
          <View
            accessibilityRole="alert"
            style={{
              gap: space('stack-sm'),
              padding: space('inset-md'),
              borderRadius: radius('surface'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('border.strong'),
              backgroundColor: color('surface.default'),
            }}
          >
            <Heading3>تأكيد الإلغاء</Heading3>
            <Body>ستُنهي صلاحية {grant.granteeName} للتصرف لصالح {grant.subjectPatientName} ضمن النطاق المعروض أعلاه فورًا.</Body>
            <BodyStrong>السجل السابق لن يُحذف.</BodyStrong>
          </View>
        ) : null}

        {!active ? (
          <View style={{ gap: space('stack-xs') }}>
            <BodyStrong>هذه الصلاحية ليست فعّالة الآن.</BodyStrong>
            <Body>تبقى التفاصيل للقراءة التاريخية، ولا يظهر إجراء إلغاء جديد لصلاحية انتهت أو أُلغيت بالفعل.</Body>
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
