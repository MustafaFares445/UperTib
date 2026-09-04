import { useState } from 'react';
import { IdentityEntryScreen } from '../screens/IdentityEntryScreen';
import { PhoneEntryScreen } from '../screens/PhoneEntryScreen';
import { CodeVerificationScreen } from '../screens/CodeVerificationScreen';
import { ServiceGroupsScreen } from '../screens/ServiceGroupsScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { ProviderSearchScreen } from '../screens/ProviderSearchScreen';
import { ProviderResultsScreen } from '../screens/ProviderResultsScreen';
import { ProviderDecisionScreen } from '../screens/ProviderDecisionScreen';
import { ProviderComparisonScreen } from '../screens/ProviderComparisonScreen';
import { SlotSelectionScreen } from '../screens/SlotSelectionScreen';
import { BookingReviewScreen } from '../screens/BookingReviewScreen';
import { BookingDetailScreen } from '../screens/BookingDetailScreen';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import type { ServiceFamily } from '../mocks/catalog';
import { optionsFor } from '../mocks/eligibility';
import { slotsFor, type BookingRecord, type Slot } from '../mocks/booking';
import type { Challenge } from '../mocks/identity';

type Step =
  | 'entry'
  | 'phone'
  | 'code'
  | 'catalog'
  | 'serviceDetail'
  | 'search'
  | 'results'
  | 'comparison'
  | 'decision'
  | 'slot'
  | 'review'
  | 'detail';

interface JourneyState {
  step: Step;
  phone: string;
  challenge?: Challenge;
  family?: ServiceFamily;
  area: string;
  option?: ProviderOption;
  comparisonOptions?: ProviderOption[];
  slot?: Slot;
  booking?: BookingRecord;
  /** Where verification should return to once the patient is identified (IX-PLATFORM gate-and-return). */
  returnTo?: Step;
}

const INITIAL: JourneyState = { step: 'entry', phone: '', area: '' };

/**
 * FLOW-IDENTITY-001 -> FLOW-CATALOG-001 -> FLOW-ELIG-001 -> FLOW-BOOKING-001, composed as one
 * clickable Storybook flow over the same screens the individual SCR-* stories render. Local React
 * state simulates navigation only; no production navigation/state library is selected here.
 *
 * Verification is gated at the booking commit, not at entry: a visitor can browse the catalog and
 * reach a provider's decision card before being asked to verify their number, matching
 * SCR-IDENTITY-002's own flow binding (FLOW-BOOKING-001 gates into it) and SCR-ELIG-003's
 * "Book this option" reaching an unauthenticated visitor.
 */
export function BookingJourneyFlow() {
  const [s, setS] = useState<JourneyState>(INITIAL);

  switch (s.step) {
    case 'entry':
      return (
        <IdentityEntryScreen
          onVerify={() => setS({ ...s, step: 'phone', returnTo: 'entry' })}
          onBrowse={() => setS({ ...s, step: 'catalog' })}
        />
      );

    case 'phone':
      return (
        <PhoneEntryScreen
          onCodeRequested={(phone, challenge) => setS({ ...s, phone, challenge, step: 'code' })}
          onBack={() => setS({ ...s, step: s.returnTo ?? 'entry' })}
        />
      );

    case 'code':
      return (
        <CodeVerificationScreen
          phone={s.phone}
          challenge={s.challenge!}
          onVerified={() => setS({ ...s, step: s.returnTo ?? 'catalog' })}
          onChangeNumber={() => setS({ ...s, step: 'phone' })}
        />
      );

    case 'catalog':
      return <ServiceGroupsScreen onChooseFamily={(family) => setS({ ...s, family, step: 'serviceDetail' })} />;

    case 'serviceDetail':
      return (
        <ServiceDetailScreen
          family={s.family!}
          onFindProviders={() => setS({ ...s, step: 'search' })}
          onBack={() => setS({ ...s, step: 'catalog' })}
        />
      );

    case 'search':
      return (
        <ProviderSearchScreen
          family={s.family!}
          onSearch={(area) => setS({ ...s, area, step: 'results' })}
          onChangeService={() => setS({ ...s, step: 'catalog' })}
        />
      );

    case 'results':
      return (
        <ProviderResultsScreen
          serviceName={s.family!.name}
          area={s.area}
          state="success"
          options={optionsFor(s.family!.code)}
          onOpen={(option) => setS({ ...s, option, step: 'decision' })}
          onRetry={() => setS({ ...s })}
          onClearFilter={() => setS({ ...s, area: '' })}
          onChangeSearch={() => setS({ ...s, step: 'search' })}
          onCompare={(comparisonOptions) => setS({ ...s, comparisonOptions, step: 'comparison' })}
        />
      );

    case 'comparison':
      return (
        <ProviderComparisonScreen
          options={s.comparisonOptions!}
          onBook={(option) =>
            setS({
              ...s,
              option,
              step: s.challenge ? 'slot' : 'phone',
              returnTo: s.challenge ? undefined : 'slot',
            })
          }
          onOpen={(option) => setS({ ...s, option, step: 'decision' })}
          onBack={() => setS({ ...s, step: 'results' })}
        />
      );

    case 'decision':
      return (
        <ProviderDecisionScreen
          option={s.option!}
          onBook={() =>
            setS({ ...s, step: s.challenge ? 'slot' : 'phone', returnTo: s.challenge ? undefined : 'slot' })
          }
          onBackToResults={() => setS({ ...s, step: 'results' })}
        />
      );

    case 'slot':
      return (
        <SlotSelectionScreen
          option={s.option!}
          slots={slotsFor(s.option!.id)}
          onContinue={(slot) => setS({ ...s, slot, step: 'review' })}
          onChangeOption={() => setS({ ...s, step: 'results' })}
        />
      );

    case 'review':
      return (
        <BookingReviewScreen
          option={s.option!}
          slot={s.slot!}
          onSubmitted={(booking) => setS({ ...s, booking, step: 'detail' })}
          onChangeTime={() => setS({ ...s, step: 'slot' })}
          onChangeOption={() => setS({ ...s, step: 'results' })}
        />
      );

    case 'detail':
      return (
        <BookingDetailScreen
          booking={s.booking!}
          option={s.option!}
          onCancelled={() => {}}
          onDone={() => setS(INITIAL)}
          onFindAlternative={() => setS({ ...s, step: 'results' })}
        />
      );

    default:
      return null;
  }
}
