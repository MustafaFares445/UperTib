import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  pendingSubmissionCommitted,
  pendingSubmissionExamples,
  pendingSubmissionNotCommitted,
  pendingSubmissionRetryConflict,
  pendingSubmissionRetrying,
  pendingSubmissionStillUnknown,
  PLATFORM_AS_OF_ISO,
} from '../mocks/platform';
import { PendingSubmissionsScreen } from './PendingSubmissionsScreen';

const meta = {
  title: 'Patient/Screens/SCR-PLATFORM-002 Pending submissions',
  component: PendingSubmissionsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PendingSubmissionsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  onRefresh: () => {},
  onReconcile: () => {},
  onRetry: () => {},
  onOpenResolved: () => {},
  onDiscard: () => {},
};

export const MixedOutstanding: Story = {
  args: { ...base, entries: pendingSubmissionExamples },
};

export const TimeoutThenCommitted: Story = {
  args: { ...base, entries: [pendingSubmissionCommitted] },
};

export const TimeoutStillUnknown: Story = {
  args: { ...base, entries: [pendingSubmissionStillUnknown] },
};

export const SafeIdempotentRetryAvailable: Story = {
  args: { ...base, entries: [pendingSubmissionNotCommitted] },
};

export const SameIntentRetryInProgress: Story = {
  args: { ...base, entries: [pendingSubmissionRetrying] },
};

export const MateriallyDifferentRetryRejected: Story = {
  args: { ...base, entries: [pendingSubmissionRetryConflict] },
};

export const OfflineUnresolved: Story = {
  args: { ...base, entries: [pendingSubmissionStillUnknown], state: 'offline', asOfIso: PLATFORM_AS_OF_ISO },
};

export const StaleUnresolved: Story = {
  args: { ...base, entries: [pendingSubmissionStillUnknown], state: 'stale', asOfIso: PLATFORM_AS_OF_ISO },
};

export const EmptyNoData: Story = {
  args: { ...base, entries: [], state: 'empty-no-data' },
};

export const PermissionDenied: Story = {
  args: { ...base, entries: [], state: 'error-permission' },
};

export const RepresentedPatient: Story = {
  args: {
    ...base,
    entries: pendingSubmissionExamples.map((entry) => ({ ...entry, subjectLabel: 'لين' })),
    subject: 'طلبات لين المعلّقة',
    authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة',
  },
};
