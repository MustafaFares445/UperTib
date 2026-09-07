import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { RepresentationGrantFlow } from './RepresentationGrantFlow';

const meta = {
  title: 'Patient/Flows/FLOW-IDENTITY-002-004 Representation grant',
  component: RepresentationGrantFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RepresentationGrantFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
