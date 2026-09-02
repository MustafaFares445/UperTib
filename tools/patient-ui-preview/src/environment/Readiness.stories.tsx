import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Readiness } from './Readiness';

const meta = {
  title: 'Environment/Readiness',
  component: Readiness,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof Readiness>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
