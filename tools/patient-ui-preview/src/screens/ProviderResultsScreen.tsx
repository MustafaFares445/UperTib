import { useState } from 'react';
import { View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { ProviderOptionSet, type ProviderOptionSetState } from '../widgets/ProviderOptionSet';
import { ProviderAvatar } from '../components/ProviderIdentity';
import { borderWidth, color, radius, space } from '../theme/tokens';

export interface ProviderResultsScreenProps {
  serviceName: string;
  area: string;
  state: ProviderOptionSetState;
  options: ProviderOption[];
  onOpen: (option: ProviderOption) => void;
  onRetry: () => void;
  onClearFilter: () => void;
  onChangeSearch: () => void;
  onCompare?: (options: ProviderOption[]) => void;
}

/**
 * SCR-ELIG-002 — Provider results. Shows every currently eligible provider/service/branch
 * combination for the requested service, each as a full decision card. No row shows a composite
 * score, a rank, or any internal classification symbol.
 */
export function ProviderResultsScreen({
  serviceName,
  area,
  state,
  options,
  onOpen,
  onRetry,
  onClearFilter,
  onChangeSearch,
  onCompare,
}: ProviderResultsScreenProps) {
  const [selected, setSelected] = useState<ProviderOption[]>([]);

  function toggleComparison(option: ProviderOption) {
    setSelected((current) =>
      current.some((selectedOption) => selectedOption.id === option.id)
        ? current.filter((selectedOption) => selectedOption.id !== option.id)
        : current.length < 3
          ? [...current, option]
          : current,
    );
  }

  return (
    <Screen
      footer={
        <Stack gap="stack-sm">
          {state === 'success' && selected.length ? (
            <View
              accessible
              accessibilityLiveRegion="polite"
              accessibilityLabel={`تم اختيار ${selected.length} من ${options.length} للمقارنة`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: space('inline-sm'),
                padding: space('inset-sm'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('state.selected.border'),
                backgroundColor: color('state.selected.surface'),
              }}
            >
              <View style={{ flexDirection: 'row', gap: space('inline-xs') }}>
                {selected.map((option) => <ProviderAvatar key={option.id} name={option.providerName} compact />)}
              </View>
              <BodyStrong>{selected.length} من {options.length} للمقارنة</BodyStrong>
            </View>
          ) : null}
          <ActionBar
            actions={[
              ...(state === 'success' && selected.length
                ? [{
                    key: 'compare',
                    label: 'مقارنة الخيارات',
                    role: 'primary' as const,
                    availability: selected.length >= 2 && onCompare
                      ? { status: 'available' as const }
                      : { status: 'disabled' as const, reason: 'اختر خيارين على الأقل للمقارنة.' },
                    onPress: () => onCompare?.(selected),
                  }]
                : []),
              { key: 'change', label: 'تعديل البحث', role: 'secondary', availability: { status: 'available' }, onPress: onChangeSearch },
            ]}
          />
        </Stack>
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={area ? `${serviceName} · ${area}` : serviceName}
          title="اختر طبيبك"
          description="السعر والتقييم وأقرب موعد أمامك. يمكنك مقارنة حتى 3 خيارات."
        />
        <ProviderOptionSet
          state={state}
          options={options}
          onChoose={onOpen}
          onRetry={onRetry}
          onClearFilter={onClearFilter}
          selectedIds={selected.map((selectedOption) => selectedOption.id)}
          onToggleCompare={state === 'success' ? toggleComparison : undefined}
        />
        {state === 'success' && selected.length ? (
          <Helper accessibilityLiveRegion="polite">يمكنك إزالة أي خيار من بطاقته قبل فتح المقارنة.</Helper>
        ) : null}
      </Stack>
    </Screen>
  );
}
