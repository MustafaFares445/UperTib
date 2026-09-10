import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  patientAttentionEntries,
  PLATFORM_AS_OF_ISO,
  representedPatientAttentionEntries,
} from '../mocks/platform';
import { NeedsAttentionScreen } from './NeedsAttentionScreen';

const meta = {
  title: 'Patient/Screens/SCR-PLATFORM-001 Needs attention',
  component: NeedsAttentionScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof NeedsAttentionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  onOpenAttention: () => {},
  onRefresh: () => {},
  onFindCare: () => {},
  onOpenMyCare: () => {},
  onOpenProfile: () => {},
  onOpenNotifications: () => {},
};

export const MultipleAttentionItems: Story = {
  args: { ...base, entries: patientAttentionEntries },
};

export const OneUrgentDeadline: Story = {
  args: { ...base, entries: patientAttentionEntries.slice(0, 1) },
};

export const NoAttentionItems: Story = {
  args: { ...base, entries: [], state: 'empty-no-data' },
};

export const StaleKnownData: Story = {
  args: { ...base, entries: patientAttentionEntries, state: 'stale', asOfIso: PLATFORM_AS_OF_ISO },
};

export const OfflineKnownData: Story = {
  args: { ...base, entries: patientAttentionEntries, state: 'offline', asOfIso: PLATFORM_AS_OF_ISO },
};

export const PartialRead: Story = {
  args: { ...base, entries: patientAttentionEntries.slice(0, 1), state: 'partial' },
};

export const FetchFailure: Story = {
  args: { ...base, entries: [], state: 'error-fetch' },
};

export const PermissionDenied: Story = {
  args: { ...base, entries: [], state: 'error-permission' },
};

export const GuardianActingForPatient: Story = {
  args: {
    ...base,
    entries: representedPatientAttentionEntries,
    subject: 'ما يحتاج انتباه لين',
    authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة',
  },
};
