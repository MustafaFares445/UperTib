import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { completedPatientStage, incompletePatientStage, reopenedPatientStage } from '../mocks/stages';
import { StageExecutionPanel } from './StageExecutionPanel';

const meta = {
  title: 'Patient/Widgets/WGT-CLINICAL-003 Stage execution panel',
  component: StageExecutionPanel,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof StageExecutionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reopened: Story = { args: { stage: reopenedPatientStage } };
export const Incomplete: Story = { args: { stage: incompletePatientStage } };
export const Completed: Story = { args: { stage: completedPatientStage } };
