import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { completedPatientStage, incompletePatientStage, reopenedPatientStage } from '../mocks/stages';
import { StageDetailScreen } from './StageDetailScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-006 Stage detail',
  component: StageDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof StageDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const onBackToTimeline = () => {};
export const Reopened: Story = { args: { stage: reopenedPatientStage, onBackToTimeline } };
export const Incomplete: Story = { args: { stage: incompletePatientStage, onBackToTimeline } };
export const Completed: Story = { args: { stage: completedPatientStage, onBackToTimeline } };
