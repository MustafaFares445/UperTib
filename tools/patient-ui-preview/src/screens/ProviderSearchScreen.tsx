import { useState } from 'react';
import { View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { FilterSearchBar } from '../components/FilterSearchBar';
import type { ServiceFamily } from '../mocks/catalog';
import { color, radius, space } from '../theme/tokens';

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
      centerContent
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
        <ScreenHeader
          eyebrow="البحث عن مقدّمي الخدمة"
          title="حدّد المنطقة إن رغبت"
          description="سنبحث عن الخيارات المتاحة لهذه الخدمة في حلب. ترك المنطقة فارغة يعرض كل المناطق."
        />
        <View style={{ gap: space('stack-xs'), padding: space('inset-sm'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Helper>الخدمة المختارة</Helper>
          <BodyStrong>{family.name}</BodyStrong>
        </View>
        <FilterSearchBar
          label="المنطقة داخل حلب (اختياري)"
          value={area}
          onChangeText={setArea}
          onClear={() => setArea('')}
          placeholder="مثال: حلب الجديدة"
        />
      </Stack>
    </Screen>
  );
}
