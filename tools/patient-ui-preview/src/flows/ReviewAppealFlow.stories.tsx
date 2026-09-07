import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ReviewAppealFlow } from './ReviewAppealFlow';

const meta = {
  title: 'Patient/Flows/FLOW-REVIEWS-006 Review appeal',
  component: ReviewAppealFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ReviewAppealFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
