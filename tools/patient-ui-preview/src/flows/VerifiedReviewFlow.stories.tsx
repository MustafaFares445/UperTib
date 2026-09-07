import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { VerifiedReviewFlow } from './VerifiedReviewFlow';

const meta = {
  title: 'Patient/Flows/FLOW-REVIEWS-001 Verified review',
  component: VerifiedReviewFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof VerifiedReviewFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
