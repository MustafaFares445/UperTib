import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { ProviderOptionSet, type ProviderOptionSetState } from '../widgets/ProviderOptionSet';

export interface ProviderResultsScreenProps {
  serviceName: string;
  area: string;
  state: ProviderOptionSetState;
  options: ProviderOption[];
  onOpen: (option: ProviderOption) => void;
  onRetry: () => void;
  onClearFilter: () => void;
  onChangeSearch: () => void;
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
}: ProviderResultsScreenProps) {
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
        <Heading2>نتائج البحث</Heading2>
        <Body tone="secondary">
          {serviceName}
          {area ? ` · ${area}` : ''}
        </Body>
        <ProviderOptionSet state={state} options={options} onChoose={onOpen} onRetry={onRetry} onClearFilter={onClearFilter} />
      </Stack>
    </Screen>
  );
}
