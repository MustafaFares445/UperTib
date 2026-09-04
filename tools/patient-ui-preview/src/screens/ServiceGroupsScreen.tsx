import { Pressable, View } from 'react-native';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2, Heading3 } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { serviceCatalog, type ServiceFamily } from '../mocks/catalog';
import { color, radius, space } from '../theme/tokens';

export interface ServiceGroupsScreenProps {
  onChooseFamily: (family: ServiceFamily) => void;
}

function FamilyRow({ family, onPress }: { family: ServiceFamily; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={family.name}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: 1,
        borderColor: color('border.subtle'),
        backgroundColor: pressed ? color('action.secondary-hover') : color('surface.default'),
        ...ring.ringStyle,
      })}
    >
      <Body style={{ fontWeight: '600' }}>{family.name}</Body>
      <Body tone="secondary">{family.summary}</Body>
    </Pressable>
  );
}

/**
 * SCR-CATALOG-001 — Service groups. Lets anyone browse the service groups and the patient-facing
 * families under them, in plain language requiring no professional vocabulary. Choosing a family
 * carries its service code forward without ever displaying that code to the patient.
 */
export function ServiceGroupsScreen({ onChooseFamily }: ServiceGroupsScreenProps) {
  return (
    <Screen>
      <Stack gap="stack-lg">
        <Heading2>تصفّح الخدمات</Heading2>
        {serviceCatalog.map((group) => (
          <Stack key={group.id} gap="stack-sm">
            <Heading3>{group.name}</Heading3>
            <View style={{ gap: space('stack-xs') }}>
              {group.families.map((family) => (
                <FamilyRow key={family.code} family={family} onPress={() => onChooseFamily(family)} />
              ))}
            </View>
          </Stack>
        ))}
      </Stack>
    </Screen>
  );
}
