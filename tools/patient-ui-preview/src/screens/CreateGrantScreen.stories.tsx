import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { representationActionOptions, representationDataScopeOptions } from '../mocks/representation';
import { CreateGrantScreen } from './CreateGrantScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-006 Create grant',
  component: CreateGrantScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CreateGrantScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: {
    subjectPatientName: 'مصطفى فارس',
    initialGranteeName: 'ريم فارس',
    initialPurpose: 'المساعدة في متابعة المواعيد والخطة العلاجية أثناء السفر.',
    initialActions: [representationActionOptions[0].label, representationActionOptions[1].label],
    initialDataScope: [representationDataScopeOptions[0].label, representationDataScopeOptions[1].label],
    initialPeriodMode: 'BOUNDED',
    onCreate: () => {},
    onCancel: () => {},
  },
};

export const Incomplete: Story = {
  args: {
    subjectPatientName: 'مصطفى فارس',
    onCreate: () => {},
    onCancel: () => {},
  },
};

export const OpenEndedExplicit: Story = {
  args: {
    ...Ready.args,
    initialPeriodMode: 'OPEN_ENDED',
  },
};
