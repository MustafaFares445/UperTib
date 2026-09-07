import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  appealableProtectionDecisionClaim,
  defaultClaimAppealDraft,
  expiredClaimAppealDecision,
  policyIneligibleClaimDecision,
  submitClaimAppeal,
  submittedClaimAppeal,
  unreadClaimDecision,
} from '../src/mocks/claimAppeals';
import {
  acceptedProtectionEvidenceIds,
  defaultProtectionEntitlement,
  expiredProtectionEntitlement,
  retryableProtectionEntitlement,
  scanningProtectionEntitlement,
  submitProtectionClaim,
  unavailableProtectionEntitlement,
} from '../src/mocks/protectionClaims';

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
  'patient-screens-scr-claims-003-protection-claim--default',
  'patient-screens-scr-claims-003-protection-claim--evidence-retryable-failure',
  'patient-screens-scr-claims-003-protection-claim--evidence-rejected',
  'patient-screens-scr-claims-003-protection-claim--evidence-scanning',
  'patient-screens-scr-claims-005-claim-appeal--default',
  'patient-screens-scr-claims-005-claim-appeal--window-expired',
  'patient-screens-scr-claims-005-claim-appeal--submitted',
  'patient-screens-scr-claims-005-claim-appeal--decided',
];

test.describe('Slice 11 claims surfaces remain RTL, readable and reflow-safe', () => {
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

test('protection claim states the accepted protection and conditional boundary before authoring', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-003-protection-claim--default');

  await expect(page.getByText('الحماية الفعّالة في الشروط المقبولة', { exact: true })).toBeVisible();
  await expect(page.getByText('حماية متابعة مرتبطة بالخطة المقبولة', { exact: true })).toBeVisible();
  await expect(page.getByText(/الحماية مشروطة وليست تأمينًا أو تعويضًا مضمونًا/)).toBeVisible();
  await expect(page.getByText('حالة ضمن الحماية المسجلة', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تقديم مطالبة الحماية' })).toBeVisible();
});

test('retryable transfer failure is not an authoritative rejection and preserves the same evidence item', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-003-protection-claim--evidence-retryable-failure');

  await expect(page.getByText('تعذّر الرفع — أعد المحاولة', { exact: true })).toBeVisible();
  await expect(page.getByText('الملف لم يُرفض.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استئناف الرفع' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'تقديم مطالبة الحماية' })).toHaveCount(0);
});

test('authoritative evidence rejection exposes replacement rather than transport retry', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-003-protection-claim--evidence-rejected');

  await expect(page.getByText('مرفوض — يلزم استبدال الملف', { exact: true })).toBeVisible();
  await expect(page.getByText('المستند المرسل لا يوضح الواقعة المطلوبة لهذا المتطلب.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استئناف الرفع' })).toHaveCount(0);
});

test('evidence still being scanned never satisfies a protection-claim requirement', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-003-protection-claim--evidence-scanning');

  await expect(page.getByText('جارٍ الفحص', { exact: true })).toBeVisible();
  await expect(page.getByText(/الملف قيد الفحص ولم يُقبل بعد/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'تقديم مطالبة الحماية' })).toHaveCount(0);
});

test('protection entry is structurally unavailable when accepted terms contain no active protection', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-flow-claims-002-protection-claim--entry-blocked-without-protection');

  await expect(page.getByRole('button', { name: 'مطالبة حماية جديدة' })).toHaveCount(0);
  await expect(page.getByText(/لا تظهر مطالبة الحماية لأن الشروط المقبولة لهذه الحالة لا تحتوي حماية فعّالة/)).toBeVisible();
});

test('protection projection enforces historical entitlement, accepted evidence and idempotency', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = {
    requestedRemedy: 'مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة.',
    narrative: 'ظهرت حاجة إلى متابعة إضافية بعد الزيارة المسجلة.',
    evidenceIds: acceptedProtectionEvidenceIds(defaultProtectionEntitlement),
  };
  const key = 'protection-idempotency-test';

  const first = submitProtectionClaim(defaultProtectionEntitlement, draft, { idempotencyKey: key });
  expect(first.blockedBy).toBeUndefined();
  expect(first.claim?.state).toBe('SUBMITTED');
  expect(first.claim?.requestedAmount).toBeUndefined();
  expect(first.claim?.currency).toBeUndefined();

  const afterWindow = submitProtectionClaim(defaultProtectionEntitlement, draft, {
    idempotencyKey: key,
    existingClaim: first.claim,
    nowIso: '2026-09-14T08:00:00+03:00',
  });
  expect(afterWindow.reused).toBe(true);
  expect(afterWindow.claim?.id).toBe(first.claim?.id);

  const differentPayload = submitProtectionClaim(defaultProtectionEntitlement, {
    ...draft,
    narrative: `${draft.narrative} تغيير مادي.`,
  }, {
    idempotencyKey: key,
    existingClaim: first.claim,
  });
  expect(differentPayload.blockedBy).toBe('IDEMPOTENCY_CONFLICT');

  expect(submitProtectionClaim(unavailableProtectionEntitlement, draft, {
    idempotencyKey: 'no-entitlement',
  }).blockedBy).toBe('ENTITLEMENT_UNAVAILABLE');

  expect(submitProtectionClaim(expiredProtectionEntitlement, draft, {
    idempotencyKey: 'expired-window',
  }).blockedBy).toBe('WINDOW_EXPIRED');

  expect(submitProtectionClaim(scanningProtectionEntitlement, {
    ...draft,
    evidenceIds: acceptedProtectionEvidenceIds(scanningProtectionEntitlement),
  }, {
    idempotencyKey: 'scanning-evidence',
  }).blockedBy).toBe('EVIDENCE_INCOMPLETE');

  expect(submitProtectionClaim(retryableProtectionEntitlement, {
    ...draft,
    evidenceIds: acceptedProtectionEvidenceIds(retryableProtectionEntitlement),
  }, {
    idempotencyKey: 'retryable-evidence',
  }).blockedBy).toBe('EVIDENCE_INCOMPLETE');
});

