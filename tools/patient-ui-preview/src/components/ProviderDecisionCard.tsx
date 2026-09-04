import { Pressable, View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Body, Heading4, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { PriceDisplay, type PriceFact } from './PriceDisplay';
import { StateChip } from './StateChip';
import { componentColor, radius, space } from '../theme/tokens';

export type EligibilityStatus = 'PENDING_EVALUATION' | 'ELIGIBLE' | 'SUSPENDED' | 'NOT_ELIGIBLE';

const ELIGIBILITY_LABEL: Record<EligibilityStatus, string> = {
  PENDING_EVALUATION: 'قيد التقييم',
  ELIGIBLE: 'مؤهَّل',
  SUSPENDED: 'معلَّق مؤقتًا',
  NOT_ELIGIBLE: 'غير مؤهَّل حاليًا',
};

export interface ProviderOption {
  id: string;
  providerName: string;
  branchName: string;
  areaLabel: string;
  serviceLabel: string;
  eligibility: EligibilityStatus;
  price: PriceFact;
  priceIncludes?: string;
  fundedProtection: boolean;
  ratingLabel?: string;
  nearestAppointmentIso?: string;
  assessedAtIso: string;
}

interface ProviderDecisionCardProps {
  option: ProviderOption;
  variant?: 'row' | 'card' | 'chosen';
  onPress?: () => void;
  selected?: boolean;
}

/**
 * CMP-ELIG-001 — Provider decision card. Everything needed to choose one provider/service/branch
 * combination, and nothing revealing rank: no composite score, no internal S/P/H/I, no "best
 * match" marker. Scoped to one provider+service+branch (BP-02) — never a cross-service profile.
 */
export function ProviderDecisionCard({ option, variant = 'card', onPress, selected = false }: ProviderDecisionCardProps) {
  const ring = useFocusRing();
  const isCard = variant !== 'row';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${option.providerName}، ${option.branchName}، ${option.serviceLabel}، ${ELIGIBILITY_LABEL[option.eligibility]}`}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: 1,
        borderColor: selected ? componentColor('elig-001.border-selected') : componentColor('elig-001.border'),
        backgroundColor: selected ? componentColor('elig-001.fill-selected') : componentColor('elig-001.surface'),
        opacity: pressed ? 0.92 : 1,
        ...ring.ringStyle,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ gap: space('stack-xs'), flexShrink: 1 }}>
          <Heading4>{option.providerName}</Heading4>
          <Body tone="secondary">
            {option.branchName} · {option.areaLabel}
          </Body>
        </View>
        <StateChip machine="eligibility-outcome" status={option.eligibility} label={ELIGIBILITY_LABEL[option.eligibility]} />
      </View>

      <Body>{option.serviceLabel}</Body>

      <PriceDisplay price={option.price} />
      {option.priceIncludes ? <Helper>{option.priceIncludes}</Helper> : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-md') }}>
        <Helper>{option.fundedProtection ? 'يشمل حماية ممولة عند الحاجة' : 'بدون حماية ممولة'}</Helper>
        {option.ratingLabel ? <Helper>{option.ratingLabel}</Helper> : <Helper>التقييم غير متوفر</Helper>}
      </View>

      {isCard ? (
        <Helper>
          {option.nearestAppointmentIso ? (
            <>
              أقرب موعد متاح: <Bdi>{formatDateTime(option.nearestAppointmentIso)}</Bdi>
            </>
          ) : (
            'أقرب موعد متاح: غير متوفر حاليًا'
          )}
        </Helper>
      ) : null}

      <Helper>
        وقت التقييم: <Bdi>{formatDateTime(option.assessedAtIso)}</Bdi>
      </Helper>
    </Pressable>
  );
}
