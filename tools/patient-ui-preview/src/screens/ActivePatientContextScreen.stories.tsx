import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { activeHeldGrant, revokedGrant, unresolvedScopeGrant } from '../mocks/representation';
import { ActivePatientContextScreen } from './ActivePatientContextScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-008 Active patient context',
  component: ActivePatientContextScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ActivePatientContextScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actingGuardianName: 'مصطفى فارس',
    grants: [activeHeldGrant, { ...revokedGrant, direction: 'HELD' }, { ...unresolvedScopeGrant, direction: 'HELD' }],
    onSelect: () => {},
    onCancel: () => {},
  },
};

export const NoActiveGrant: Story = {
  args: {
    actingGuardianName: 'مصطفى فارس',
    grants: [{ ...revokedGrant, direction: 'HELD' }, { ...unresolvedScopeGrant, direction: 'HELD' }],
    onSelect: () => {},
    onCancel: () => {},
  },
};
