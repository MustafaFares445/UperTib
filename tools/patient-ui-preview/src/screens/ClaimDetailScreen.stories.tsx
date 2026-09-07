import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { decidedRefundClaim, initialPatientClaims, mixedEvidenceClaim } from '../mocks/claims';
import { ClaimDetailScreen } from './ClaimDetailScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLAIMS-004 Claim detail',
  component: ClaimDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ClaimDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = {
  onBack: () => {},
  onSupplyEvidence: () => {},
  onAppeal: () => {},
  onReportRefundExecution: () => {},
};

export const EvidenceIncomplete: Story = {
  args: { claim: initialPatientClaims[0], ...handlers },
};

export const UnderReview: Story = {
  args: { claim: initialPatientClaims[1], ...handlers },
};

export const DecidedRefund: Story = {
  args: { claim: decidedRefundClaim, ...handlers },
};

export const AllEvidenceStates: Story = {
  args: { claim: mixedEvidenceClaim, ...handlers },
};

export const DeadlineUnavailable: Story = {
  args: {
    claim: {
      ...mixedEvidenceClaim,
      id: 'claim-deadline-unavailable-010',
      effectiveDeadlineIso: undefined,
      deadlineState: undefined,
    },
    ...handlers,
  },
};
