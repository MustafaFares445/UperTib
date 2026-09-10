import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { EditableStepSection } from '../components/EditableStepSection';
import { SelectionChoice } from '../components/SelectionChoice';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper, Label } from '../foundations/Text';
import {
  representationActionOptions,
  representationDataScopeOptions,
  type ConsentGrantDraft,
  type GrantPeriodMode,
} from '../mocks/representation';
import { borderWidth, color, radius, space } from '../theme/tokens';

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

  const periodSummary = periodMode === 'BOUNDED'
    ? `حتى ${formatDateTime(boundedUntilIso)}`
    : periodMode === 'OPEN_ENDED'
      ? 'بلا تاريخ نهاية محدد'
      : 'لم تُحدد المدة بعد';
  const stepOneComplete = Boolean(granteeName.trim());
  const stepTwoComplete = actions.length > 0;
  const stepThreeComplete = dataScope.length > 0;
  const stepFourComplete = Boolean(purpose.trim() && periodMode);

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
    { key: 'cancel', label: 'إلغاء', role: 'secondary', availability: { status: 'available' }, onPress: onCancel },
  ];

  return (
    <Screen footer={<ActionBar actions={actionsBar} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="منح صلاحية" title="ابنِ صلاحية واضحة خطوة بخطوة" />

        <ContextNote
          icon="shield-check"
          title={`صاحب السجل: ${subjectPatientName}`}
          body="هذا المسار لمريض بالغ يمنح صلاحية لشخص آخر بموافقته. إضافة تابع لا يستطيع منح الموافقة لنفسه تمر بمسار تحقق منفصل ولا تنشئ صلاحية مباشرة."
        />

        <EditableStepSection
          title="1. من سيحصل على الصلاحية؟"
          summary={granteeName.trim() || 'لم يُحدد الشخص بعد'}
          complete={stepOneComplete}
          testID="grant-step-grantee"
        >
          <ValidationField
            label="الشخص الذي ستمنحه الصلاحية"
            value={granteeName}
            onChangeText={setGranteeName}
            helper="يجب أن تكون الهوية قابلة للحل والتحقق قبل إنشاء الصلاحية."
            placeholder="اسم الشخص"
            maxLength={120}
          />
        </EditableStepSection>

        <EditableStepSection
          title="2. ما الذي يستطيع فعله؟"
          summary={actions.length ? actions.join('، ') : 'لم تُحدد الأفعال بعد'}
          complete={stepTwoComplete}
          testID="grant-step-actions"
        >
          {representationActionOptions.map((option) => (
            <SelectionChoice
              key={option.id}
              label={option.label}
              selected={actions.includes(option.label)}
              onPress={() => toggle(option.label, actions, setActions)}
            />
          ))}
        </EditableStepSection>

        <EditableStepSection
          title="3. ما المعلومات التي يستطيع الوصول إليها؟"
          summary={dataScope.length ? dataScope.join('، ') : 'لم يُحدد نطاق البيانات بعد'}
          complete={stepThreeComplete}
          testID="grant-step-data"
        >
          {representationDataScopeOptions.map((option) => (
            <SelectionChoice
              key={option.id}
              label={option.label}
              selected={dataScope.includes(option.label)}
              onPress={() => toggle(option.label, dataScope, setDataScope)}
            />
          ))}
        </EditableStepSection>

        <EditableStepSection
          title="4. لماذا؟ وإلى متى؟"
          summary={stepFourComplete ? `${purpose.trim()} · ${periodSummary}` : 'أكمل الغرض والمدة'}
          complete={stepFourComplete}
          testID="grant-step-purpose-period"
        >
          <ValidationField
            label="الغرض"
            value={purpose}
            onChangeText={setPurpose}
            helper="الغرض جزء من النطاق الذي سيُراجع عند كل استخدام للصلاحية."
            placeholder="مثال: المساعدة في متابعة المواعيد أثناء السفر"
            maxLength={500}
            multiline
            numberOfLines={4}
          />
          <Body>تبدأ: {formatDateTime(effectiveFromIso)}</Body>
          <SelectionChoice
            role="radio"
            label={`محددة حتى ${formatDateTime(boundedUntilIso)}`}
            selected={periodMode === 'BOUNDED'}
            onPress={() => setPeriodMode('BOUNDED')}
          />
          <SelectionChoice
            role="radio"
            label="بلا تاريخ نهاية محدد"
            selected={periodMode === 'OPEN_ENDED'}
            onPress={() => setPeriodMode('OPEN_ENDED')}
          />
          <Helper>لا نختار الصلاحية المفتوحة تلقائيًا؛ يجب أن تكون قرارًا صريحًا منك.</Helper>
        </EditableStepSection>

        {/* Completed authoring steps may collapse, but the full controlling scope stays visible here before the committing action. */}
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
          <Heading3>5. راجع الإذن قبل التأكيد</Heading3>
          <BodyStrong>{granteeName.trim() || 'لم يُحدد الشخص بعد'}</BodyStrong>
          <Body>لصالح: {subjectPatientName}</Body>
          <View style={{ gap: space('stack-xs') }}>
            <Label>يمكنه</Label>
            {actions.length ? actions.map((item) => <Body key={item}>• {item}</Body>) : <Helper>لم تُحدد الأفعال بعد.</Helper>}
          </View>
          <View style={{ gap: space('stack-xs') }}>
            <Label>يمكنه الوصول إلى</Label>
            {dataScope.length ? dataScope.map((item) => <Body key={item}>• {item}</Body>) : <Helper>لم يُحدد نطاق البيانات بعد.</Helper>}
          </View>
          <View style={{ gap: space('stack-xs') }}>
            <Label>الغرض</Label>
            {purpose.trim() ? <Body>{purpose.trim()}</Body> : <Helper>لم يُحدد الغرض بعد.</Helper>}
          </View>
          <Body>تبدأ: {formatDateTime(effectiveFromIso)}</Body>
          <Body>حتى: {periodSummary}</Body>
          <Body>الأساس: موافقة مباشرة من المريض</Body>
          <Helper>يمنح التأكيد هذا النطاق فقط، ولا ينشئ دورًا عامًا أو وصولًا خارج ما هو ظاهر هنا.</Helper>
        </View>
      </Stack>
    </Screen>
  );
}
