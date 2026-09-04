import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SubmissionStateIndicator } from './SubmissionStateIndicator';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-011 Submission state indicator',
  component: SubmissionStateIndicator,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SubmissionStateIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  args: { status: 'pending' },
  render: () => (
    <View style={{ gap: 12, padding: 24 }}>
      <SubmissionStateIndicator status="pending" />
      <SubmissionStateIndicator status="retrying" />
      <SubmissionStateIndicator status="failed" />
      <SubmissionStateIndicator status="completed" />
    </View>
  ),
};
