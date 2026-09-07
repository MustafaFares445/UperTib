import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  activeGivenGrant,
  activeHeldGrant,
  acceptedDependentEvidenceIds,
  createConsentGrant,
  defaultDependentEvidenceRequirements,
  representationActionOptions,
  representationDataScopeOptions,
  retryableDependentEvidenceRequirements,
  revokeRepresentationGrant,
  scanningDependentEvidenceRequirements,
  selectRepresentationContext,
  submitDependentRepresentationRequest,
  unresolvedScopeGrant,
} from '../src/mocks/representation';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Functional assertion — runs once, not per viewport.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, `${label} overflows horizontally`).toBe(false);
}

async function expectNoSeriousAccessibilityViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .analyze()
    .catch(async (error) => {
      if (!String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(1000);
      return new AxeBuilder({ page }).analyze();
    });
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(serious, `${label}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
}

const HIGH_RISK = [
  'patient-screens-scr-identity-005-family-and-representation--default',
  'patient-screens-scr-identity-005-family-and-representation--scope-unknown',
  'patient-screens-scr-identity-006-create-grant--ready',
  'patient-screens-scr-identity-007-grant-detail--active',
  'patient-screens-scr-identity-008-active-patient-context--default',
  'patient-screens-scr-identity-037-add-dependent--ready-for-verification',
  'patient-screens-scr-identity-037-add-dependent--evidence-rejected',
  'patient-screens-scr-identity-037-add-dependent--submitted',
];

test.describe('Slice 12 representation surfaces remain RTL, readable and reflow-safe', () => {
  for (const id of HIGH_RISK) {
    test(id, async ({ page }, testInfo) => {
      await gotoStory(page, id);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
      await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);
      if (testInfo.project.name === PRIMARY_PROJECT) await expectNoSeriousAccessibilityViolations(page, id);
    });
  }
});

test('family representation keeps grants given and grants held in visibly separate directions', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-005-family-and-representation--default');

  await expect(page.getByText('الصلاحيات التي منحتها أنت', { exact: true })).toBeVisible();
  await expect(page.getByText('الصلاحيات التي لديك للآخرين', { exact: true })).toBeVisible();
  await expect(page.getByText('أنت منحت هذه الصلاحية', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('هذه الصلاحية تتيح لك التمثيل', { exact: true })).toBeVisible();
  await expect(page.getByText('السجل السابق', { exact: true })).toBeVisible();
  await expect(page.getByText('منتهية الصلاحية', { exact: true })).toBeVisible();
  await expect(page.getByText('أُلغيت', { exact: true })).toBeVisible();
});

test('unknown grant scope is never treated as full scope and exposes no open action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-005-family-and-representation--scope-unknown');

  const unresolved = page.getByLabel('صلاحية منحتها، مها فارس، مصطفى فارس');
  await expect(unresolved).toBeVisible();
  await expect(unresolved.getByText('تعذّر قراءة نطاق هذه الصلاحية.', { exact: true })).toBeVisible();
  await expect(unresolved.getByRole('button', { name: 'فتح تفاصيل الصلاحية' })).toHaveCount(0);
});

test('create grant keeps the consent path distinct and shows the entire scope before commit', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-006-create-grant--ready');

  await expect(page.getByText(/هذا المسار لمريض بالغ يمنح صلاحية لشخص آخر بموافقته/)).toBeVisible();
  await expect(page.getByText(/إضافة تابع لا يستطيع منح الموافقة لنفسه تمر بمسار تحقق منفصل/)).toBeVisible();
  const review = page.getByLabel('مراجعة النطاق قبل إنشاء الصلاحية');
  const create = page.getByRole('button', { name: 'إنشاء الصلاحية بهذا النطاق' });
  await expect(review).toBeVisible();
  await expect(create).toBeEnabled();
  const reviewBeforeAction = await review.evaluate((node, button) => Boolean(node.compareDocumentPosition(button as Node) & Node.DOCUMENT_POSITION_FOLLOWING), await create.elementHandle());
  expect(reviewBeforeAction).toBe(true);
});

test('incomplete grant names the missing scope dimensions instead of enabling an over-broad default', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-006-create-grant--incomplete');

  const create = page.getByRole('button', { name: 'إنشاء الصلاحية بهذا النطاق' });
  await expect(create).toBeDisabled();
  await expect(page.getByText(/أكمل أولًا: الشخص الذي ستمنحه الصلاحية، الأفعال المسموح بها، نطاق البيانات، الغرض، مدة الصلاحية/)).toBeVisible();
  await expect(page.getByText(/لا نختار الصلاحية المفتوحة تلقائيًا/)).toBeVisible();
});

test('grant revocation remains reachable and its consequence never depends on booking, case or claim state', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-007-grant-detail--active');

  await expect(page.getByText(/لا توجد حالة حجز أو حالة أو مطالبة تستطيع تعطيل زر إلغاء التمثيل/)).toBeVisible();
  const revoke = page.getByRole('button', { name: 'إلغاء هذه الصلاحية' });
  await expect(revoke).toBeVisible();
  await revoke.click();
  await expect(page.getByText('السجل السابق لن يُحذف.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تأكيد إلغاء الصلاحية الآن' })).toBeVisible();
});

test('revocation projection is unconditional, immediate and idempotent while retaining attribution', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const result = revokeRepresentationGrant(activeGivenGrant, {
    actorAuthorized: true,
    downstreamRecordState: 'BOOKING_CONFIRMED_CASE_ACTIVE_CLAIM_OPEN',
    reason: 'انتهت الحاجة إلى التمثيل.',
  });
  expect(result.blockedBy).toBeUndefined();
  expect(result.grant.status).toBe('REVOKED');
  expect(result.grant.actions).toEqual(activeGivenGrant.actions);
  expect(result.grant.dataScope).toEqual(activeGivenGrant.dataScope);
  expect(result.grant.historicalAttribution).toBe(activeGivenGrant.historicalAttribution);

  const repeated = revokeRepresentationGrant(result.grant, { actorAuthorized: true, downstreamRecordState: 'ANY_STATE' });
  expect(repeated.reused).toBe(true);
  expect(repeated.grant.revokedAtIso).toBe(result.grant.revokedAtIso);
});

test('active-patient context exposes only active resolved held grants and keeps acting identity visible', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-008-active-patient-context--default');

  await expect(page.getByText('الهوية المتصرفة: مصطفى فارس', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'التبديل إلى ليان فارس' })).toBeVisible();
  await expect(page.getByText('نور فارس', { exact: true })).toHaveCount(0);
  await expect(page.getByText('مها فارس', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/التبديل يغيّر ما يظهر لك فقط؛ لا ينشئ صلاحية ولا يوسّعها/)).toBeVisible();
});

test('context selection helper grants nothing and rejects unresolved or wrong-direction grants', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const context = selectRepresentationContext(activeHeldGrant, 'مصطفى فارس');
  expect(context?.subjectPatientName).toBe('ليان فارس');
  expect(context?.actingGuardianName).toBe('مصطفى فارس');
  expect(selectRepresentationContext(activeGivenGrant, 'مصطفى فارس')).toBeUndefined();
  expect(selectRepresentationContext({ ...unresolvedScopeGrant, direction: 'HELD' }, 'مصطفى فارس')).toBeUndefined();
});

test('FLOW-IDENTITY-003 switches display context while preserving guardian attribution', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-flow-identity-003-representation-context--default');
  await page.getByRole('button', { name: 'التبديل إلى ليان فارس' }).click();
  await expect(page.getByText('سجل المريض: ليان فارس', { exact: true })).toBeVisible();
  await expect(page.getByText(/يتصرف الآن: مصطفى فارس بموجب صلاحية تمثيل فعّالة/)).toBeVisible();
  await expect(page.getByText('التبديل لم ينشئ صلاحية جديدة.', { exact: true })).toBeVisible();
});

test('dependent representation is explicitly a verification request and never self-authorizes the guardian', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--ready-for-verification');

  await expect(page.getByText('هذه ليست شاشة إنشاء صلاحية.', { exact: true })).toBeVisible();
  await expect(page.getByText(/المراجع البشري هو من يقرر/)).toBeVisible();
  await expect(page.getByText('لن ينشئ زر الإرسال صلاحية الآن.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال طلب التحقق' })).toBeEnabled();
});

test('scanning evidence cannot satisfy a dependent representation request', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-scanning');

  await expect(page.getByText('جارٍ الفحص', { exact: true })).toBeVisible();
  await expect(page.getByText(/الملف قيد الفحص ولا يحقق المتطلب قبل القبول/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال طلب التحقق' })).toBeDisabled();
});

test('retryable dependent-evidence transfer remains a transport failure rather than a rejection', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-retryable-failure');

  await expect(page.getByText('تعذّر الرفع — أعد المحاولة', { exact: true })).toBeVisible();
  await expect(page.getByText('الملف لم يُرفض.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استئناف الرفع' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toHaveCount(0);
});

test('authoritative dependent-evidence rejection offers replacement and no transport resume', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-rejected');

  await expect(page.getByText('مرفوض — يلزم استبدال الملف', { exact: true })).toBeVisible();
  await expect(page.getByText(/المستند الحالي لا يوضح العلاقة أو الأساس القانوني المطلوب للتحقق/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استئناف الرفع' })).toHaveCount(0);
});

test('submitted dependent request states that no grant exists yet', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--submitted');

  await expect(page.getByText('قيد التحقق', { exact: true })).toBeVisible();
  await expect(page.getByText('لم تُنشأ صلاحية بعد.', { exact: true })).toBeVisible();
  await expect(page.getByText(/الطلب بانتظار تحقق بشري/)).toBeVisible();
  await expect(page.getByRole('button', { name: /إرسال طلب التحقق|إعادة إرسال طلب التحقق/ })).toHaveCount(0);
});

test('consent-grant projection enforces complete explicit scope and idempotency', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = {
    subjectPatientName: 'مصطفى فارس',
    granteeName: 'ريم فارس',
    actions: [representationActionOptions[0].label],
    dataScope: [representationDataScopeOptions[0].label],
    purpose: 'متابعة المواعيد أثناء السفر.',
    effectiveFromIso: '2026-09-07T09:00:00+03:00',
    periodMode: 'BOUNDED' as const,
    effectiveUntilIso: '2026-10-07T23:59:59+03:00',
    legalOrGrantBasis: 'موافقة مباشرة من المريض',
  };
  const key = 'consent-grant-idempotency';
  const first = createConsentGrant(draft, { idempotencyKey: key, actorIsGrantor: true });
  expect(first.blockedBy).toBeUndefined();
  expect(first.grant?.status).toBe('ACCEPTED');

  const retry = createConsentGrant(draft, { idempotencyKey: key, actorIsGrantor: true, existingGrant: first.grant });
  expect(retry.reused).toBe(true);
  expect(retry.grant?.id).toBe(first.grant?.id);

  const conflict = createConsentGrant({ ...draft, purpose: 'غرض مادي مختلف.' }, {
    idempotencyKey: key,
    actorIsGrantor: true,
    existingGrant: first.grant,
  });
  expect(conflict.blockedBy).toBe('IDEMPOTENCY_CONFLICT');

  expect(createConsentGrant({ ...draft, actions: [] }, { idempotencyKey: 'missing-scope', actorIsGrantor: true }).blockedBy).toBe('INVALID_SCOPE');
  expect(createConsentGrant(draft, { idempotencyKey: 'not-grantor', actorIsGrantor: false }).blockedBy).toBe('NOT_AUTHORIZED_GRANTOR');
});

test('dependent request projection accepts only governed accepted evidence and creates SUBMITTED only', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = {
    subjectIdentification: 'ليان فارس — مواليد 2014',
    relationship: 'ولي أمر',
    legalBasis: 'أساس يحتاج تحققًا بشريًا.',
    requestedActions: [representationActionOptions[0].label],
    requestedDataScope: [representationDataScopeOptions[0].label],
    purpose: 'متابعة الرعاية.',
    evidenceIds: acceptedDependentEvidenceIds(defaultDependentEvidenceRequirements),
  };
  const key = 'dependent-request-idempotency';
  const first = submitDependentRepresentationRequest(draft, defaultDependentEvidenceRequirements, { idempotencyKey: key });
  expect(first.blockedBy).toBeUndefined();
  expect(first.request?.state).toBe('SUBMITTED');
  expect('grant' in (first as object)).toBe(false);

  const retry = submitDependentRepresentationRequest(draft, defaultDependentEvidenceRequirements, {
    idempotencyKey: key,
    existingRequest: first.request,
  });
  expect(retry.reused).toBe(true);

  const scanningDraft = {
    ...draft,
    evidenceIds: acceptedDependentEvidenceIds(scanningDependentEvidenceRequirements),
  };
  expect(submitDependentRepresentationRequest(scanningDraft, scanningDependentEvidenceRequirements, {
    idempotencyKey: 'scanning',
  }).blockedBy).toBe('EVIDENCE_INCOMPLETE');

  const retryableDraft = {
    ...draft,
    evidenceIds: acceptedDependentEvidenceIds(retryableDependentEvidenceRequirements),
  };
  expect(submitDependentRepresentationRequest(retryableDraft, retryableDependentEvidenceRequirements, {
    idempotencyKey: 'retryable',
  }).blockedBy).toBe('EVIDENCE_INCOMPLETE');
});

test('FLOW-IDENTITY-002-004 creates then revokes one grant while retaining it in history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-identity-002-004-representation-grant--default');
  await page.getByRole('button', { name: 'منح صلاحية لشخص آخر' }).click();
  await page.getByRole('button', { name: 'إنشاء الصلاحية بهذا النطاق' }).click();
  await expect(page.getByText('ريم فارس', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'إلغاء هذه الصلاحية' }).click();
  await page.getByRole('button', { name: 'تأكيد إلغاء الصلاحية الآن' }).click();
  await expect(page.getByText('السجل السابق', { exact: true })).toBeVisible();
  await expect(page.getByText('ريم فارس', { exact: true })).toBeVisible();
});

test('FLOW-IDENTITY-021 submits a verification request without creating a patient grant', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-flow-identity-021-dependent-representation--default');
  await page.getByRole('button', { name: 'إرسال طلب التحقق' }).click();
  await expect(page.getByText('لم تُنشأ صلاحية بعد.', { exact: true })).toBeVisible();
  await expect(page.getByText('قيد التحقق', { exact: true })).toBeVisible();
});
