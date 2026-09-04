import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, Helper } from '../foundations/Text';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export interface ProviderComparisonScreenProps {
  options: ProviderOption[];
  onBook: (option: ProviderOption) => void;
  onOpen: (option: ProviderOption) => void;
  onBack: () => void;
}

function SelectionControl({ option, selected, onSelect }: { option: ProviderOption; selected: boolean; onSelect: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityLabel={`اختيار ${option.providerName} للحجز`}
      onPress={onSelect}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space('inline-xs'),
        paddingHorizontal: space('inset-md'),
        borderRadius: radius('control'),
        borderWidth: borderWidth(selected ? 'emphasis' : 'hairline'),
        borderColor: selected ? color('state.selected.border') : color('border.strong'),
        backgroundColor: selected ? color('state.selected.surface') : pressed ? color('action.secondary-hover') : color('surface.default'),
      })}
    >
      <Icon name={selected ? 'check-circle' : 'plus-circle'} color={selected ? color('action.primary') : color('text.secondary')} scale="sm" />
      <Body tone={selected ? 'link' : 'primary'}>{selected ? 'الخيار المحدد للحجز' : 'اختيار هذا الخيار'}</Body>
    </Pressable>
  );
}

/**
 * SCR-ELIG-005 — transient same-service comparison. Nothing is saved, ranked, recommended, or
 * compared across services. Compact widths stack options in selection order with identical fact
 * order so the comparison remains readable without horizontal scrolling.
 */
export function ProviderComparisonScreen({ options, onBook, onOpen, onBack }: ProviderComparisonScreenProps) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const chosen = options.find((option) => option.id === chosenId);
  const oneService = new Set(options.map((option) => option.serviceLabel)).size === 1;

  if (options.length < 2 || options.length > 3 || !oneService) {
    return (
      <Screen
        footer={
          <ActionBar
            actions={[{ key: 'back', label: 'رجوع إلى النتائج', role: 'primary', availability: { status: 'available' }, onPress: onBack }]}
          />
        }
      >
        <ScreenHeader
          eyebrow="المقارنة"
          title="تعذر فتح هذه المقارنة"
          description="اختر خيارين أو ثلاثة للخدمة نفسها من نتائج البحث، ثم حاول مجددًا."
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            {
              key: 'book',
              label: 'متابعة لحجز الخيار المحدد',
              role: 'primary',
              availability: chosen ? { status: 'available' } : { status: 'disabled', reason: 'اختر خيارًا واحدًا للمتابعة.' },
              onPress: () => chosen && onBook(chosen),
            },
            { key: 'back', label: 'تعديل المقارنة', role: 'secondary', availability: { status: 'available' }, onPress: onBack },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`${options[0].serviceLabel} · ${options.length} خيارات`}
          title="قارن التفاصيل نفسها"
          description="لا يوجد خيار موصى به أو ترتيب. قارن ما يهمك ثم حدّد خيارًا واحدًا للحجز."
        />
        <View accessibilityRole="radiogroup" style={{ gap: space('stack-lg') }}>
          {options.map((option, index) => (
            <View key={option.id} style={{ gap: space('stack-sm') }}>
              <Helper>الخيار {index + 1}</Helper>
              <ProviderDecisionCard option={option} variant="comparison" selected={chosenId === option.id} />
              <SelectionControl option={option} selected={chosenId === option.id} onSelect={() => setChosenId(option.id)} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`عرض التفاصيل الكاملة لـ ${option.providerName}`}
                onPress={() => onOpen(option)}
                style={({ pressed }) => ({
                  minHeight: size('target-floor'),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? color('action.secondary-hover') : 'transparent',
                })}
              >
                <Body tone="link">عرض التفاصيل الكاملة</Body>
              </Pressable>
            </View>
          ))}
        </View>
      </Stack>
    </Screen>
  );
}
