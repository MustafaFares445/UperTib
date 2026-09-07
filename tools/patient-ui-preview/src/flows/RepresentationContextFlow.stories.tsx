import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { RepresentationContextFlow } from './RepresentationContextFlow';

const meta = {
  title: 'Patient/Flows/FLOW-IDENTITY-003 Representation context',
  component: RepresentationContextFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RepresentationContextFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
