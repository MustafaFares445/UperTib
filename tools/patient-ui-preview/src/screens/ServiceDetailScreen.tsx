import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2, Heading4 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ServiceFamily } from '../mocks/catalog';

export interface ServiceDetailScreenProps {
  family: ServiceFamily;
  onFindProviders: () => void;
  onBack: () => void;
}

/**
 * SCR-CATALOG-002 — Service detail. Describes one service family in plain, non-diagnostic language
 * and carries its service code into provider search (API-ELIG-001 requires it) without ever
 * showing that code to the patient. No procedure item appears as a selectable or priced option.
 */
export function ServiceDetailScreen({ family, onFindProviders, onBack }: ServiceDetailScreenProps) {
  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            { key: 'find', label: 'البحث عن مقدّمي الخدمة', role: 'primary', availability: { status: 'available' }, onPress: onFindProviders },
            { key: 'back', label: 'رجوع إلى المجموعات', role: 'secondary', availability: { status: 'available' }, onPress: onBack },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading2>{family.name}</Heading2>
        <Body>{family.summary}</Body>
        <Stack gap="stack-xs">
          <Heading4>ماذا تشمل هذه الخدمة عادةً؟</Heading4>
          <Body tone="secondary">{family.covers}</Body>
        </Stack>
      </Stack>
    </Screen>
  );
}
