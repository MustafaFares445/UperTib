import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { activeGivenGrant, expiredGrant, revokedGrant, unresolvedScopeGrant } from '../mocks/representation';
import { AuthorizationGrantPanel } from './AuthorizationGrantPanel';

const meta = {
  title: 'Patient/Widgets/WGT-IDENTITY-002 Authorization grant panel',
  component: AuthorizationGrantPanel,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof AuthorizationGrantPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { grant: activeGivenGrant, onOpen: () => {} } };
export const ExpiredHistory: Story = { args: { grant: expiredGrant, onOpen: () => {} } };
export const RevokedHistory: Story = { args: { grant: revokedGrant, onOpen: () => {} } };
export const ScopeUnknown: Story = { args: { grant: unresolvedScopeGrant, onOpen: () => {} } };
