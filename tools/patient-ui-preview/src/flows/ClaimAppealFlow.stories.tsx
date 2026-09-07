import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ClaimAppealFlow } from './ClaimAppealFlow';

const meta = {
  title: 'Patient/Flows/FLOW-CLAIMS-007 Claim appeal',
  component: ClaimAppealFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ClaimAppealFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
