import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientFollowUps } from '../mocks/followups';
import { PLATFORM_AS_OF_ISO } from '../mocks/platform';
import { FollowUpsScreen } from './FollowUpsScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-007 Follow-ups',
  component: FollowUpsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FollowUpsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { onOpenFollowUp: () => {}, onRefresh: () => {} };

export const DueUpcomingAndHistory: Story = { args: { ...base, followUps: patientFollowUps } };
export const DueOnly: Story = { args: { ...base, followUps: patientFollowUps.filter((item) => item.dueState === 'due') } };
export const EmptyNoData: Story = { args: { ...base, followUps: [], state: 'empty-no-data' } };
export const PartialRead: Story = { args: { ...base, followUps: patientFollowUps.slice(0, 1), state: 'partial' } };
export const StaleKnownData: Story = { args: { ...base, followUps: patientFollowUps, state: 'stale', asOfIso: PLATFORM_AS_OF_ISO } };
export const OfflineKnownData: Story = { args: { ...base, followUps: patientFollowUps, state: 'offline', asOfIso: PLATFORM_AS_OF_ISO } };
export const FetchFailure: Story = { args: { ...base, followUps: [], state: 'error-fetch' } };
export const PermissionDenied: Story = { args: { ...base, followUps: [], state: 'error-permission' } };
export const GuardianFollowUps: Story = {
  args: {
    ...base,
    followUps: patientFollowUps.map((item) => ({ ...item, subjectLabel: 'لين' })),
    subject: 'متابعات لين العلاجية',
    authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة',
  },
};
