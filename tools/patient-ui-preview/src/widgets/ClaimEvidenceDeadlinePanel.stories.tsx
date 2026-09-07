import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { decidedRefundClaim, initialPatientClaims } from '../mocks/claims';
import { ClaimEvidenceDeadlinePanel } from './ClaimEvidenceDeadlinePanel';

const meta = {
  title: 'Patient/Widgets/WGT-CLAIMS-001 Claim evidence and deadline panel',
  component: ClaimEvidenceDeadlinePanel,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ClaimEvidenceDeadlinePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const evidenceIncomplete = initialPatientClaims[0];

export const EvidenceIncomplete: Story = {
  args: {
    originalDeadlineIso: evidenceIncomplete.originalDeadlineIso,
    effectiveDeadlineIso: evidenceIncomplete.effectiveDeadlineIso ?? evidenceIncomplete.originalDeadlineIso,
    deadlineState: evidenceIncomplete.deadlineState,
    deadlineEvents: evidenceIncomplete.deadlineEvents,
    requirements: evidenceIncomplete.evidenceRequirements,
  },
};

export const DecidedHistory: Story = {
  args: {
    originalDeadlineIso: decidedRefundClaim.originalDeadlineIso,
    effectiveDeadlineIso: decidedRefundClaim.effectiveDeadlineIso ?? decidedRefundClaim.originalDeadlineIso,
    deadlineState: decidedRefundClaim.deadlineState,
    deadlineEvents: decidedRefundClaim.deadlineEvents,
    requirements: decidedRefundClaim.evidenceRequirements,
  },
};
