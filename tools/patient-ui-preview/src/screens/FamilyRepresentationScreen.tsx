import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { RepresentationGrantProjection } from '../mocks/representation';
import { space } from '../theme/tokens';
import { AuthorizationGrantPanel } from '../widgets/AuthorizationGrantPanel';

/** SCR-IDENTITY-005 — both directions of family representation, never merged into one ambiguous list. */
export function FamilyRepresentationScreen({
  patientName,
  grants,
  onCreateGrant,
  onOpenGrant,
  onSwitchPatient,
}: {
  patientName: string;
  grants: RepresentationGrantProjection[];
  onCreateGrant?: () => void;
  onOpenGrant?: (grant: RepresentationGrantProjection) => void;
  onSwitchPatient?: () => void;
}) {
  const given = grants.filter((grant) => grant.direction === 'GIVEN' && grant.status === 'ACCEPTED');
  const held = grants.filter((grant) => grant.direction === 'HELD' && grant.status === 'ACCEPTED');
  const history = grants.filter((grant) => grant.status !== 'ACCEPTED');

  const actions: ActionSpec[] = [];
  if (onCreateGrant) {
    actions.push({
      key: 'create',
      label: 'منح صلاحية لشخص آخر',
      role: 'primary',
      availability: { status: 'available' },
      onPress: onCreateGrant,
    });
  }
  if (onSwitchPatient && held.some((grant) => grant.scopeResolved)) {
    actions.push({
      key: 'switch',
      label: 'اختيار مريض أمثله',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onSwitchPatient,
    });
  }

  return (
    <Screen footer={actions.length ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="العائلة والتمثيل"
          title="من يستطيع التصرّف لصالح من؟"
          description="نفصل الصلاحيات التي منحتها عن الصلاحيات التي لديك للآخرين، حتى لا يختلط صاحب السجل بمن يتصرف نيابةً عنه."
        />
        <SubjectContextHeader subject={patientName} authority="لحسابك" />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>الصلاحيات التي منحتها أنت</Heading3>
          <Helper>هؤلاء يمكنهم التصرف لصالحك فقط ضمن النطاق والفترة الظاهرين لكل صلاحية.</Helper>
          {given.length ? given.map((grant) => (
            <AuthorizationGrantPanel
              key={grant.id}
              grant={grant}
              onOpen={grant.scopeResolved && onOpenGrant ? () => onOpenGrant(grant) : undefined}
            />
          )) : (
            <View style={{ gap: space('stack-xs') }}>
              <BodyStrong>لم تمنح صلاحيات فعّالة حاليًا.</BodyStrong>
              <Body>يمكنك إنشاء صلاحية محددة النطاق عندما تحتاج شخصًا آخر ليتصرف لصالحك.</Body>
            </View>
          )}
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>الصلاحيات التي لديك للآخرين</Heading3>
          <Helper>هذه لا تغيّر هويتك. أنت تبقى الشخص المتصرف، والمريض الذي تمثله يبقى صاحب السجل.</Helper>
          {held.length ? held.map((grant) => (
            <AuthorizationGrantPanel
              key={grant.id}
              grant={grant}
              onOpen={grant.scopeResolved && onOpenGrant ? () => onOpenGrant(grant) : undefined}
            />
          )) : (
            <Body>لا توجد لديك صلاحية فعّالة لتمثيل مريض آخر.</Body>
          )}
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>السجل السابق</Heading3>
          <Helper>الصلاحيات المنتهية أو الملغاة تبقى هنا كسجل ولا تُحذف معها نسبة الإجراءات السابقة إلى منفذها.</Helper>
          {history.length ? history.map((grant) => (
            <AuthorizationGrantPanel
              key={grant.id}
              grant={grant}
              onOpen={grant.scopeResolved && onOpenGrant ? () => onOpenGrant(grant) : undefined}
            />
          )) : <Body>لا يوجد سجل سابق بعد.</Body>}
        </View>
      </Stack>
    </Screen>
  );
}
