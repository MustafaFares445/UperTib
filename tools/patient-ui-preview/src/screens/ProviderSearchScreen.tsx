import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { FilterSearchBar } from '../components/FilterSearchBar';
import type { ServiceFamily } from '../mocks/catalog';

export interface ProviderSearchScreenProps {
  family: ServiceFamily;
  onSearch: (area: string) => void;
  onChangeService: () => void;
}

/**
 * SCR-ELIG-001 — Provider search. Lets the patient state what they need and where, and reach
 * results. Aleppo only, so area is a within-city filter, never a city selector.
 */
export function ProviderSearchScreen({ family, onSearch, onChangeService }: ProviderSearchScreenProps) {
  const [area, setArea] = useState('');

  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            { key: 'search', label: 'بحث', role: 'primary', availability: { status: 'available' }, onPress: () => onSearch(area) },
            { key: 'change', label: 'تغيير الخدمة', role: 'secondary', availability: { status: 'available' }, onPress: onChangeService },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading2>البحث عن مقدّمي الخدمة</Heading2>
        <Body tone="secondary">الخدمة المختارة: {family.name}</Body>
        <FilterSearchBar label="المنطقة داخل حلب (اختياري)" value={area} onChangeText={setArea} placeholder="مثال: حلب الجديدة" />
      </Stack>
    </Screen>
  );
}
