import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientProfile, representedPatientProfile } from '../mocks/profile';
import { PatientProfileScreen } from './PatientProfileScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-004 Patient profile',
  component: PatientProfileScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PatientProfileScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  onOpenRepresentation: () => {},
  onOpenPendingSubmissions: () => {},
  onOpenNotifications: () => {},
  onRefresh: () => {},
};

export const SelfProfile: Story = { args: { ...base, profile: patientProfile } };
export const ActingForAnotherPatient: Story = { args: { ...base, profile: representedPatientProfile } };
export const StaleProfile: Story = { args: { ...base, profile: patientProfile, state: 'stale' } };
export const OfflineProfile: Story = { args: { ...base, profile: patientProfile, state: 'offline' } };
export const FetchFailure: Story = { args: { ...base, profile: patientProfile, state: 'error-fetch' } };
export const PermissionDenied: Story = { args: { ...base, profile: patientProfile, state: 'error-permission' } };
