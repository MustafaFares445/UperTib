import { Pressable, View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { RepresentationGrantProjection } from '../mocks/representation';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function SubjectOption({ grant, onSelect }: { grant: RepresentationGrantProjection; onSelect: () => void }) {
  const ring = useFocusRing();
  const scope = grant.actions.length <= 2 ? grant.actions.join(' + ') : `${grant.actions.slice(0, 2).join(' + ')} + ${grant.actions.length - 2} إضافية`;
  return (
    <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
      <Heading3>{grant.subjectPatientName}</Heading3>
      <BodyStrong>أنت تتصرف بموجب صلاحية فعّالة</BodyStrong>
      <Helper>{scope}</Helper>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`التبديل إلى ${grant.subjectPatientName}`}
        onPress={onSelect}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        style={({ pressed }) => ({ minHeight: size('target-primary'), alignItems: 'center', justifyContent: 'center', paddingHorizontal: space('inset-md'), borderRadius: radius('control'), backgroundColor: pressed ? color('action.primary-hover') : color('action.primary'), ...ring.ringStyle })}
      >
        <BodyStrong style={{ color: color('text.on-action') }}>التبديل إلى هذا المريض</BodyStrong>
      </Pressable>
    </View>
  );
}

/** SCR-IDENTITY-008 — choose a represented subject without turning context selection into authority. */
export function ActivePatientContextScreen({ actingGuardianName, grants, onSelect, onCancel }: {
  actingGuardianName: string;
  grants: RepresentationGrantProjection[];
  onSelect: (grant: RepresentationGrantProjection) => void;
  onCancel: () => void;
}) {
  const selectable = grants.filter((grant) => grant.direction === 'HELD' && grant.status === 'ACCEPTED' && grant.scopeResolved);
  const actions: ActionSpec[] = [{ key: 'cancel', label: 'إلغاء', role: 'secondary', availability: { status: 'available' }, onPress: onCancel }];
  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="المريض النشط" title="اختر المريض الذي ستمثله" description="التبديل يغيّر ما يظهر لك فقط؛ لا ينشئ صلاحية ولا يوسّعها. كل قراءة أو إجراء محمي يُراجع مقابل الصلاحية الفعّالة من جديد." />
        <SubjectContextHeader subject={`الهوية المتصرفة: ${actingGuardianName}`} authority="أنت لا تتحول إلى هوية المريض" />
        <ContextNote icon="shield-check" title="هويتك تبقى هي المنفّذة" body="يبقى المريض المختار صاحب السجل، وتبقى أفعالك منسوبة إليك." />
        <View style={{ gap: space('stack-sm') }}>
          <Heading3>مرضى يمكن تمثيلهم الآن</Heading3>
          {selectable.length ? selectable.map((grant) => <SubjectOption key={grant.id} grant={grant} onSelect={() => onSelect(grant)} />) : (
            <View style={{ gap: space('stack-xs') }}><BodyStrong>لا توجد صلاحية فعّالة قابلة للاستخدام الآن.</BodyStrong><Body>الصلاحية المنتهية أو الملغاة أو غير المقروء نطاقها لا تظهر للاختيار.</Body></View>
          )}
        </View>
      </Stack>
    </Screen>
  );
}
