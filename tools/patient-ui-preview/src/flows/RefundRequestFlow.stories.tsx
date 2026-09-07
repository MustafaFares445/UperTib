import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { RefundRequestFlow } from './RefundRequestFlow';

const meta = {
  title: 'Patient/Flows/FLOW-CLAIMS-001 Refund request',
  component: RefundRequestFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RefundRequestFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
