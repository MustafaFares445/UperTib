import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientNotificationEntries, unreadPatientNotificationEntries } from '../mocks/notifications';
import { PLATFORM_AS_OF_ISO } from '../mocks/platform';
import { NotificationCentreScreen } from './NotificationCentreScreen';

const meta = {
  title: 'Patient/Screens/SCR-PLATFORM-009 Notification centre',
  component: NotificationCentreScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof NotificationCentreScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  onOpenNotification: () => {},
  onMarkRead: () => {},
  onRefresh: () => {},
};

export const ChronologicalRecord: Story = {
  args: { ...base, entries: patientNotificationEntries },
};

export const UnreadOnly: Story = {
  args: { ...base, entries: patientNotificationEntries, initialUnreadOnly: true },
};

export const SearchFiltered: Story = {
  args: { ...base, entries: patientNotificationEntries, initialQuery: 'مطالبة' },
};

export const DurableEntryDespiteTransportFailure: Story = {
  args: { ...base, entries: unreadPatientNotificationEntries },
};

export const StaleHistoricalEntry: Story = {
  args: { ...base, entries: patientNotificationEntries, state: 'stale', asOfIso: PLATFORM_AS_OF_ISO },
};

export const OfflineLastKnownRecord: Story = {
  args: { ...base, entries: patientNotificationEntries, state: 'offline', asOfIso: PLATFORM_AS_OF_ISO },
};

export const EmptyRecord: Story = {
  args: { ...base, entries: [] },
};

export const FetchFailure: Story = {
  args: { ...base, entries: [], state: 'error-fetch' },
};

export const PermissionDenied: Story = {
  args: { ...base, entries: [], state: 'error-permission' },
};

export const RepresentedPatient: Story = {
  args: {
    ...base,
    entries: patientNotificationEntries.map((entry) => ({ ...entry, subjectLabel: 'لين' })),
    subject: 'إشعارات لين',
    authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة',
  },
};
