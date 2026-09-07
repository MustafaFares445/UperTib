import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  appealableProtectionDecisionClaim,
  decidedClaimAppeal,
  defaultClaimAppealDraft,
  expiredClaimAppealDecision,
  policyIneligibleClaimDecision,
  submittedClaimAppeal,
  underReviewClaimAppeal,
  unreadClaimDecision,
} from '../mocks/claimAppeals';
import { ClaimAppealScreen } from './ClaimAppealScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLAIMS-005 Claim appeal',
  component: ClaimAppealScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ClaimAppealScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = {
  onSubmit: () => {},
  onBack: () => {},
};

export const Default: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const EmptyGrounds: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    ...handlers,
  },
};

export const RetryableFailure: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    submitState: 'retryable-failure',
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const WithSupportingEvidence: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    initialGrounds: defaultClaimAppealDraft.grounds,
    supportingEvidence: [
      { id: 'claim-evidence-existing-001', label: 'المستند الداعم المقبول في المطالبة الأصلية' },
    ],
    ...handlers,
  },
};

export const WindowExpired: Story = {
  args: {
    claim: expiredClaimAppealDecision,
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const NotAuthorized: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    actorAuthorized: false,
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const PolicyIneligible: Story = {
  args: {
    claim: policyIneligibleClaimDecision,
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const DecisionUnavailable: Story = {
  args: {
    claim: unreadClaimDecision,
    initialGrounds: defaultClaimAppealDraft.grounds,
    ...handlers,
  },
};

export const Submitted: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    appeal: submittedClaimAppeal,
    ...handlers,
  },
};

export const UnderReview: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    appeal: underReviewClaimAppeal,
    ...handlers,
  },
};

export const Decided: Story = {
  args: {
    claim: appealableProtectionDecisionClaim,
    appeal: decidedClaimAppeal,
    ...handlers,
  },
};
