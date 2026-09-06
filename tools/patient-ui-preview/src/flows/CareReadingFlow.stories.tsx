import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CareReadingFlow } from './CareReadingFlow';

const meta = {
  title: 'Patient/Flows/FLOW-CLINICAL-008 Care reading',
  component: CareReadingFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CareReadingFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
