import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper, Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import {
  representationActionOptions,
  representationDataScopeOptions,
  type ConsentGrantDraft,
  type GrantPeriodMode,
} from '../mocks/representation';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      style={({ pressed }) => ({
        minHeight: size('target-floor'),
        justifyContent: 'center',
        paddingHorizontal: space('inset-sm'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: selected ? color('border.strong') : color('border.subtle'),
        backgroundColor: selected || pressed ? color('surface.subtle') : color('surface.default'),
        ...ring.ringStyle,
      })}
    >
      <BodyStrong>{selected ? `✓ ${label}` : label}</BodyStrong>
    </Pressable>
  );
}

/** SCR-IDENTITY-006 — adult-consent grant authoring with the entire scope visible before commit. */
export function CreateGrantScreen({
  subjectPatientName,
  effectiveFromIso = '2026-09-07T09:00:00+03:00',
  boundedUntilIso = '2026-10-07T23:59:59+03:00',
  initialGranteeName = '',
  initialPurpose = '',
  initialActions = [],
  initialDataScope = [],
  initialPeriodMode,
  onCreate,
  onCancel,
}: {
  subjectPatientName: string;
  effectiveFromIso?: string;
  boundedUntilIso?: string;
  initialGranteeName?: string;
  initialPurpose?: string;
  initialActions?: string[];
  initialDataScope?: string[];
  initialPeriodMode?: GrantPeriodMode;
  onCreate: (draft: ConsentGrantDraft) => void;
  onCancel: () => void;
}) {
  const [granteeName, setGranteeName] = useState(initialGranteeName);
  const [purpose, setPurpose] = useState(initialPurpose);
  const [actions, setActions] = useState<string[]>(initialActions);
  const [dataScope, setDataScope] = useState<string[]>(initialDataScope);
  const [periodMode, setPeriodMode] = useState<GrantPeriodMode | undefined>(initialPeriodMode);

  const missing = useMemo(() => {
    const items: string[] = [];
    if (!granteeName.trim()) items.push('الشخص الذي ستمنحه الصلاحية');
    if (!actions.length) items.push('الأفعال المسموح بها');
    if (!dataScope.length) items.push('نطاق البيانات');
    if (!purpose.trim()) items.push('الغرض');
    if (!periodMode) items.push('مدة الصلاحية');
    return items;
  }, [actions.length, dataScope.length, granteeName, periodMode, purpose]);

  const toggle = (value: string, current: string[], setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const draft: ConsentGrantDraft = {
    subjectPatientName,
    granteeName: granteeName.trim(),
    actions,
    dataScope,
    purpose: purpose.trim(),
    effectiveFromIso,
    periodMode: periodMode ?? 'BOUNDED',
    effectiveUntilIso: periodMode === 'BOUNDED' ? boundedUntilIso : undefined,
    legalOrGrantBasis: 'موافقة مباشرة من المريض',
  };

  const actionsBar: ActionSpec[] = [
    {
      key: 'create',
      label: 'إنشاء الصلاحية بهذا النطاق',
      role: 'primary',
      availability: missing.length === 0
        ? { status: 'available' }
        : { status: 'disabled', reason: `أكمل أولًا: ${missing.join('، ')}.` },
      onPress: () => onCreate(draft),
    },
    {
      key: 'cancel',
      label: 'إلغاء',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onCancel,
    },
  ];

  return (
    <Screen footer={<ActionBar actions={actionsBar} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="منح صلاحية"
          title="حدّد ما تسمح به بالضبط"
          description="هذا المسار لمريض بالغ يمنح صلاحية لشخص آخر بموافقته. إضافة تابع لا يستطيع منح الموافقة لنفسه تمر بمسار تحقق منفصل ولا تنشئ صلاحية مباشرة."
        />

        <View style={{ gap: space('stack-xs') }}>
          <Label>صاحب السجل</Label>
          <Heading3>{subjectPatientName}</Heading3>
          <Helper>أنت تمنح الصلاحية عن نفسك؛ لا يمكن استخدام هذا النموذج ليمنح ولي الأمر نفسه صلاحية على تابع.</Helper>
        </View>

        <ValidationField
          label="الشخص الذي ستمنحه الصلاحية"
          value={granteeName}
          onChangeText={setGranteeName}
          helper="يجب أن تكون الهوية قابلة للحل والتحقق قبل إنشاء الصلاحية."
          placeholder="اسم الشخص"
          maxLength={120}
        />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>ما الذي يستطيع فعله؟</Heading3>
          <Helper>اختر الأفعال صراحةً. عدم الاختيار لا يعني «كل الأفعال».</Helper>
          {representationActionOptions.map((option) => (
            <Choice
              key={option.id}
              label={option.label}
              selected={actions.includes(option.label)}
              onPress={() => toggle(option.label, actions, setActions)}
            />
          ))}
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>ما البيانات التي يستطيع الوصول إليها؟</Heading3>
          <Helper>النطاق غير المختار يبقى خارج الصلاحية.</Helper>
          {representationDataScopeOptions.map((option) => (
            <Choice
              key={option.id}
              label={option.label}
              selected={dataScope.includes(option.label)}
              onPress={() => toggle(option.label, dataScope, setDataScope)}
            />
          ))}
        </View>

        <ValidationField
          label="لماذا تمنح هذه الصلاحية؟"
          value={purpose}
          onChangeText={setPurpose}
          helper="الغرض جزء من النطاق الذي سيُراجع عند كل استخدام للصلاحية."
          placeholder="مثال: المساعدة في متابعة المواعيد أثناء السفر"
          maxLength={500}
          multiline
          numberOfLines={4}
        />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>مدة الصلاحية</Heading3>
          <Body>تبدأ: {formatDateTime(effectiveFromIso)}</Body>
          <Choice
            label={`محددة حتى ${formatDateTime(boundedUntilIso)}`}
            selected={periodMode === 'BOUNDED'}
            onPress={() => setPeriodMode('BOUNDED')}
          />
          <Choice
            label="بلا تاريخ نهاية محدد"
            selected={periodMode === 'OPEN_ENDED'}
            onPress={() => setPeriodMode('OPEN_ENDED')}
          />
          <Helper>لا نختار الصلاحية المفتوحة تلقائيًا؛ يجب أن تكون قرارًا صريحًا منك.</Helper>
        </View>

        <View
          accessibilityLabel="مراجعة النطاق قبل إنشاء الصلاحية"
          style={{
            gap: space('stack-sm'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('border.strong'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Heading3>راجع النطاق قبل الإنشاء</Heading3>
          <BodyStrong>من يتصرف: {granteeName.trim() || 'لم يُحدد بعد'}</BodyStrong>
          <Body>لصالح: {subjectPatientName}</Body>
          <View style={{ gap: space('stack-xs') }}>
            <Label>الأفعال</Label>
            {actions.length ? actions.map((item) => <Body key={item}>• {item}</Body>) : <Helper>لم تُحدد بعد.</Helper>}
          </View>
          <View style={{ gap: space('stack-xs') }}>
            <Label>البيانات</Label>
            {dataScope.length ? dataScope.map((item) => <Body key={item}>• {item}</Body>) : <Helper>لم تُحدد بعد.</Helper>}
          </View>
          <Body>الغرض: {purpose.trim() || 'لم يُحدد بعد'}</Body>
          <Body>المدة: {periodMode === 'BOUNDED' ? `حتى ${formatDateTime(boundedUntilIso)}` : periodMode === 'OPEN_ENDED' ? 'بلا تاريخ نهاية محدد' : 'لم تُحدد بعد'}</Body>
          <Helper>إنشاء الصلاحية يمنح هذا النطاق فقط، ولا يمنح أي دور عام أو وصول خارج ما هو مكتوب هنا.</Helper>
        </View>
      </Stack>
    </Screen>
  );
}
