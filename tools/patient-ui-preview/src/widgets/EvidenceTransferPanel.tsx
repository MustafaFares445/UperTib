import { Pressable, View } from 'react-native';
import { DisclosureSection } from '../components/DisclosureSection';
import { EvidenceTransferItem } from '../components/EvidenceTransferItem';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { EvidenceRequirementProjection } from '../mocks/evidence';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function requirementIsComplete(requirement: EvidenceRequirementProjection) {
  return requirement.items.some((item) => item.state === 'ACCEPTED');
}

/**
 * WGT-PLATFORM-008 — Patient evidence-transfer panel. Requirements load before upload controls;
 * evidence is always attached to a governed requirement rather than offered as a free upload bucket.
 * Binary transport/vendor details deliberately stop outside this preview at Q-OPS-001.
 */
export function EvidenceTransferPanel({
  requirements,
  onAddItem,
  onResume,
  onRetry,
  onReplace,
  collapseCompleted = false,
}: {
  requirements: EvidenceRequirementProjection[];
  onAddItem?: (requirementId: string) => void;
  onResume?: (itemId: string) => void;
  onRetry?: (itemId: string) => void;
  onReplace?: (itemId: string) => void;
  /**
   * High-load composition only. Requirements already satisfied by accepted evidence become
   * recoverable history, while every incomplete/rejected/retryable requirement stays expanded.
   */
  collapseCompleted?: boolean;
}) {
  const ring = useFocusRing();

  if (requirements.length === 0) {
    return (
      <View
        style={{
          gap: space('stack-xs'),
          padding: space('inset-md'),
          borderRadius: radius('surface'),
          backgroundColor: color('surface.subtle'),
        }}
      >
        <BodyStrong>لا يوجد مستند مطلوب الآن.</BodyStrong>
        <Body>لا يظهر زر لإضافة ملف عندما لا يكون هناك متطلب مرتبط بالسجل.</Body>
      </View>
    );
  }

  const completedRequirements = collapseCompleted
    ? requirements.filter(requirementIsComplete)
    : [];
  const outstandingRequirements = collapseCompleted
    ? requirements.filter((requirement) => !requirementIsComplete(requirement))
    : requirements;

  const renderRequirement = (requirement: EvidenceRequirementProjection) => (
    <View
      key={requirement.id}
      testID={`evidence-requirement-${requirement.id}`}
      style={{
        gap: space('stack-md'),
        paddingBottom: space('stack-lg'),
        borderBottomWidth: borderWidth('hairline'),
        borderBottomColor: color('border.subtle'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <Heading3>{requirement.title}</Heading3>
        <Body>{requirement.why}</Body>
      </View>

      <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
        {requirement.items.map((item) => (
          <View key={item.id} role="listitem">
            <EvidenceTransferItem
              item={item}
              onResume={onResume ? () => onResume(item.id) : undefined}
              onRetry={onRetry ? () => onRetry(item.id) : undefined}
              onReplace={onReplace ? () => onReplace(item.id) : undefined}
            />
          </View>
        ))}
      </View>

      {onAddItem ? (
        <Pressable
          accessibilityRole="button"
          onFocus={ring.onFocus}
          onBlur={ring.onBlur}
          onPress={() => onAddItem(requirement.id)}
          style={({ pressed }) => ({
            minHeight: size('target-primary'),
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
          <BodyStrong style={{ color: color('action.secondary-text') }}>إضافة ملف لهذا المتطلب</BodyStrong>
        </Pressable>
      ) : (
        <Helper>لا يوجد إجراء لإضافة ملف في هذا العرض التجريبي.</Helper>
      )}
    </View>
  );

  const completedSummary = completedRequirements.length === 1
    ? 'متطلب واحد مكتمل ومحفوظ. لا يحتاج إلى إجراء الآن.'
    : `${completedRequirements.length} متطلبات مكتملة ومحفوظة. لا تحتاج إلى إجراء الآن.`;

  return (
    <View style={{ gap: space('stack-lg') }}>
      {outstandingRequirements.map(renderRequirement)}

      {completedRequirements.length > 0 ? (
        <DisclosureSection
          label="الأدلة المقبولة المكتملة"
          summary={completedSummary}
        >
          <View style={{ gap: space('stack-lg') }}>
            {completedRequirements.map(renderRequirement)}
          </View>
        </DisclosureSection>
      ) : null}
    </View>
  );
}
