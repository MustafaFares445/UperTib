import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientCases } from '../mocks/clinical';
import { MyCasesScreen } from './MyCasesScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-001 My cases',
  component: MyCasesScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof MyCasesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { onOpenCase: () => {}, onDiscoverServices: () => {}, onRetry: () => {} };
export const Default: Story = { args: { ...base, cases: patientCases } };
export const EmptyNoData: Story = { args: { ...base, cases: [], state: 'empty-no-data' } };
export const ErrorFetch: Story = { args: { ...base, cases: [], state: 'error-fetch' } };
export const RepresentedPatient: Story = { args: { ...base, cases: patientCases, subject: 'حالات لين العلاجية', authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة' } };
