import { useState } from 'react';
import {
  defaultDependentEvidenceRequirements,
  representationActionOptions,
  representationDataScopeOptions,
  submitDependentRepresentationRequest,
  type DependentRepresentationDraft,
  type DependentRepresentationRequest,
} from '../mocks/representation';
import { AddDependentScreen } from '../screens/AddDependentScreen';

/** FLOW-IDENTITY-021, Patient side — a guardian submits evidence for human verification; no self-grant. */
export function DependentRepresentationFlow() {
  const [request, setRequest] = useState<DependentRepresentationRequest | undefined>();
  const key = 'dependent-representation:lian:attempt-1';

  return (
    <AddDependentScreen
      evidenceRequirements={defaultDependentEvidenceRequirements}
      request={request}
      initialSubjectIdentification="ليان فارس — مواليد 2014"
      initialRelationship="ولي أمر"
      initialLegalBasis="طلب تمثيل تابع يحتاج تحققًا بشريًا من العلاقة والأساس."
      initialPurpose="متابعة المواعيد والخطة العلاجية للتابع ضمن النطاق المعتمد."
      initialActions={[representationActionOptions[0].label, representationActionOptions[1].label]}
      initialDataScope={[representationDataScopeOptions[0].label, representationDataScopeOptions[1].label]}
      onSubmit={(draft: DependentRepresentationDraft) => {
        const result = submitDependentRepresentationRequest(draft, defaultDependentEvidenceRequirements, {
          idempotencyKey: key,
          existingRequest: request,
        });
        if (!result.request || result.blockedBy) return;
        setRequest(result.request);
      }}
      onCancel={() => undefined}
    />
  );
}
