import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { formatDateTime } from '../foundations/format';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import { Icon } from '../foundations/Icon';
import { useFocusRing } from '../foundations/useFocusRing';
import { webSpaceActivationProps } from '../foundations/webKeyboardActivation';
import { PriceDisplay, type PriceFact } from './PriceDisplay';
import { StateChip } from './StateChip';
import { ProviderIdentity } from './ProviderIdentity';
import { borderWidth, color, componentColor, radius, size, space } from '../theme/tokens';

export type EligibilityStatus = 'PENDING_EVALUATION' | 'ELIGIBLE' | 'SUSPENDED' | 'NOT_ELIGIBLE';

const ELIGIBILITY_LABEL: Record<EligibilityStatus, string> = {
  PENDING_EVALUATION: 'قيد التقييم',
  ELIGIBLE: 'متاح للحجز',
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
  variant?: 'row' | 'card' | 'chosen' | 'comparison';
  onPress?: () => void;
  selected?: boolean;
  onCompareToggle?: () => void;
  compareDisabled?: boolean;
}

function Fact({ label, detail, wide = false }: { label: string; detail: ReactNode; wide?: boolean }) {
  return (
    <View
      style={{
        gap: space('stack-xs'),
        flexGrow: 1,
        flexBasis: wide ? '100%' : '46%',
        padding: space('inset-sm'),
        borderRadius: radius('control'),
        backgroundColor: color('surface.subtle'),
      }}
    >
      <Helper>{label}</Helper>
      {typeof detail === 'string' || typeof detail === 'number' ? <BodyStrong>{detail}</BodyStrong> : detail}
    </View>
  );
}

/**
 * CMP-ELIG-001 — Provider decision card. Everything needed to choose one provider/service/branch
 * combination, and nothing revealing rank: no composite score, no internal S/P/H/I, no "best
 * match" marker. Scoped to one provider+service+branch (BP-02) — never a cross-service profile.
 */
export function ProviderDecisionCard({
  option,
  variant = 'card',
  onPress,
  selected = false,
  onCompareToggle,
  compareDisabled = false,
}: ProviderDecisionCardProps) {
  const ring = useFocusRing();
  const compareRing = useFocusRing();
  const isCompact = variant === 'row' || variant === 'chosen';
  /** The chosen echo is read-only task context, not another decision surface. */
  const isChosenEcho = variant === 'chosen';

  return (
    <View
      style={{
        gap: space('stack-sm'),
        padding: isChosenEcho ? space('inset-sm') : space('inset-md'),
        borderRadius: variant === 'row' ? 0 : radius('surface'),
        borderWidth: variant === 'row' ? 0 : borderWidth('hairline'),
        borderBottomWidth: variant === 'row' ? borderWidth('hairline') : borderWidth('hairline'),
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
      }}
    >
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${option.providerName}، ${option.branchName}، ${option.serviceLabel}، ${ELIGIBILITY_LABEL[option.eligibility]}`}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => ({ gap: space('stack-sm'), opacity: pressed ? 0.88 : 1, ...ring.ringStyle })}
      >
        <ProviderIdentity
          name={option.providerName}
          branch={option.branchName}
          area={option.areaLabel}
          compact={isCompact}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space('inline-sm') }}>
          <StateChip machine="eligibility-outcome" status={option.eligibility} label={ELIGIBILITY_LABEL[option.eligibility]} />
          {!isChosenEcho ? <Helper>{option.serviceLabel}</Helper> : null}
        </View>

        {!isChosenEcho ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('stack-sm') }}>
            <Fact label="السعر" detail={<PriceDisplay price={option.price} compact />} wide={!isCompact} />
            <Fact label="التقييم الموثّق" detail={option.ratingLabel?.replace('تقييم موثّق: ', '') ?? 'غير متوفر'} />
            <Fact
              label="أقرب موعد"
              detail={
                option.nearestAppointmentIso ? <BodyStrong>{formatDateTime(option.nearestAppointmentIso)}</BodyStrong> : 'غير متوفر حاليًا'
              }
            />
          </View>
        ) : <PriceDisplay price={option.price} compact />}

        {!isCompact && option.priceIncludes ? <Helper>{option.priceIncludes}</Helper> : null}

        {!isCompact ? (
          <StackFacts>
            <Helper>{option.fundedProtection ? 'تتوفر حماية مالية ممولة عند الحاجة.' : 'لا تشمل حماية مالية ممولة.'}</Helper>
            <Helper>
              آخر تقييم للتوفر: {formatDateTime(option.assessedAtIso)}
            </Helper>
          </StackFacts>
        ) : null}

        {variant === 'row' && onPress ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
            <Icon name="magnifying-glass" color={color('action.primary')} scale="sm" />
            <Body tone="link">عرض تفاصيل الطبيب</Body>
          </View>
        ) : null}
      </Pressable>

      {variant === 'row' && onCompareToggle ? (
        <Pressable
          accessibilityRole="checkbox"
          aria-checked={selected}
          accessibilityState={{ disabled: compareDisabled && !selected }}
          accessibilityLabel={`${selected ? 'إزالة' : 'إضافة'} ${option.providerName} ${selected ? 'من' : 'إلى'} المقارنة`}
          disabled={compareDisabled && !selected}
          {...webSpaceActivationProps(onCompareToggle)}
          onFocus={compareRing.onFocus}
          onBlur={compareRing.onBlur}
          onPress={onCompareToggle}
          style={({ pressed }) => ({
            minHeight: size('target-floor'),
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: space('inline-xs'),
            paddingHorizontal: space('inset-sm'),
            borderRadius: radius('control'),
            backgroundColor: selected ? color('state.selected.surface') : pressed ? color('action.secondary-hover') : 'transparent',
            opacity: compareDisabled && !selected ? 0.45 : 1,
            ...compareRing.ringStyle,
          })}
        >
          <Icon
            name={selected ? 'check-circle' : 'plus-circle'}
            color={selected ? color('action.primary') : color('text.secondary')}
            scale="sm"
          />
          <Body tone={selected ? 'link' : 'secondary'}>{selected ? 'مُضاف للمقارنة' : 'أضف للمقارنة'}</Body>
        </Pressable>
      ) : null}
    </View>
  );
}

function StackFacts({ children }: { children: ReactNode }) {
  return <View style={{ gap: space('stack-xs') }}>{children}</View>;
}
