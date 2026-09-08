import { useState, type ReactNode } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { PriceDisplay } from '../components/PriceDisplay';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { ProviderIdentity } from '../components/ProviderIdentity';
import { formatArabicCount, formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { webRadioKeyboardProps } from '../foundations/webKeyboardActivation';
import {
  formatVerifiedReviewAggregate,
  verifiedReviewAggregateAccessibilityLabel,
} from '../reviews/rating';
import { borderWidth, color, radius, resolve, size, space } from '../theme/tokens';

export interface ProviderComparisonScreenProps {
  options: ProviderOption[];
  onBook: (option: ProviderOption) => void;
  onOpen: (option: ProviderOption) => void;
  onBack: () => void;
}

const ELIGIBILITY_LABEL: Record<ProviderOption['eligibility'], string> = {
  PENDING_EVALUATION: 'قيد التقييم',
  ELIGIBLE: 'مؤهّل لهذه الخدمة',
  SUSPENDED: 'معلَّق مؤقتًا',
  NOT_ELIGIBLE: 'غير مؤهَّل حاليًا',
};

const profileCMediumMin = Number.parseFloat(String(resolve('profile-c.size-class.medium')));

function OptionValue({
  option,
  children,
  stacked,
  testID,
}: {
  option: ProviderOption;
  children: ReactNode;
  stacked: boolean;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={stacked
        ? { width: '100%', minWidth: 0, gap: space('stack-xs') }
        : { flex: 1, minWidth: 0, gap: space('stack-xs') }}
    >
      <Helper>{option.providerName}</Helper>
      {typeof children === 'string' || typeof children === 'number' ? <BodyStrong>{children}</BodyStrong> : children}
    </View>
  );
}

function AttributeGroup({
  label,
  options,
  renderValue,
  stacked,
  testID,
}: {
  label: string;
  options: ProviderOption[];
  renderValue: (option: ProviderOption) => ReactNode;
  stacked: boolean;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <Heading4 aria-level={3}>{label}</Heading4>
      <View
        style={{
          flexDirection: stacked ? 'column' : 'row',
          flexWrap: 'nowrap',
          gap: space('stack-md'),
        }}
      >
        {options.map((option) => (
          <OptionValue
            key={option.id}
            option={option}
            stacked={stacked}
            testID={testID ? `${testID}-${option.id}` : undefined}
          >
            {renderValue(option)}
          </OptionValue>
        ))}
      </View>
    </View>
  );
}

function SelectionControl({ option, selected, tabbable, onSelect }: { option: ProviderOption; selected: boolean; tabbable: boolean; onSelect: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      aria-checked={selected}
      accessibilityLabel={`اختيار ${option.providerName} للحجز`}
      {...webRadioKeyboardProps(onSelect, tabbable)}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onSelect}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space('inline-xs'),
        paddingHorizontal: space('inset-md'),
        borderRadius: radius('control'),
        borderWidth: borderWidth(selected ? 'emphasis' : 'hairline'),
        borderColor: selected ? color('state.selected.border') : color('border.strong'),
        backgroundColor: selected ? color('state.selected.surface') : pressed ? color('action.secondary-hover') : color('surface.default'),
        ...ring.ringStyle,
      })}
    >
      <Icon name={selected ? 'check-circle' : 'plus-circle'} color={selected ? color('action.primary') : color('text.secondary')} scale="sm" />
      <Body tone={selected ? 'link' : 'primary'}>{selected ? 'محدد للحجز' : 'اختيار للحجز'}</Body>
    </Pressable>
  );
}

function InlineTextAction({ label, accessibilityLabel, tone = 'link', onPress }: { label: string; accessibilityLabel: string; tone?: 'link' | 'secondary'; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-floor'),
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
        ...ring.ringStyle,
      })}
    >
      <Body tone={tone}>{label}</Body>
    </Pressable>
  );
}

function VerifiedRatingValue({ option }: { option: ProviderOption }) {
  const display = formatVerifiedReviewAggregate(option.verifiedRating);
  const accessibilityLabel = verifiedReviewAggregateAccessibilityLabel(option.verifiedRating);
  if (!display || !accessibilityLabel) return <BodyStrong>غير متوفر</BodyStrong>;
  return <BodyStrong accessibilityLabel={accessibilityLabel}>{display}</BodyStrong>;
}

