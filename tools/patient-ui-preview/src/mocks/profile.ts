export interface PatientProfileProjection {
  patientId: string;
  displayName: string;
  contactLabel: string;
  contactVerified: boolean;
  representedSubjectName?: string;
  representationAuthority?: string;
}

/** API-IDENTITY-003 Patient-safe identity projection. No authorization internals are exposed. */
export const patientProfile: PatientProfileProjection = {
  patientId: 'PAT-1008',
  displayName: 'مصطفى فارس',
  contactLabel: '+963 9XX XXX XXX',
  contactVerified: true,
};

export const representedPatientProfile: PatientProfileProjection = {
  ...patientProfile,
  representedSubjectName: 'لين',
  representationAuthority: 'أنت تتصفح الآن ضمن صلاحية تمثيل فعّالة للين',
};
