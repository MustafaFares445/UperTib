import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { evidenceStateExamples } from '../mocks/evidence';
import { EvidenceTransferItem } from './EvidenceTransferItem';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-012 Evidence transfer item',
  component: EvidenceTransferItem,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EvidenceTransferItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};
const byState = (state: string) => evidenceStateExamples.find((item) => item.state === state)!;

export const Selected: Story = { args: { item: byState('SELECTED'), onStart: noop } };
export const Uploading: Story = { args: { item: byState('UPLOADING') } };
export const Paused: Story = { args: { item: byState('PAUSED'), onResume: noop } };
export const FailedRetryable: Story = { args: { item: byState('FAILED_RETRYABLE'), onResume: noop, onRetry: noop } };
export const UploadedAwaitingScan: Story = { args: { item: byState('UPLOADED') } };
export const ValidatingScanning: Story = { args: { item: byState('VALIDATING_SCANNING') } };
export const Accepted: Story = { args: { item: byState('ACCEPTED') } };
export const Rejected: Story = { args: { item: byState('REJECTED'), onReplace: noop } };
