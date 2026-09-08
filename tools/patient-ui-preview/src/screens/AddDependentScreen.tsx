import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { ContextNote } from '../components/ContextNote';
import { SelectionChoice } from '../components/SelectionChoice';
import { StateChip } from '../components/StateChip';
import { ValidationField } from '../components/ValidationField';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { EvidenceRequirementProjection } from '../mocks/evidence';
import {
  acceptedDependentEvidenceIds,
  representationActionOptions,
  representationDataScopeOptions,
  type DependentRepresentationDraft,
  type DependentRepresentationRequest,
  type DependentRepresentationRequestState,
} from '../mocks/representation';
import { color, radius, space } from '../theme/tokens';
import { EvidenceTransferPanel } from '../widgets/EvidenceTransferPanel';

const REQUEST_LABEL: Record<DependentRepresentationRequestState, string> = {
  DRAFT: 'مسودة', SUBMITTED: 'قيد التحقق', CHANGES_REQUESTED: 'مطلوب تعديل', APPROVED: 'تم الاعتماد', REJECTED: 'مرفوض',
};

function RequestProjection({ request }: { request: DependentRepresentationRequest }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ gap: space('stack-md'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}><Helper>طلب تمثيل تابع</Helper><Heading3>{request.draft.subjectIdentification}</Heading3></View>
        <StateChip machine="onboarding-application" status={request.state} label={REQUEST_LABEL[request.state]} />
      </View>
      {request.submittedAtIso ? <Helper>أُرسل في {formatDateTime(request.submittedAtIso)}</Helper> : null}
      {request.decisionReason ? <View style={{ gap: space('stack-xs') }}><BodyStrong>{request.state === 'CHANGES_REQUESTED' ? 'ما الذي يحتاج تعديلًا؟' : request.state === 'REJECTED' ? 'سبب الرفض' : 'نتيجة التحقق'}</BodyStrong><Body>{request.decisionReason}</Body></View> : null}
      {request.state === 'SUBMITTED' ? <><BodyStrong>لم تُنشأ صلاحية بعد.</BodyStrong><Body>الطلب بانتظار تحقق بشري. رفع المستندات أو إرسال الطلب لا يسمح لك بالتصرف لصالح التابع قبل قرار الاعتماد.</Body></> : null}
      {request.state === 'APPROVED' ? <><BodyStrong>تم اعتماد التمثيل بالنطاق الذي وافق عليه المراجع.</BodyStrong><Body>افتح «العائلة والتمثيل» لقراءة الصلاحية الفعّالة.</Body></> : null}
      {request.state === 'REJECTED' ? <Body>لم تُنشأ أي صلاحية من هذا الطلب.</Body> : null}
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
  const acceptedRequirementCount = useMemo(
    () => evidenceRequirements.filter((requirement) => requirement.items.some((item) => item.state === 'ACCEPTED')).length,
    [evidenceRequirements],
  );
  const firstOutstandingRequirement = useMemo(
    () => evidenceRequirements.find((requirement) => !requirement.items.some((item) => item.state === 'ACCEPTED')),
    [evidenceRequirements],
  );
  const everyRequirementAccepted = evidenceRequirements.length > 0 && acceptedRequirementCount === evidenceRequirements.length;
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
  const toggle = (value: string, current: string[], setter: (next: string[]) => void) => setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const draft: DependentRepresentationDraft = { subjectIdentification: subjectIdentification.trim(), relationship: relationship.trim(), legalBasis: legalBasis.trim(), requestedActions, requestedDataScope, purpose: purpose.trim(), evidenceIds: acceptedEvidenceIds };

  const actions: ActionSpec[] = [];
  if (editable) actions.push({ key: 'submit', label: request?.state === 'CHANGES_REQUESTED' ? 'إعادة إرسال طلب التحقق' : 'إرسال طلب التحقق', role: 'primary', availability: missing.length === 0 ? { status: 'available' } : { status: 'disabled', reason: `أكمل أولًا: ${missing.join('، ')}.` }, onPress: () => onSubmit(draft) });
  actions.push({ key: 'cancel', label: editable ? 'إلغاء' : 'العودة', role: 'secondary', availability: { status: 'available' }, onPress: onCancel });

  return (
    <Screen footer={<ActionBar actions={actions} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="إضافة تابع" title={editable ? 'تحقق من العلاقة قبل تفعيل التمثيل' : 'حالة طلب التحقق'} />
        {request && !editable ? <RequestProjection request={request} /> : (
          <>
            {request?.state === 'CHANGES_REQUESTED' ? <RequestProjection request={request} /> : null}
            <View style={{ gap: space('stack-xs') }}>
              <ContextNote
                icon="shield-exclamation"
                title="هذه ليست شاشة إنشاء صلاحية."
                body="المراجع البشري هو من يقرر إن كانت العلاقة والأساس والمستندات تبرر التمثيل."
              />
              <BodyStrong>لن ينشئ زر الإرسال صلاحية الآن.</BodyStrong>
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>1. من هو التابع وما علاقتك به؟</Heading3>
              <ValidationField label="بيانات تعريف التابع" value={subjectIdentification} onChangeText={setSubjectIdentification} helper="اكتب ما يكفي لتمييز الشخص المطلوب التحقق منه." placeholder="الاسم وبيانات التعريف المناسبة" maxLength={300} />
              <ValidationField label="العلاقة بالتابع" value={relationship} onChangeText={setRelationship} helper="هذه المعلومة تخضع للتحقق ولا تكفي وحدها للمنح." placeholder="العلاقة" maxLength={160} />
              <ValidationField label="الأساس القانوني أو سبب طلب التمثيل" value={legalBasis} onChangeText={setLegalBasis} helper="سيُراجع مع المستندات قبل إنشاء أي صلاحية." placeholder="اشرح الأساس الذي تعتمد عليه" maxLength={600} multiline numberOfLines={4} />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>2. ما النطاق الذي تطلبه؟</Heading3>
              <Helper>الأفعال</Helper>
              {representationActionOptions.map((option) => <SelectionChoice key={option.id} label={option.label} selected={requestedActions.includes(option.label)} onPress={() => toggle(option.label, requestedActions, setRequestedActions)} />)}
              <Helper>البيانات</Helper>
              {representationDataScopeOptions.map((option) => <SelectionChoice key={option.id} label={option.label} selected={requestedDataScope.includes(option.label)} onPress={() => toggle(option.label, requestedDataScope, setRequestedDataScope)} />)}
              <ValidationField label="الغرض من التمثيل" value={purpose} onChangeText={setPurpose} helper="يُراجع الغرض مع النطاق ولا يتحول إلى صلاحية عامة." placeholder="لماذا تحتاج إلى التمثيل؟" maxLength={500} multiline numberOfLines={4} />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>3. مستندات التحقق</Heading3>
              <BodyStrong>{acceptedRequirementCount} من {evidenceRequirements.length} متطلبات مكتملة</BodyStrong>
              {firstOutstandingRequirement ? (
                <Helper>المطلوب الآن: {firstOutstandingRequirement.title}. الملف المحدد أو المرفوع أو قيد الفحص لا يحقق المتطلب قبل أن يصبح مقبولًا.</Helper>
              ) : (
                <BodyStrong>كل المتطلبات الظاهرة مقبولة وجاهزة للإرسال إلى التحقق البشري.</BodyStrong>
              )}
              <EvidenceTransferPanel
                requirements={evidenceRequirements}
                onAddItem={onAddEvidence}
                onResume={onResumeEvidence}
                onRetry={onRetryEvidence}
                onReplace={onReplaceEvidence}
                collapseCompleted
              />
            </View>
          </>
        )}
      </Stack>
    </Screen>
  );
}
