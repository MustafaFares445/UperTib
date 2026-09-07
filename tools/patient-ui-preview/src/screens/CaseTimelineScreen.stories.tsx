import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { caseTimeline, patientCases } from '../mocks/clinical';
import { CaseTimelineScreen } from './CaseTimelineScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-005 Case timeline',
  component: CaseTimelineScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CaseTimelineScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onLoadOlder: () => {}, onOpenRecord: () => {} };
export const Default: Story = { args: { item: patientCases[0], events: caseTimeline, hasOlder: true, ...handlers } };
export const BeginningOfHistory: Story = { args: { item: patientCases[0], events: caseTimeline, hasOlder: false, ...handlers } };
export const ScopeLimited: Story = { args: { item: patientCases[0], events: caseTimeline.slice(2), hasOlder: false, scopeLimited: true, ...handlers } };
