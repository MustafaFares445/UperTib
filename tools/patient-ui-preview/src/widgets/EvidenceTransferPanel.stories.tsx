import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { evidenceStateExamples, patientEvidenceRequirement } from '../mocks/evidence';
import { EvidenceTransferPanel } from './EvidenceTransferPanel';

const meta = {
  title: 'Patient/Widgets/WGT-PLATFORM-008 Evidence transfer panel',
  component: EvidenceTransferPanel,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EvidenceTransferPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const RetryableFailure: Story = {
  args: {
    requirements: [patientEvidenceRequirement],
    onAddItem: noop,
    onResume: noop,
    onRetry: noop,
    onReplace: noop,
  },
};

export const UploadedVersusAccepted: Story = {
  args: {
    requirements: [
      {
        ...patientEvidenceRequirement,
        items: [
          evidenceStateExamples.find((item) => item.state === 'UPLOADED')!,
          evidenceStateExamples.find((item) => item.state === 'ACCEPTED')!,
        ],
      },
    ],
  },
};

export const RejectedNeedsReplacement: Story = {
  args: {
    requirements: [
      {
        ...patientEvidenceRequirement,
        items: [evidenceStateExamples.find((item) => item.state === 'REJECTED')!],
      },
    ],
    onReplace: noop,
  },
};

export const NoRequirement: Story = { args: { requirements: [] } };
