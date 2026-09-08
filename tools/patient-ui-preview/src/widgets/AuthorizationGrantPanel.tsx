import { Pressable, View } from 'react-native';
import { StateChip } from '../components/StateChip';
import { formatDateTime } from '../foundations/format';
import { Body, BodyStrong, Heading3, Helper, Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { RepresentationGrantProjection } from '../mocks/representation';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

const STATUS_LABEL = {
  ACCEPTED: 'فعّالة',
  EXPIRED: 'منتهية الصلاحية',
  REVOKED: 'أُلغيت',
} as const;

function InlineAction({ label, onPress }: { label: string; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      style={({ pressed }) => ({
        minHeight: size('target-floor'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: space('inset-md'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('action.secondary-border'),
        backgroundColor: pressed ? color('action.secondary-hover') : color('action.secondary-surface'),
        ...ring.ringStyle,
      })}
    >
      <BodyStrong style={{ color: color('action.secondary-text') }}>{label}</BodyStrong>
    </Pressable>
  );
}

/** WGT-IDENTITY-002 — patient-readable representation scope and retained history. */
export function AuthorizationGrantPanel({
  grant,
  onOpen,
  mode = 'full',
}: {
  grant: RepresentationGrantProjection;
  onOpen?: () => void;
  mode?: 'summary' | 'full';
}) {
  const period = grant.effectiveUntilIso
    ? `من ${formatDateTime(grant.effectiveFromIso)} حتى ${formatDateTime(grant.effectiveUntilIso)}`
    : `من ${formatDateTime(grant.effectiveFromIso)} دون تاريخ نهاية محدد`;
  const scopeSummary = grant.actions.length <= 2
    ? grant.actions.join(' + ')
    : `${grant.actions.slice(0, 2).join(' + ')} + ${grant.actions.length - 2} إضافية`;

  return (
    <View
      accessible
      accessibilityLabel={`${grant.direction === 'GIVEN' ? 'صلاحية منحتها' : 'صلاحية لديك'}، ${grant.granteeName}، ${grant.subjectPatientName}`}
      style={{
        gap: space('stack-md'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}>
          <Helper>{grant.direction === 'GIVEN' ? 'أنت منحت هذه الصلاحية' : 'هذه الصلاحية تتيح لك التمثيل'}</Helper>
          <Heading3>{grant.direction === 'GIVEN' ? grant.granteeName : grant.subjectPatientName}</Heading3>
        </View>
        <StateChip machine="staff-invitation" status={grant.status} label={STATUS_LABEL[grant.status]} />
      </View>

      {!grant.scopeResolved ? (
        <View accessibilityRole="alert" style={{ gap: space('stack-xs'), padding: space('inset-sm'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <BodyStrong>تعذّر قراءة نطاق هذه الصلاحية.</BodyStrong>
          <Body>لن نعامل النطاق المجهول كأنه كامل، لذلك لا يتوفر فتحه أو استخدامه حتى تُقرأ تفاصيله بأمان.</Body>
        </View>
      ) : mode === 'summary' ? (
        <>
          <BodyStrong>{scopeSummary}</BodyStrong>
          <Helper>{period}</Helper>
          {onOpen ? <InlineAction label="فتح تفاصيل الصلاحية" onPress={onOpen} /> : null}
        </>
      ) : (
        <>
          <View style={{ gap: space('stack-sm') }}>
            <View style={{ gap: space('stack-xs') }}><Label>من يتصرف؟</Label><Body>{grant.granteeName}</Body></View>
            <View style={{ gap: space('stack-xs') }}><Label>لصالح من؟</Label><Body>{grant.subjectPatientName}</Body></View>
            <View style={{ gap: space('stack-xs') }}>
              <Label>ما الذي تسمح به؟</Label>
              {grant.actions.map((action) => <Body key={action}>• {action}</Body>)}
            </View>
            <View style={{ gap: space('stack-xs') }}>
              <Label>ما البيانات التي يشملها النطاق؟</Label>
              {grant.dataScope.map((scope) => <Body key={scope}>• {scope}</Body>)}
            </View>
          </View>
          <View style={{ gap: space('stack-xs') }}><Label>الغرض</Label><Body>{grant.purpose}</Body></View>
          <View style={{ gap: space('stack-xs') }}><Label>الفترة الفعّالة</Label><Body>{period}</Body></View>
          <View style={{ gap: space('stack-xs') }}><Label>الأساس</Label><Body>{grant.basisLabel}</Body></View>
          {grant.status === 'REVOKED' && grant.revokedAtIso ? (
            <View style={{ gap: space('stack-xs') }}>
              <Label>سجل الإلغاء</Label><Body>{formatDateTime(grant.revokedAtIso)}</Body>
              {grant.revocationReason ? <Helper>{grant.revocationReason}</Helper> : null}
            </View>
          ) : null}
          <Helper>{grant.historicalAttribution}</Helper>
          {onOpen ? <InlineAction label="فتح تفاصيل الصلاحية" onPress={onOpen} /> : null}
        </>
      )}
    </View>
  );
}
