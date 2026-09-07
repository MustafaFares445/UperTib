import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  defaultProtectionEntitlement,
  expiredProtectionEntitlement,
  rejectedProtectionEntitlement,
  retryableProtectionEntitlement,
  scanningProtectionEntitlement,
  unavailableProtectionEntitlement,
} from '../mocks/protectionClaims';
import { ProtectionClaimScreen } from './ProtectionClaimScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLAIMS-003 Protection claim',
  component: ProtectionClaimScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProtectionClaimScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = {
  onSubmit: () => {},
  onCancel: () => {},
  onSupplyEvidence: () => {},
  onAddEvidence: () => {},
  onResumeEvidence: () => {},
  onRetryEvidence: () => {},
  onReplaceEvidence: () => {},
};

export const Default: Story = {
  args: {
    entitlement: defaultProtectionEntitlement,
    initialRequestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    initialNarrative: 'ظهرت حاجة إلى متابعة إضافية بعد الزيارة المسجلة، وأطلب مراجعة انطباق الحماية على هذه الوقائع.',
    ...handlers,
  },
};

export const EvidenceRetryableFailure: Story = {
  args: {
    entitlement: retryableProtectionEntitlement,
    initialRequestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    initialNarrative: 'أحاول استكمال المستند المطلوب قبل تقديم المطالبة.',
    ...handlers,
  },
};

export const EvidenceRejected: Story = {
  args: {
    entitlement: rejectedProtectionEntitlement,
    initialRequestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    initialNarrative: 'أحتاج إلى استبدال المستند المرفوض وفق السبب الظاهر.',
    ...handlers,
  },
};

export const EvidenceScanning: Story = {
  args: {
    entitlement: scanningProtectionEntitlement,
    initialRequestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    initialNarrative: 'المستند قيد الفحص ولم يصبح مقبولًا بعد.',
    ...handlers,
  },
};

export const RetryableSubmitFailure: Story = {
  args: {
    entitlement: defaultProtectionEntitlement,
    submitState: 'retryable-failure',
    initialRequestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    initialNarrative: 'ظهرت حاجة إلى متابعة إضافية بعد الزيارة المسجلة.',
    ...handlers,
  },
};

export const WindowExpired: Story = {
  args: {
    entitlement: expiredProtectionEntitlement,
    initialRequestedRemedy: 'مراجعة الحالة.',
    initialNarrative: 'وصف محفوظ لكنه لا يمكن إرساله بعد انتهاء النافذة.',
    ...handlers,
  },
};

export const EntitlementUnavailableDefensive: Story = {
  args: {
    entitlement: unavailableProtectionEntitlement,
    ...handlers,
  },
};
