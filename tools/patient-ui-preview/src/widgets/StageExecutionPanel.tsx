import { View } from 'react-native';
import { StateChip } from '../components/StateChip';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { PatientStageProjection, TreatmentStageState } from '../mocks/stages';
import { borderWidth, color, radius, space } from '../theme/tokens';

const STATE_LABEL: Record<TreatmentStageState, string> = {
  INCOMPLETE: 'لم تكتمل بعد',
  COMPLETED: 'مكتملة',
  REOPENED: 'أُعيد فتحها',
};

function RequirementRow({
  label,
  meaning,
  satisfied,
}: {
  label: string;
  meaning: string;
  satisfied: boolean;
}) {
  return (
    <View
      role="listitem"
      accessible
      accessibilityLabel={`${label}. ${satisfied ? 'مستوفى' : 'ما زال مطلوبًا'}. ${meaning}`}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space('inline-sm'),
        paddingVertical: space('inset-sm'),
        borderBottomWidth: borderWidth('hairline'),
        borderBottomColor: color('border.subtle'),
      }}
    >
      <Icon
        name={satisfied ? 'check-circle' : 'ellipsis-horizontal-circle'}
        color={satisfied ? color('tone.success.icon') : color('text.secondary')}
        scale="sm"
      />
      <View style={{ flex: 1, gap: space('stack-xs') }}>
        <BodyStrong>{label}</BodyStrong>
        <Helper>{satisfied ? 'مستوفى' : 'ما زال مطلوبًا'}</Helper>
        <Body tone="secondary">{meaning}</Body>
      </View>
    </View>
  );
}

/**
 * WGT-CLINICAL-003 — Profile C `patient` variant. This is intentionally read-only and patient-safe.
 * Requirements come from this case's accepted snapshot. The projection contains no private evidence,
 * storage path, signed link, scanner detail, completion action, or reopening action.
 */
export function StageExecutionPanel({ stage }: { stage: PatientStageProjection }) {
  return (
    <View style={{ gap: space('stack-lg') }}>
      <View
        style={{
          gap: space('stack-sm'),
          padding: space('inset-md'),
          borderRadius: radius('surface'),
          borderWidth: borderWidth('hairline'),
          borderColor: color('border.subtle'),
          backgroundColor: color('surface.default'),
        }}
      >
        <Helper>{stage.sequenceLabel}</Helper>
        <Heading3>{stage.title}</Heading3>
        <StateChip machine="treatment-stage" status={stage.state} label={STATE_LABEL[stage.state]} />
      </View>

      <View style={{ gap: space('stack-sm') }}>
        <Heading3>ما الذي تغطيه هذه المرحلة؟</Heading3>
        {stage.coverage.map((item) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
            <Icon name="check-circle" color={color('tone.success.icon')} scale="sm" />
            <Body style={{ flex: 1 }}>{item}</Body>
          </View>
        ))}
        <Helper>هذه التفاصيل مأخوذة من الخطة المقبولة لهذه الحالة، وليست من نموذج عام.</Helper>
      </View>

      <View style={{ gap: space('stack-sm') }}>
        <Heading3>متطلبات المرحلة</Heading3>
        {stage.requirements.length === 0 ? (
          <Body>لا توجد متطلبات إضافية مسجلة لهذه المرحلة.</Body>
        ) : (
          <View accessibilityRole="list">
            {stage.requirements.map((requirement) => (
              <RequirementRow
                key={requirement.id}
                label={requirement.label}
                meaning={requirement.patientMeaning}
                satisfied={requirement.status === 'satisfied'}
              />
            ))}
          </View>
        )}
      </View>

      {stage.completedBy && stage.completedAtIso ? (
        <View
          style={{
            gap: space('stack-xs'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <BodyStrong>الإكمال المسجَّل سابقًا</BodyStrong>
          <Body>{stage.completedBy}</Body>
          <Helper>{formatDateTime(stage.completedAtIso)}</Helper>
          {stage.completionBasis ? <Body tone="secondary">{stage.completionBasis}</Body> : null}
        </View>
      ) : null}

      {stage.state === 'REOPENED' ? (
        <View
          style={{
            gap: space('stack-sm'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('tone.info.border'),
            backgroundColor: color('tone.info.fill'),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}>
            <Icon name="arrow-path" color={color('tone.info.icon')} />
            <BodyStrong>إعادة الفتح تصحيح مسجَّل، وليست حذفًا للإكمال السابق.</BodyStrong>
          </View>
          {stage.reopenedBy ? <Body>أعاد فتحها: {stage.reopenedBy}</Body> : null}
          {stage.reopenedAtIso ? <Helper>{formatDateTime(stage.reopenedAtIso)}</Helper> : null}
          <View style={{ gap: space('stack-xs') }}>
            <Helper>سبب إعادة الفتح</Helper>
            <Body>{stage.reopeningReason ?? 'سبب إعادة الفتح غير متاح حاليًا.'}</Body>
          </View>
        </View>
      ) : null}
    </View>
  );
}
