import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { unavailableProtectionEntitlement } from '../mocks/protectionClaims';
import { ProtectionClaimFlow } from './ProtectionClaimFlow';

const meta = {
  title: 'Patient/Flows/FLOW-CLAIMS-002 Protection claim',
  component: ProtectionClaimFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProtectionClaimFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EntryBlockedWithoutProtection: Story = {
  args: { entitlement: unavailableProtectionEntitlement },
};
