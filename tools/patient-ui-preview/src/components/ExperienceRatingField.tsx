import { Pressable, View } from 'react-native';
import { BodyStrong, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { webRadioKeyboardProps } from '../foundations/webKeyboardActivation';
import {
  REVIEW_RATING_LABELS,
  REVIEW_RATING_VALUES,
  reviewRatingAccessibilityLabel,
  type ReviewRatingValue,
} from '../reviews/rating';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function RatingStar({ filled }: { filled: boolean }) {
  const px = size('icon-lg');
  const stroke = filled ? color('action.primary') : color('border.strong');
  const fill = filled ? color('action.primary') : color('surface.default');

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: px, height: px }}
    >
      <svg aria-hidden="true" focusable="false" width={px} height={px} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3.7l2.55 5.18 5.72.83-4.14 4.04.98 5.7L12 16.77l-5.11 2.68.98-5.7-4.14-4.04 5.72-.83L12 3.7z"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </View>
  );
}

function RatingOption({
  option,
  value,
  tabbable,
  disabled,
  onChange,
}: {
  option: ReviewRatingValue;
  value: ReviewRatingValue | null;
  tabbable: boolean;
  disabled: boolean;
  onChange: (value: ReviewRatingValue) => void;
}) {
  const ring = useFocusRing();
  const selected = value === option;
  const filled = value !== null && option <= value;

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={reviewRatingAccessibilityLabel(option)}
      disabled={disabled}
      {...webRadioKeyboardProps(() => onChange(option), tabbable)}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={() => onChange(option)}
      style={({ pressed }) => ({
        minWidth: size('target-floor'),
        minHeight: size('target-floor'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius('control'),
        borderWidth: borderWidth(selected ? 'emphasis' : 'hairline'),
        borderColor: selected ? color('state.selected.border') : color('border.subtle'),
        backgroundColor: selected
          ? color('state.selected.surface')
          : pressed && !disabled
            ? color('action.secondary-hover')
            : color('surface.default'),
        opacity: disabled ? 0.6 : 1,
        ...ring.ringStyle,
      })}
    >
      <RatingStar filled={filled} />
    </Pressable>
  );
}

export function ExperienceRatingField({
  value,
  onChange,
  disabled = false,
}: {
  value: ReviewRatingValue | null;
  onChange: (value: ReviewRatingValue) => void;
  disabled?: boolean;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="كيف كانت تجربتك في هذه الزيارة؟"
      style={{ gap: space('stack-sm') }}
    >
      <BodyStrong>كيف كانت تجربتك في هذه الزيارة؟</BodyStrong>
      <View style={{ flexDirection: 'row', flexWrap: 'nowrap', gap: space('inline-xs'), alignItems: 'center' }}>
        {REVIEW_RATING_VALUES.map((option, index) => (
          <RatingOption
            key={option}
            option={option}
            value={value}
            tabbable={value === option || (value === null && index === 0)}
            disabled={disabled}
            onChange={onChange}
          />
        ))}
      </View>
      {value === null ? (
        <Helper>اختر من نجمة واحدة إلى خمس نجوم.</Helper>
      ) : (
        <BodyStrong accessibilityLabel={reviewRatingAccessibilityLabel(value)}>
          {value} من 5 · {REVIEW_RATING_LABELS[value]}
        </BodyStrong>
      )}
      <Helper>يقيس هذا التقييم تجربتك في الزيارة، وليس الكفاءة الطبية أو دقة التشخيص.</Helper>
    </View>
  );
}

export function ExperienceRatingReadout({ value }: { value: ReviewRatingValue }) {
  return (
    <View
      accessible
      accessibilityLabel={reviewRatingAccessibilityLabel(value)}
      style={{ gap: space('stack-xs'), alignItems: 'flex-start' }}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flexDirection: 'row', gap: space('inline-xs') }}
      >
        {REVIEW_RATING_VALUES.map((option) => <RatingStar key={option} filled={option <= value} />)}
      </View>
      <BodyStrong>{value} من 5 · {REVIEW_RATING_LABELS[value]}</BodyStrong>
    </View>
  );
}
