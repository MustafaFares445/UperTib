import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProviderOptionSet } from './ProviderOptionSet';
import { optionsFor } from '../mocks/eligibility';

const meta = {
  title: 'Patient/Widgets/WGT-ELIG-001 Provider option set',
  component: ProviderOptionSet,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderOptionSet>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = optionsFor('svc-filling');

export const Success: Story = { args: { state: 'success', options, onChoose: () => {} } };
export const LoadingInitial: Story = { args: { state: 'loading-initial', options: [], onChoose: () => {} } };
export const EmptyFiltered: Story = { args: { state: 'empty-filtered', options: [], onChoose: () => {} } };
export const EmptyNoData: Story = { args: { state: 'empty-no-data', options: [], onChoose: () => {} } };
export const ErrorFetch: Story = { args: { state: 'error-fetch', options: [], onChoose: () => {} } };
