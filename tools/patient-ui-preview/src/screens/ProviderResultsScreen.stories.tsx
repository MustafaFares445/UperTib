import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProviderResultsScreen } from './ProviderResultsScreen';
import { optionsFor } from '../mocks/eligibility';

const meta = {
  title: 'Patient/Screens/SCR-ELIG-002 Provider results',
  component: ProviderResultsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderResultsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  serviceName: 'حشوات الأسنان',
  area: '',
  onOpen: () => {},
  onRetry: () => {},
  onClearFilter: () => {},
  onChangeSearch: () => {},
  onCompare: () => {},
};

export const Default: Story = { args: { ...base, state: 'success', options: optionsFor('svc-filling') } };
export const EmptyFiltered: Story = { args: { ...base, state: 'empty-filtered', options: [] } };
export const ErrorFetch: Story = { args: { ...base, state: 'error-fetch', options: [] } };