test('claim appeal shows original decision and historical policy snapshot before the grounds field', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-005-claim-appeal--default');

  const decision = page.getByText('القرار الأصلي — يبقى محفوظًا', { exact: true });
  const snapshot = page.getByText('لقطة السياسة الحاكمة للاعتراض', { exact: true });
  const grounds = page.getByRole('textbox', { name: 'أساس الاعتراض' });
  await expect(decision).toBeVisible();
  await expect(snapshot).toBeVisible();
  await expect(grounds).toBeVisible();
  const [decisionBox, snapshotBox, groundsBox] = await Promise.all([decision.boundingBox(), snapshot.boundingBox(), grounds.boundingBox()]);
  expect(decisionBox?.y).toBeLessThan(snapshotBox?.y ?? Number.POSITIVE_INFINITY);
  expect(snapshotBox?.y).toBeLessThan(groundsBox?.y ?? Number.POSITIVE_INFINITY);
});

test('expired claim-appeal window is not retryable and withholds authoring', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-005-claim-appeal--window-expired');

  await expect(page.getByText('انتهت مهلة الاعتراض.', { exact: true })).toBeVisible();
  await expect(page.getByText(/لا تُعامل كفشل قابل لإعادة المحاولة/)).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'أساس الاعتراض' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /تقديم الاعتراض|إعادة إرسال الاعتراض/ })).toHaveCount(0);
});

test('claim appeal uses existing evidence references without introducing another generic upload surface', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-005-claim-appeal--with-supporting-evidence');

  await expect(page.getByText('المستند الداعم المقبول في المطالبة الأصلية', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /رفع|إضافة ملف|تحميل ملف/ })).toHaveCount(0);
});

test('claim appeal projection is append-only, policy-aware and idempotent across the deadline edge', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const key = 'claim-appeal-idempotency';
  const beforeDecision = structuredClone(appealableProtectionDecisionClaim.decision);

  const first = submitClaimAppeal(appealableProtectionDecisionClaim, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: key,
  });
  expect(first.blockedBy).toBeUndefined();
  expect(first.appeal?.state).toBe('SUBMITTED');
  expect(first.claim.decision).toEqual(beforeDecision);

  const retryAfterWindow = submitClaimAppeal(appealableProtectionDecisionClaim, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: key,
    existingAppeal: first.appeal,
    nowIso: '2026-09-13T08:00:00+03:00',
  });
  expect(retryAfterWindow.reused).toBe(true);
  expect(retryAfterWindow.appeal?.id).toBe(first.appeal?.id);

  const conflict = submitClaimAppeal(appealableProtectionDecisionClaim, {
    ...defaultClaimAppealDraft,
    grounds: `${defaultClaimAppealDraft.grounds} سبب مختلف ماديًا.`,
  }, {
    actorAuthorized: true,
    idempotencyKey: key,
    existingAppeal: first.appeal,
  });
  expect(conflict.blockedBy).toBe('IDEMPOTENCY_CONFLICT');

  expect(submitClaimAppeal(expiredClaimAppealDecision, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'expired',
  }).blockedBy).toBe('WINDOW_EXPIRED');

  expect(submitClaimAppeal(policyIneligibleClaimDecision, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'policy-ineligible',
  }).blockedBy).toBe('POLICY_INELIGIBLE');

  expect(submitClaimAppeal(appealableProtectionDecisionClaim, defaultClaimAppealDraft, {
    actorAuthorized: false,
    idempotencyKey: 'unauthorized',
  }).blockedBy).toBe('NOT_AUTHORIZED');

  expect(submitClaimAppeal(unreadClaimDecision, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'unread',
  }).blockedBy).toBe('DECISION_UNAVAILABLE');

  expect(submitClaimAppeal(appealableProtectionDecisionClaim, defaultClaimAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'projection-duplicate',
    projectionAppeal: submittedClaimAppeal,
  }).blockedBy).toBe('ACTIVE_APPEAL_EXISTS');
});

test('FLOW-CLAIMS-002 creates one protection claim only after entitlement and evidence gates', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-claims-002-protection-claim--default');

  await page.getByRole('button', { name: 'مطالبة حماية جديدة' }).click();
  await expect(page.getByText('ابدأ من الحماية المسجّلة، لا من وعد عام', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تقديم مطالبة الحماية' }).click();
  await expect(page.getByText('أين وصل هذا الطلب؟', { exact: true })).toBeVisible();
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByText(/المعالجة المطلوبة: مراجعة الحاجة إلى متابعة إضافية/)).toBeVisible();
});

test('FLOW-CLAIMS-007 submits one appeal and returns to detail with original decision intact', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-claims-007-claim-appeal--default');

  const originalReason = 'لم تُقبل المطالبة لأن الوقائع المسجلة لم تحقق شرط النطاق في لقطة السياسة التي حكمت القرار.';
  await expect(page.getByText(originalReason, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'الاعتراض على القرار' }).click();
  await expect(page.getByText('اعترض على القرار نفسه دون محو تاريخه', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تقديم الاعتراض' }).click();

  await expect(page.getByText('الاعتراض المسجّل', { exact: true })).toBeVisible();
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByText(originalReason, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'الاعتراض على القرار' })).toHaveCount(0);
});
