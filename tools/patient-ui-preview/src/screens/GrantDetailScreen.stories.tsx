import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { activeGivenGrant, revokedGrant } from '../mocks/representation';
import { GrantDetailScreen } from './GrantDetailScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-007 Grant detail',
  component: GrantDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof GrantDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { grant: activeGivenGrant, onRevoke: () => {}, onBack: () => {} },
};

export const RevokedHistory: Story = {
  args: { grant: revokedGrant, onRevoke: () => {}, onBack: () => {} },
};
