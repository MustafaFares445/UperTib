import { Pressable, View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Body, Heading4, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { PriceDisplay, type PriceFact } from './PriceDisplay';
import { StateChip } from './StateChip';
import { color, componentColor, radius, space } from '../theme/tokens';

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
  /** The chosen echo is read-only context (already decided), not a comparable decision surface —
   * it renders the same full attribute set, quieted rather than shortened (CMP-ELIG-001 `chosen`). */
  const isChosenEcho = variant === 'chosen';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${option.providerName}، ${option.branchName}، ${option.serviceLabel}، ${ELIGIBILITY_LABEL[option.eligibility]}`}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        gap: space('stack-sm'),
        padding: isChosenEcho ? space('inset-sm') : space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: 1,
        borderColor: isChosenEcho
          ? color('border.subtle')
          : selected
            ? componentColor('elig-001.border-selected')
            : componentColor('elig-001.border'),
        backgroundColor: isChosenEcho
          ? color('surface.subtle')
          : selected
            ? componentColor('elig-001.fill-selected')
            : componentColor('elig-001.surface'),
        opacity: pressed ? 0.92 : 1,
        ...ring.ringStyle,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ gap: space('stack-xs'), flexShrink: 1 }}>
          <Heading4>{option.providerName}</Heading4>
          <Body tone="secondary">
            {option.branchName} · {option.areaLabel} · {option.serviceLabel}
          </Body>
        </View>
        <StateChip machine="eligibility-outcome" status={option.eligibility} label={ELIGIBILITY_LABEL[option.eligibility]} />
      </View>

      <PriceDisplay price={option.price} />
      {option.priceIncludes ? <Helper>{option.priceIncludes}</Helper> : null}

      <Helper>
        {option.fundedProtection ? 'يشمل حماية ممولة عند الحاجة' : 'بدون حماية ممولة'}
        {'  ·  '}
        {option.ratingLabel ?? 'التقييم غير متوفر'}
        {isCard ? (
          <>
            {'  ·  '}
            أقرب موعد متاح:{' '}
            {option.nearestAppointmentIso ? (
              <Bdi>{formatDateTime(option.nearestAppointmentIso)}</Bdi>
            ) : (
              'غير متوفر حاليًا'
            )}
          </>
        ) : null}
        {'  ·  '}
        وقت التقييم: <Bdi>{formatDateTime(option.assessedAtIso)}</Bdi>
      </Helper>
    </Pressable>
  );
}
