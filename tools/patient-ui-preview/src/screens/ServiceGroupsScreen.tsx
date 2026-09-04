import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Heading2, Heading3, Helper } from '../foundations/Text';
import { EmptyState } from '../components/EmptyState';
import { FilterSearchBar } from '../components/FilterSearchBar';
import { useFocusRing } from '../foundations/useFocusRing';
import { serviceCatalog, type ServiceFamily } from '../mocks/catalog';
import { color, space } from '../theme/tokens';

export interface ServiceGroupsScreenProps {
  onChooseFamily: (family: ServiceFamily) => void;
}

/**
 * A plain list row, not a bounded card: a service family is a navigable list item, not an
 * independently comparable/selectable unit (DESIGN_DIRECTION.md "cards are a container of last
 * resort"). Separation between families comes from a hairline divider, not a border box.
 */
function FamilyRow({ family, onPress, first }: { family: ServiceFamily; onPress: () => void; first: boolean }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={family.name}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        gap: space('stack-xs'),
        paddingVertical: space('inset-sm'),
        borderTopWidth: first ? 0 : 1,
        borderTopColor: color('border.subtle'),
        backgroundColor: pressed ? color('action.secondary-hover') : 'transparent',
        ...ring.ringStyle,
      })}
    >
      <BodyStrong>{family.name}</BodyStrong>
      <Helper>{family.summary}</Helper>
    </Pressable>
  );
}

/**
 * SCR-CATALOG-001 — Service groups. Lets anyone browse the service groups and the patient-facing
 * families under them, in plain language requiring no professional vocabulary. Choosing a family
 * carries its service code forward without ever displaying that code to the patient.
 */
export function ServiceGroupsScreen({ onChooseFamily }: ServiceGroupsScreenProps) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return serviceCatalog;
    return serviceCatalog
      .map((group) => ({
        ...group,
        families: group.families.filter((family) => `${family.name} ${family.summary}`.includes(normalized)),
      }))
      .filter((group) => group.families.length > 0);
  }, [query]);

  return (
    <Screen>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الخدمات المتاحة في حلب"
          title="ما الخدمة التي تبحث عنها؟"
          description="اختر خدمة مفهومة أولًا، ثم سنعرض مقدّمي الخدمة المتاحين لها."
        />
        <FilterSearchBar
          label="البحث في الخدمات"
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="مثال: تنظيف أو حشوات"
        />
        {groups.length === 0 ? (
          <EmptyState
            variant="filtered-empty"
            icon="magnifying-glass"
            statement="لا توجد خدمة تطابق كلمات البحث."
            reason="جرّب اسمًا أبسط مثل تنظيف أو حشوات، أو امسح البحث."
          />
        ) : groups.map((group) => (
          <Stack key={group.id} gap="stack-sm">
            <Heading3>{group.name}</Heading3>
            <View>
              {group.families.map((family, index) => (
                <FamilyRow
                  key={family.code}
                  family={family}
                  first={index === 0}
                  onPress={() => onChooseFamily(family)}
                />
              ))}
            </View>
          </Stack>
        ))}
      </Stack>
    </Screen>
  );
}
