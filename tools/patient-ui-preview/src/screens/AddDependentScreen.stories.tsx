import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  approvedDependentRequest,
  changesRequestedDependentRequest,
  defaultDependentEvidenceRequirements,
  rejectedDependentEvidenceRequirements,
  rejectedDependentRequest,
  representationActionOptions,
  representationDataScopeOptions,
  retryableDependentEvidenceRequirements,
  scanningDependentEvidenceRequirements,
  submittedDependentRequest,
} from '../mocks/representation';
import { AddDependentScreen } from './AddDependentScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-037 Add dependent',
  component: AddDependentScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof AddDependentScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  initialSubjectIdentification: 'ليان فارس — مواليد 2014',
  initialRelationship: 'ولي أمر',
  initialLegalBasis: 'طلب تمثيل تابع يحتاج تحققًا بشريًا من العلاقة والأساس.',
  initialPurpose: 'متابعة المواعيد والخطة العلاجية للتابع ضمن النطاق المعتمد.',
  initialActions: [representationActionOptions[0].label, representationActionOptions[1].label],
  initialDataScope: [representationDataScopeOptions[0].label, representationDataScopeOptions[1].label],
  onSubmit: () => {},
  onCancel: () => {},
  onAddEvidence: () => {},
  onResumeEvidence: () => {},
  onRetryEvidence: () => {},
  onReplaceEvidence: () => {},
};

export const ReadyForVerification: Story = {
  args: { evidenceRequirements: defaultDependentEvidenceRequirements, ...base },
};

export const EvidenceScanning: Story = {
  args: { evidenceRequirements: scanningDependentEvidenceRequirements, ...base },
};

export const EvidenceRetryableFailure: Story = {
  args: { evidenceRequirements: retryableDependentEvidenceRequirements, ...base },
};

export const EvidenceRejected: Story = {
  args: { evidenceRequirements: rejectedDependentEvidenceRequirements, ...base },
};

export const Submitted: Story = {
  args: { evidenceRequirements: defaultDependentEvidenceRequirements, request: submittedDependentRequest, ...base },
};

export const ChangesRequested: Story = {
  args: { evidenceRequirements: rejectedDependentEvidenceRequirements, request: changesRequestedDependentRequest, ...base },
};

export const Approved: Story = {
  args: { evidenceRequirements: defaultDependentEvidenceRequirements, request: approvedDependentRequest, ...base },
};

export const Rejected: Story = {
  args: { evidenceRequirements: defaultDependentEvidenceRequirements, request: rejectedDependentRequest, ...base },
};
