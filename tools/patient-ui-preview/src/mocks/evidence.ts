export type EvidenceTransferState =
  | 'SELECTED'
  | 'UPLOADING'
  | 'PAUSED'
  | 'FAILED_RETRYABLE'
  | 'UPLOADED'
  | 'VALIDATING_SCANNING'
  | 'ACCEPTED'
  | 'REJECTED';

export interface EvidenceItemProjection {
  id: string;
  /** Patient-readable evidence identity. Never a storage path, opaque object key, or signed URL. */
  displayName: string;
  state: EvidenceTransferState;
  progress?: number;
  nextStep: string;
  rejectionReason?: string;
}

export interface EvidenceRequirementProjection {
  id: string;
  title: string;
  why: string;
  items: EvidenceItemProjection[];
}

export const evidenceStateExamples: EvidenceItemProjection[] = [
  {
    id: 'evidence-selected',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'SELECTED',
    nextStep: 'ابدأ الرفع عندما يكون الاتصال مناسبًا.',
  },
  {
    id: 'evidence-uploading',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'UPLOADING',
    progress: 62,
    nextStep: 'اترك التطبيق مفتوحًا حتى يكتمل النقل، أو عد لاحقًا إذا انقطع الاتصال.',
  },
  {
    id: 'evidence-paused',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'PAUSED',
    progress: 62,
    nextStep: 'يمكن استئناف الرفع من حيث توقف.',
  },
  {
    id: 'evidence-retryable',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'FAILED_RETRYABLE',
    progress: 62,
    nextStep: 'استأنف أو أعد محاولة رفع الملف نفسه. لم تتم مراجعة الملف ولم يُرفض.',
  },
  {
    id: 'evidence-uploaded',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'UPLOADED',
    nextStep: 'وصل الملف ويحتاج إلى الفحص والتحقق قبل أن يُعد مقبولًا.',
  },
  {
    id: 'evidence-scanning',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'VALIDATING_SCANNING',
    nextStep: 'يجري فحص الملف للتأكد من سلامته ومطابقته للمتطلب.',
  },
  {
    id: 'evidence-accepted',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'ACCEPTED',
    nextStep: 'لا يلزم إجراء آخر لهذا المتطلب.',
  },
  {
    id: 'evidence-rejected',
    displayName: 'صورة الأشعة المطلوبة',
    state: 'REJECTED',
    nextStep: 'استبدل الملف بملف يطابق المتطلب المذكور.',
    rejectionReason: 'نوع الملف لا يطابق الصيغة المطلوبة لهذا المتطلب.',
  },
];

export const patientEvidenceRequirement: EvidenceRequirementProjection = {
  id: 'requirement-radiograph',
  title: 'صورة تدعم الطلب',
  why: 'هذا المتطلب مرتبط بالسجل الذي تعمل عليه ولا يسمح برفع ملفات عامة غير مرتبطة بمتطلب.',
  items: [evidenceStateExamples[3]],
};
