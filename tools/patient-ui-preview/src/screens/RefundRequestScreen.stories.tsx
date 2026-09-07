import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  defaultRefundEntitlement,
  expiredRefundEntitlement,
  incompleteRefundEntitlement,
  ineligibleRefundEntitlement,
  unavailableSnapshotRefundEntitlement,
} from '../mocks/claims';
import { RefundRequestScreen } from './RefundRequestScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLAIMS-002 Refund request',
  component: RefundRequestScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RefundRequestScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onSubmit: () => {}, onCancel: () => {}, onSupplyEvidence: () => {} };

export const Default: Story = {
  args: {
    entitlement: defaultRefundEntitlement,
    initialRequestedAmount: '50000',
    initialReason: 'أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.',
    ...handlers,
  },
};

export const EvidenceIncomplete: Story = {
  args: {
    entitlement: incompleteRefundEntitlement,
    initialRequestedAmount: '50000',
    initialReason: 'أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.',
    ...handlers,
  },
};

export const WindowExpired: Story = {
  args: { entitlement: expiredRefundEntitlement, ...handlers },
};

export const Ineligible: Story = {
  args: { entitlement: ineligibleRefundEntitlement, ...handlers },
};

export const GoverningSnapshotUnavailable: Story = {
  args: { entitlement: unavailableSnapshotRefundEntitlement, ...handlers },
};

export const RetryableFailure: Story = {
  args: {
    entitlement: defaultRefundEntitlement,
    submitState: 'retryable-failure',
    initialRequestedAmount: '50000',
    initialReason: 'أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.',
    initialOccurrenceContext: 'تمت الزيارة صباح 5 أيلول.',
    ...handlers,
  },
};
