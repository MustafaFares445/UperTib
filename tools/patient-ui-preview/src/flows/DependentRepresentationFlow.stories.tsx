import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { DependentRepresentationFlow } from './DependentRepresentationFlow';

const meta = {
  title: 'Patient/Flows/FLOW-IDENTITY-021 Dependent representation',
  component: DependentRepresentationFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof DependentRepresentationFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
