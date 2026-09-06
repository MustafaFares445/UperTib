import { Pressable, View } from 'react-native';
import { EvidenceTransferItem } from '../components/EvidenceTransferItem';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { EvidenceRequirementProjection } from '../mocks/evidence';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

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
}: {
  requirements: EvidenceRequirementProjection[];
  onAddItem?: (requirementId: string) => void;
  onResume?: (itemId: string) => void;
  onRetry?: (itemId: string) => void;
  onReplace?: (itemId: string) => void;
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

  return (
    <View style={{ gap: space('stack-lg') }}>
      {requirements.map((requirement) => (
        <View
          key={requirement.id}
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
      ))}
    </View>
  );
}
