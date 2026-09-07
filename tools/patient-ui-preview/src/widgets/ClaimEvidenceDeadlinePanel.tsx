import { View } from 'react-native';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { formatDateTime } from '../foundations/format';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { CLAIMS_NOW_ISO, type ClaimDeadlineEvent, type ClaimEvidenceRequirement, type ClaimEvidenceState, type ClaimWindowState } from '../mocks/claims';
import { borderWidth, color, radius, space } from '../theme/tokens';

const EVIDENCE_LABEL: Record<ClaimEvidenceState, string> = {
  MISSING: 'ناقص',
  REJECTED: 'مرفوض',
  EXPIRED: 'منتهي الصلاحية',
  ACCEPTED: 'مقبول',
};

const EVIDENCE_ICON: Record<ClaimEvidenceState, IconName> = {
  MISSING: 'exclamation-triangle',
  REJECTED: 'x-circle',
  EXPIRED: 'stop-circle',
  ACCEPTED: 'check-circle',
};

function EvidenceRequirementRow({ requirement }: { requirement: ClaimEvidenceRequirement }) {
  return (
    <View
      style={{
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
        <Icon name={EVIDENCE_ICON[requirement.state]} color={color('text.secondary')} />
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <BodyStrong>{requirement.label}</BodyStrong>
          <Helper>{EVIDENCE_LABEL[requirement.state]}</Helper>
        </View>
      </View>
      <Body>{requirement.reason}</Body>
    </View>
  );
}

/** WGT-CLAIMS-001 — Patient variant: deadline history plus patient-scoped evidence requirements. */
export function ClaimEvidenceDeadlinePanel({
  originalDeadlineIso,
  effectiveDeadlineIso,
  deadlineState = 'running',
  deadlineEvents,
  requirements,
}: {
  originalDeadlineIso: string;
  effectiveDeadlineIso?: string;
  deadlineState?: ClaimWindowState;
  deadlineEvents: ClaimDeadlineEvent[];
  requirements: ClaimEvidenceRequirement[];
}) {
  const outstanding = requirements.filter((item) => item.state !== 'ACCEPTED');

  return (
    <View style={{ gap: space('stack-lg') }}>
      <View style={{ gap: space('stack-sm') }}>
        <Heading3>المهلة التي تحكم هذا الطلب</Heading3>
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
          <View style={{ gap: space('stack-xs') }}>
            <Helper>المهلة الأصلية</Helper>
            <BodyStrong>{formatDateTime(originalDeadlineIso)}</BodyStrong>
          </View>
          <View style={{ gap: space('stack-xs') }}>
            <Helper>المهلة الفعّالة الآن</Helper>
            {effectiveDeadlineIso ? (
              <BodyStrong>{formatDateTime(effectiveDeadlineIso)}</BodyStrong>
            ) : (
              <BodyStrong>غير متاحة حاليًا</BodyStrong>
            )}
          </View>
        </View>
        {effectiveDeadlineIso ? (
          <DeadlineIndicator
            deadlineIso={effectiveDeadlineIso}
            obligation="المهلة الفعّالة لهذا الطلب"
            nowIso={CLAIMS_NOW_ISO}
            state={deadlineState}
          />
        ) : (
          <Helper>غياب المهلة الفعّالة عن القراءة لا يعني أن الطلب بلا مهلة، لذلك لا نستنتج وقتًا متبقيًا.</Helper>
        )}
      </View>

      {deadlineEvents.length > 0 ? (
        <View style={{ gap: space('stack-sm') }}>
          <Heading3>لماذا تغيّرت المهلة؟</Heading3>
          {deadlineEvents.map((event) => (
            <View
              key={event.id}
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.subtle'),
                backgroundColor: color('surface.default'),
              }}
            >
              <BodyStrong>{event.kind === 'EXTENSION' ? 'تمديد مسجّل' : 'توقف واستئناف مسجّل'}</BodyStrong>
              <Body>{event.reason}</Body>
              <Helper>{formatDateTime(event.occurredAtIso)} · أصبحت المهلة {formatDateTime(event.effectiveDeadlineIso)}</Helper>
            </View>
          ))}
          <Helper>هذه الأحداث تُضاف إلى السجل ولا تستبدل المهلة الأصلية.</Helper>
        </View>
      ) : null}

      <View style={{ gap: space('stack-sm') }}>
        <Heading3>متطلبات الطلب</Heading3>
        {requirements.length > 0 ? requirements.map((requirement) => (
          <EvidenceRequirementRow key={requirement.id} requirement={requirement} />
        )) : (
          <Body>لا توجد متطلبات أدلة مسندة لك في هذا الطلب.</Body>
        )}
        {outstanding.length > 0 ? (
          <View style={{ gap: space('stack-xs') }}>
            <BodyStrong>ما يزال مطلوبًا منك: {outstanding.length}</BodyStrong>
            <Helper>{outstanding.map((item) => item.label).join('، ')}</Helper>
          </View>
        ) : (
          <BodyStrong>كل المتطلبات الظاهرة لك مستوفاة حاليًا.</BodyStrong>
        )}
      </View>
    </View>
  );
}
