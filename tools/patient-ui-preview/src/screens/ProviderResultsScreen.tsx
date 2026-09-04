import { useState } from 'react';
import { View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { ProviderOptionSet, type ProviderOptionSetState } from '../widgets/ProviderOptionSet';
import { space } from '../theme/tokens';

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
        <ActionBar
          actions={[
            { key: 'change', label: 'تعديل البحث', role: 'secondary', availability: { status: 'available' }, onPress: onChangeSearch },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={area ? `${serviceName} · ${area}` : serviceName}
          title="قارن ما يهمك قبل الاختيار"
          description="افتح أي خيار للتفاصيل، أو أضف خيارين إلى ثلاثة للمقارنة في عرض واحد. لا يوجد ترتيب للأطباء."
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
        {state === 'success' ? (
          <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm') }}>
            <BodyStrong>{selected.length ? `اخترت ${selected.length} للمقارنة` : 'المقارنة اختيارية'}</BodyStrong>
            <Helper>
              {selected.length < 2
                ? 'اختر خيارين على الأقل. يمكنك مقارنة ثلاثة خيارات كحد أقصى.'
                : 'ستقارن السعر والفرع والموعد والتقييم والتوفر دون ترتيب أو توصية.'}
            </Helper>
            <ActionBar
              actions={[
                {
                  key: 'compare',
                  label: 'مقارنة الخيارات المختارة',
                  role: 'primary',
                  availability:
                    selected.length >= 2 && onCompare
                      ? { status: 'available' }
                      : { status: 'disabled', reason: selected.length < 2 ? 'اختر خيارين على الأقل للمقارنة.' : 'المقارنة غير متاحة من هذه المعاينة.' },
                  onPress: () => onCompare?.(selected),
                },
                ...(selected.length
                  ? [{ key: 'clear', label: 'مسح الاختيار', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: () => setSelected([]) }]
                  : []),
              ]}
            />
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
