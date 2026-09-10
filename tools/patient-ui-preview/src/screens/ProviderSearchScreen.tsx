import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { FilterSearchBar } from '../components/FilterSearchBar';
import { useFocusRing } from '../foundations/useFocusRing';
import type { ServiceFamily } from '../mocks/catalog';
import { color, radius, size, space } from '../theme/tokens';

export interface ProviderSearchScreenProps {
  family: ServiceFamily;
  onSearch: (area: string) => void;
  onChangeService: () => void;
}

/**
 * SCR-ELIG-001 — Provider search. The service is already known because API-ELIG-001 requires a
 * service_code. Aleppo is the only V1 city, so area remains an optional within-city refinement and
 * never becomes a required technical filter form.
 */
export function ProviderSearchScreen({ family, onSearch, onChangeService }: ProviderSearchScreenProps) {
  const [area, setArea] = useState('');
  const changeRing = useFocusRing();

  return (
    <Screen
      centerContent
      footer={
        <ActionBar
          actions={[
            {
              key: 'search',
              label: 'عرض الأطباء',
              role: 'primary',
              availability: { status: 'available' },
              onPress: () => onSearch(area.trim()),
            },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="البحث عن طبيب"
          title="أين تفضّل أن تكون العيادة؟"
          description="الخدمة محددة بالفعل. اختر منطقة داخل حلب إن كانت تهمك، أو اتركها فارغة لرؤية كل الخيارات."
        />

        <View
          style={{
            gap: space('stack-sm'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Helper>الخدمة التي تبحث عنها</Helper>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space('inline-sm') }}>
            <BodyStrong>{family.name}</BodyStrong>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`تغيير الخدمة المختارة: ${family.name}`}
              onFocus={changeRing.onFocus}
              onBlur={changeRing.onBlur}
              onPress={onChangeService}
              style={({ pressed }) => ({
                minHeight: size('target-primary'),
                justifyContent: 'center',
                paddingHorizontal: space('inset-sm'),
                opacity: pressed ? 0.8 : 1,
                ...changeRing.ringStyle,
              })}
            >
              <Body tone="link">تغيير الخدمة</Body>
            </Pressable>
          </View>
        </View>

        <FilterSearchBar
          label="المنطقة داخل حلب (اختياري)"
          value={area}
          onChangeText={setArea}
          onClear={() => setArea('')}
          placeholder="مثال: حلب الجديدة"
        />
        <Helper>يمكنك تعديل المنطقة لاحقًا من شاشة النتائج من دون تغيير الخدمة.</Helper>
      </Stack>
    </Screen>
  );
}