/** SCR-ELIG-005 — transient, same-service, attribute-first comparison with no ranking. */
export function ProviderComparisonScreen({ options, onBook, onOpen, onBack }: ProviderComparisonScreenProps) {
  const [visibleOptions, setVisibleOptions] = useState(options);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const { width, fontScale } = useWindowDimensions();
  const stackedComparisonValues = width < profileCMediumMin || fontScale > 1;
  const chosen = visibleOptions.find((option) => option.id === chosenId);
  const oneService = new Set(visibleOptions.map((option) => option.serviceLabel)).size === 1;

  if (visibleOptions.length < 2 || visibleOptions.length > 3 || !oneService) {
    return (
      <Screen footer={<ActionBar actions={[{ key: 'back', label: 'رجوع إلى النتائج', role: 'primary', availability: { status: 'available' }, onPress: onBack }]} />}>
        <ScreenHeader eyebrow="المقارنة" title="تعذر فتح هذه المقارنة" description="اختر خيارين أو ثلاثة للخدمة نفسها من نتائج البحث، ثم حاول مجددًا." />
      </Screen>
    );
  }

  function removeOption(option: ProviderOption) {
    setVisibleOptions((current) => current.filter((item) => item.id !== option.id));
    if (chosenId === option.id) setChosenId(null);
  }

  return (
    <Screen
      footer={<ActionBar actions={[
        {
          key: 'book', label: 'متابعة لحجز الخيار المحدد', role: 'primary',
          availability: chosen ? { status: 'available' } : { status: 'disabled', reason: 'اختر خيارًا واحدًا للمتابعة.' },
          onPress: () => chosen && onBook(chosen),
        },
        { key: 'back', label: 'تعديل المقارنة', role: 'secondary', availability: { status: 'available' }, onPress: onBack },
      ]} />}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`${visibleOptions[0].serviceLabel} · ${formatArabicCount(visibleOptions.length, { one: 'خيار واحد', two: 'خياران', few: 'خيارات', many: 'خيارًا' })}`}
          title="قارن كل معلومة جنبًا إلى جنب"
          description="لا يوجد ترتيب أو خيار موصى به. اختر وفق المعلومات التي تهمك."
        />

        <View accessibilityRole="radiogroup" accessibilityLabel="اختيار مقدم الخدمة للحجز" style={{ gap: space('stack-md') }}>
          {visibleOptions.map((option, index) => (
            <View key={option.id} style={{ gap: space('stack-sm'), paddingBottom: space('stack-sm'), borderBottomWidth: borderWidth('hairline'), borderBottomColor: color('border.subtle') }}>
              <ProviderIdentity name={option.providerName} branch={option.branchName} area={option.areaLabel} compact />
              <SelectionControl option={option} selected={chosenId === option.id} tabbable={chosenId === option.id || (!chosenId && index === 0)} onSelect={() => setChosenId(option.id)} />
              <InlineTextAction label="عرض التفاصيل الكاملة" accessibilityLabel={`عرض التفاصيل الكاملة لـ ${option.providerName}`} onPress={() => onOpen(option)} />
              {visibleOptions.length > 2 ? (
                <InlineTextAction label="إزالة من المقارنة" accessibilityLabel={`إزالة ${option.providerName} من المقارنة`} tone="secondary" onPress={() => removeOption(option)} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading4>تفاصيل المقارنة</Heading4>
          <AttributeGroup testID="comparison-price" label="السعر" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => <PriceDisplay price={option.price} compact />} />
          <AttributeGroup testID="comparison-price-includes" label="ما يشمله السعر" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => option.priceIncludes ?? 'لم تُذكر تفاصيل إضافية'} />
          <AttributeGroup testID="comparison-rating" label="التقييم الموثّق" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => <VerifiedRatingValue option={option} />} />
          <AttributeGroup testID="comparison-appointment" label="أقرب موعد" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => option.nearestAppointmentIso ? <BodyStrong>{formatDateTime(option.nearestAppointmentIso)}</BodyStrong> : 'غير متوفر حاليًا'} />
          <AttributeGroup testID="comparison-branch" label="الفرع والمنطقة" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => `${option.branchName} · ${option.areaLabel}`} />
          <AttributeGroup testID="comparison-eligibility" label="حالة الأهلية" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => ELIGIBILITY_LABEL[option.eligibility]} />
          <AttributeGroup testID="comparison-protection" label="الحماية الممولة" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => option.fundedProtection ? 'متوفرة عند الحاجة' : 'غير مشمولة'} />
          <AttributeGroup testID="comparison-assessed-at" label="آخر تقييم للتوفر" options={visibleOptions} stacked={stackedComparisonValues} renderValue={(option) => <BodyStrong>{formatDateTime(option.assessedAtIso)}</BodyStrong>} />
        </View>
      </Stack>
    </Screen>
  );
}
