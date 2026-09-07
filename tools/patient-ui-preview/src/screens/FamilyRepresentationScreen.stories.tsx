import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { initialRepresentationGrants, unresolvedScopeGrant } from '../mocks/representation';
import { FamilyRepresentationScreen } from './FamilyRepresentationScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-005 Family and representation',
  component: FamilyRepresentationScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FamilyRepresentationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = {
  onCreateGrant: () => {},
  onOpenGrant: () => {},
  onSwitchPatient: () => {},
};

export const Default: Story = {
  args: { patientName: 'مصطفى فارس', grants: initialRepresentationGrants, ...handlers },
};

export const ScopeUnknown: Story = {
  args: { patientName: 'مصطفى فارس', grants: [...initialRepresentationGrants, unresolvedScopeGrant], ...handlers },
};

export const Empty: Story = {
  args: { patientName: 'مصطفى فارس', grants: [], onCreateGrant: () => {} },
};
