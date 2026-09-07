import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { StateChip } from '../components/StateChip';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { EvidenceRequirementProjection } from '../mocks/evidence';
import {
  acceptedDependentEvidenceIds,
  representationActionOptions,
  representationDataScopeOptions,
  type DependentRepresentationDraft,
  type DependentRepresentationRequest,
  type DependentRepresentationRequestState,
} from '../mocks/representation';
import { borderWidth, color, radius, size, space } from '../theme/tokens';
import { EvidenceTransferPanel } from '../widgets/EvidenceTransferPanel';

const REQUEST_LABEL: Record<DependentRepresentationRequestState, string> = {
  DRAFT: 'مسودة',
  SUBMITTED: 'قيد التحقق',
  CHANGES_REQUESTED: 'مطلوب تعديل',
  APPROVED: 'تم الاعتماد',
  REJECTED: 'مرفوض',
};

function ToggleChoice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
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

function RequestProjection({ request }: { request: DependentRepresentationRequest }) {
  return (
    <View style={{ gap: space('stack-md') }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}>
          <Helper>طلب تمثيل تابع</Helper>
          <Heading3>{request.draft.subjectIdentification}</Heading3>
        </View>
        <StateChip machine="onboarding-application" status={request.state} label={REQUEST_LABEL[request.state]} />
      </View>
      {request.submittedAtIso ? <Helper>أُرسل في {formatDateTime(request.submittedAtIso)}</Helper> : null}
      {request.decisionReason ? (
        <View
          accessibilityRole="alert"
          style={{
            gap: space('stack-xs'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <BodyStrong>{request.state === 'CHANGES_REQUESTED' ? 'ما الذي يحتاج تعديلًا؟' : request.state === 'REJECTED' ? 'سبب الرفض' : 'نتيجة التحقق'}</BodyStrong>
          <Body>{request.decisionReason}</Body>
        </View>
      ) : null}

      {request.state === 'SUBMITTED' ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>لم تُنشأ صلاحية بعد.</BodyStrong>
          <Body>الطلب بانتظار تحقق بشري. رفع المستندات أو إرسال الطلب لا يسمح لك بالتصرف لصالح التابع قبل قرار الاعتماد.</Body>
        </View>
      ) : null}
      {request.state === 'APPROVED' ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>أنشأ الاعتماد صلاحية قانونية بالنطاق الذي وافق عليه المراجع.</BodyStrong>
          <Body>شاشة «العائلة والتمثيل» هي المرجع الآن لقراءة الصلاحية الفعّالة ونطاقها.</Body>
        </View>
      ) : null}
      {request.state === 'REJECTED' ? (
        <Body>لم تُنشأ أي صلاحية من هذا الطلب.</Body>
      ) : null}
    </View>
  );
}

/** SCR-IDENTITY-037 — legal-basis representation request. Submission creates a request, never a grant. */
export function AddDependentScreen({
  evidenceRequirements,
  request,
  initialSubjectIdentification = '',
  initialRelationship = '',
  initialLegalBasis = '',
  initialPurpose = '',
  initialActions = [],
  initialDataScope = [],
  onSubmit,
  onCancel,
  onAddEvidence,
  onResumeEvidence,
  onRetryEvidence,
  onReplaceEvidence,
}: {
  evidenceRequirements: EvidenceRequirementProjection[];
  request?: DependentRepresentationRequest;
  initialSubjectIdentification?: string;
  initialRelationship?: string;
  initialLegalBasis?: string;
  initialPurpose?: string;
  initialActions?: string[];
  initialDataScope?: string[];
  onSubmit: (draft: DependentRepresentationDraft) => void;
  onCancel: () => void;
  onAddEvidence?: (requirementId: string) => void;
  onResumeEvidence?: (itemId: string) => void;
  onRetryEvidence?: (itemId: string) => void;
  onReplaceEvidence?: (itemId: string) => void;
}) {
  const initial = request?.draft;
  const [subjectIdentification, setSubjectIdentification] = useState(initial?.subjectIdentification ?? initialSubjectIdentification);
  const [relationship, setRelationship] = useState(initial?.relationship ?? initialRelationship);
  const [legalBasis, setLegalBasis] = useState(initial?.legalBasis ?? initialLegalBasis);
  const [purpose, setPurpose] = useState(initial?.purpose ?? initialPurpose);
  const [requestedActions, setRequestedActions] = useState<string[]>(initial?.requestedActions ?? initialActions);
  const [requestedDataScope, setRequestedDataScope] = useState<string[]>(initial?.requestedDataScope ?? initialDataScope);

  const acceptedEvidenceIds = useMemo(() => acceptedDependentEvidenceIds(evidenceRequirements), [evidenceRequirements]);
  const everyRequirementAccepted = evidenceRequirements.length > 0 && evidenceRequirements.every((requirement) =>
    requirement.items.some((item) => item.state === 'ACCEPTED'),
  );
  const editable = !request || request.state === 'DRAFT' || request.state === 'CHANGES_REQUESTED';

  const missing = useMemo(() => {
    const items: string[] = [];
    if (!subjectIdentification.trim()) items.push('بيانات تعريف التابع');
    if (!relationship.trim()) items.push('العلاقة');
    if (!legalBasis.trim()) items.push('الأساس القانوني');
    if (!requestedActions.length) items.push('الأفعال المطلوبة');
    if (!requestedDataScope.length) items.push('نطاق البيانات');
    if (!purpose.trim()) items.push('الغرض');
    if (!everyRequirementAccepted) items.push('المستندات المقبولة المطلوبة');
    return items;
  }, [everyRequirementAccepted, legalBasis, purpose, relationship, requestedActions.length, requestedDataScope.length, subjectIdentification]);

  const toggle = (value: string, current: string[], setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const draft: DependentRepresentationDraft = {
    subjectIdentification: subjectIdentification.trim(),
    relationship: relationship.trim(),
    legalBasis: legalBasis.trim(),
    requestedActions,
    requestedDataScope,
    purpose: purpose.trim(),
    evidenceIds: acceptedEvidenceIds,
  };

  const actions: ActionSpec[] = [];
  if (editable) {
    actions.push({
      key: 'submit',
      label: request?.state === 'CHANGES_REQUESTED' ? 'إعادة إرسال طلب التحقق' : 'إرسال طلب التحقق',
      role: 'primary',
      availability: missing.length === 0
        ? { status: 'available' }
        : { status: 'disabled', reason: `أكمل أولًا: ${missing.join('، ')}.` },
      onPress: () => onSubmit(draft),
    });
  }
  actions.push({
    key: 'cancel',
    label: editable ? 'إلغاء' : 'العودة',
    role: 'secondary',
    availability: { status: 'available' },
    onPress: onCancel,
  });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="إضافة تابع"
          title="اطلب التمثيل، ولا تمنح نفسك الصلاحية"
          description="هذا المسار للتابع الذي لا يستطيع منح موافقة مباشرة. إرسال البيانات والمستندات يبدأ تحققًا بشريًا فقط؛ لا يصبح لديك وصول إلى سجل التابع حتى يعتمد الطلب."
        />

        {request && !editable ? <RequestProjection request={request} /> : (
          <>
            {request?.state === 'CHANGES_REQUESTED' ? <RequestProjection request={request} /> : null}

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                backgroundColor: color('surface.subtle'),
              }}
            >
              <BodyStrong>هذه ليست شاشة إنشاء صلاحية.</BodyStrong>
              <Body>المراجع البشري هو من يقرر إن كان الأساس والعلاقة والنطاق يبررون إنشاء صلاحية قانونية. لا يمكن لولي الأمر اعتماد طلبه بنفسه.</Body>
            </View>

            <ValidationField
              label="بيانات تعريف التابع"
              value={subjectIdentification}
              onChangeText={setSubjectIdentification}
              helper="اكتب ما يكفي لتمييز الشخص المطلوب التحقق منه دون إدخال أسرار أو روابط ملفات."
              placeholder="الاسم وبيانات التعريف المناسبة"
              maxLength={300}
            />
            <ValidationField
              label="العلاقة بالتابع"
              value={relationship}
              onChangeText={setRelationship}
              helper="مثال: ولي أمر. هذه المعلومة تخضع للتحقق ولا تكفي وحدها للمنح."
              placeholder="العلاقة"
              maxLength={160}
            />
            <ValidationField
              label="الأساس القانوني أو سبب طلب التمثيل"
              value={legalBasis}
              onChangeText={setLegalBasis}
              helper="سيُراجع مع المستندات الداعمة قبل إنشاء أي صلاحية."
              placeholder="اشرح الأساس الذي تعتمد عليه"
              maxLength={600}
              multiline
              numberOfLines={4}
            />

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>الأفعال التي تطلبها</Heading3>
              {representationActionOptions.map((option) => (
                <ToggleChoice
                  key={option.id}
                  label={option.label}
                  selected={requestedActions.includes(option.label)}
                  onPress={() => toggle(option.label, requestedActions, setRequestedActions)}
                />
              ))}
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>نطاق البيانات الذي تطلبه</Heading3>
              {representationDataScopeOptions.map((option) => (
                <ToggleChoice
                  key={option.id}
                  label={option.label}
                  selected={requestedDataScope.includes(option.label)}
                  onPress={() => toggle(option.label, requestedDataScope, setRequestedDataScope)}
                />
              ))}
            </View>

            <ValidationField
              label="الغرض من التمثيل"
              value={purpose}
              onChangeText={setPurpose}
              helper="يُراجع الغرض مع النطاق ولا يتحول إلى صلاحية عامة."
              placeholder="لماذا تحتاج إلى التمثيل؟"
              maxLength={500}
              multiline
              numberOfLines={4}
            />

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>المستندات المطلوبة للتحقق</Heading3>
              <EvidenceTransferPanel
                requirements={evidenceRequirements}
                onAddItem={onAddEvidence}
                onResume={onResumeEvidence}
                onRetry={onRetryEvidence}
                onReplace={onReplaceEvidence}
              />
              {!everyRequirementAccepted ? (
                <Helper>الملف المحدد أو المرفوع أو قيد الفحص لا يحقق المتطلب قبل أن يصبح مقبولًا.</Helper>
              ) : (
                <BodyStrong>كل المتطلبات الظاهرة مقبولة وجاهزة للإرسال إلى التحقق البشري.</BodyStrong>
              )}
            </View>

            <View
              style={{
                gap: space('stack-xs'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('border.subtle'),
                backgroundColor: color('surface.default'),
              }}
            >
              <Heading3>ما الذي سيحدث بعد الإرسال؟</Heading3>
              <Body>1. يُسجل طلب تحت التحقق.</Body>
              <Body>2. يراجع شخص مخوّل العلاقة والأساس والمستندات والنطاق المطلوب.</Body>
              <Body>3. الاعتماد وحده يستطيع إنشاء صلاحية قانونية بالنطاق المعتمد.</Body>
              <BodyStrong>لن ينشئ زر الإرسال صلاحية الآن.</BodyStrong>
            </View>
          </>
        )}
      </Stack>
    </Screen>
  );
}
