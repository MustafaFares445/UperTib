import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { initialPatientClaims } from '../mocks/claims';
import { MyClaimsScreen } from './MyClaimsScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLAIMS-001 My claims',
  component: MyClaimsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof MyClaimsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    claims: initialPatientClaims,
    onOpenClaim: () => {},
    onRequestRefund: () => {},
  },
};

export const Empty: Story = {
  args: {
    claims: [],
    onOpenClaim: () => {},
    onRequestRefund: () => {},
  },
};

export const RefundUnavailable: Story = {
  args: {
    claims: initialPatientClaims,
    onOpenClaim: () => {},
    onRequestRefund: () => {},
    canRequestRefund: false,
    refundUnavailableReason: 'لا توجد حالة مؤهلة لطلب استرداد جديد ضمن المهلة الحالية.',
  },
};
