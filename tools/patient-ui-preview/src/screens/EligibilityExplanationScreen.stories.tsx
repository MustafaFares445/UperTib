import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { EligibilityExplanationScreen } from './EligibilityExplanationScreen';
import { explanationFor, optionsFor } from '../mocks/eligibility';

const meta = {
  title: 'Patient/Screens/SCR-ELIG-004 Eligibility explanation',
  component: EligibilityExplanationScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EligibilityExplanationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const option = optionsFor('svc-filling')[0];

export const Eligible: Story = {
  args: {
    explanation: explanationFor(option),
    onBack: () => {},
    onFindAlternatives: () => {},
  },
};

export const PendingEvaluation: Story = {
  args: {
    explanation: explanationFor({ ...option, eligibility: 'PENDING_EVALUATION' }),
    onBack: () => {},
    onFindAlternatives: () => {},
  },
};

export const NotEligible: Story = {
  args: {
    explanation: explanationFor({ ...option, eligibility: 'NOT_ELIGIBLE' }),
    onBack: () => {},
    onFindAlternatives: () => {},
  },
};
