import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  defaultAppealDraft,
  retiredReviewWithExpiredAppealWindow,
  retiredReviewWithSubmittedAppeal,
  retiredReviewWithoutReadableDecision,
  submitReviewAppeal,
  submittedReviewAppeal,
} from '../src/mocks/reviewAppeals';
import { retiredNoAppealReview, retiredPatientReview } from '../src/mocks/reviews';

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
  'patient-screens-scr-reviews-004-review-appeal--default',
  'patient-screens-scr-reviews-004-review-appeal--retryable-failure',
  'patient-screens-scr-reviews-004-review-appeal--window-expired',
  'patient-screens-scr-reviews-004-review-appeal--not-authorized',
  'patient-screens-scr-reviews-004-review-appeal--decision-unavailable',
  'patient-screens-scr-reviews-004-review-appeal--submitted',
  'patient-screens-scr-reviews-004-review-appeal--decided',
];

test.describe('Slice 9 review-appeal surfaces remain RTL, readable and reflow-safe', () => {
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

test('appeal scope and original decision are read before the patient reaches the grounds field', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--default');

  const decision = page.getByText('القرار الذي تعترض عليه', { exact: true });
  const scope = page.getByText('ما الذي يمكن لهذا الاعتراض مراجعته؟', { exact: true });
  const grounds = page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' });

  await expect(decision).toBeVisible();
  await expect(scope).toBeVisible();
  await expect(grounds).toBeVisible();
  const [decisionBox, scopeBox, groundsBox] = await Promise.all([decision.boundingBox(), scope.boundingBox(), grounds.boundingBox()]);
  expect(decisionBox?.y).toBeLessThan(scopeBox?.y ?? Number.POSITIVE_INFINITY);
  expect(scopeBox?.y).toBeLessThan(groundsBox?.y ?? Number.POSITIVE_INFINITY);
});

test('appeal explicitly names the three contestable bases and excludes editing the rating or review text', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--default');

  await expect(page.getByText('الأهلية', { exact: true })).toBeVisible();
  await expect(page.getByText('التحقق', { exact: true })).toBeVisible();
  await expect(page.getByText('الالتزام بالسياسة', { exact: true })).toBeVisible();
  await expect(page.getByText('لا يغيّر قيمة التقييم أو نصه', { exact: true })).toBeVisible();
  await expect(page.getByText('يصدر القرار من مراجع نزاهة مستقل لم يتخذ القرار الأصلي.', { exact: true })).toBeVisible();
});

test('expired appeal window removes the authoring form and submit action instead of failing after effort', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--window-expired');

  await expect(page.getByText('انتهت مهلة تقديم هذا الاعتراض.', { exact: true })).toBeVisible();
  await expect(page.getByText('انتهت المهلة', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /تقديم الاعتراض|إعادة إرسال الاعتراض/ })).toHaveCount(0);
});

test('unauthorized actor gets an explicit recovery state with no stale commit affordance', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--not-authorized');

  await expect(page.getByText('لا تملك صلاحية تقديم هذا الاعتراض.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /تقديم الاعتراض/ })).toHaveCount(0);
});

test('policy without patient appeal structurally withholds the form', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--policy-no-appeal');

  await expect(page.getByText('لا يتضمن هذا القرار حق اعتراض من حسابك.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /تقديم الاعتراض/ })).toHaveCount(0);
});

test('unread original decision withholds the appeal form and offers decision recovery', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--decision-unavailable');

  await expect(page.getByText('لا يمكن بدء الاعتراض قبل عرض القرار.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة تحميل القرار' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /تقديم الاعتراض/ })).toHaveCount(0);
});

test('retryable submit failure preserves the grounds and reuses the submission intent', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--retryable-failure');

  await expect(page.getByText('تعذّر تأكيد إرسال الاعتراض.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'اشرح سبب الاعتراض' })).toHaveValue(defaultAppealDraft.grounds);
  await expect(page.getByText(/تستخدم محاولة الإرسال نفسها بدل إنشاء اعتراض جديد/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة إرسال الاعتراض' })).toBeVisible();
});

test('supporting evidence is optional and does not invent a second generic upload surface', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--with-supporting-evidence');

  await expect(page.getByText('نسخة من الإشعار المرتبط بقرار الأرشفة', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /رفع|إضافة ملف|تحميل ملف/ })).toHaveCount(0);
});

test('submitted and decided appeal states remain separate and outcome meaning lives in the recorded reason', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--submitted');
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByText(/بانتظار قرار مراجع نزاهة مستقل/)).toBeVisible();
  await expect(page.getByRole('button', { name: /تقديم الاعتراض/ })).toHaveCount(0);

  await gotoStory(page, 'patient-screens-scr-reviews-004-review-appeal--decided');
  await expect(page.getByText('صدر القرار', { exact: true })).toBeVisible();
  await expect(page.getByText('سبب القرار', { exact: true })).toBeVisible();
  await expect(page.getByText(/ثبت أن قرار الأرشفة يطابق سياسة النشر/)).toBeVisible();
  await expect(page.getByText('مراجع نزاهة مستقل', { exact: false })).toBeVisible();
});

test('appeal projection is append-only and preserves the original review decision and content', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const before = {
    state: retiredPatientReview.state,
    ratingValue: retiredPatientReview.ratingValue,
    content: retiredPatientReview.content,
    retirement: retiredPatientReview.retirement,
  };

  const result = submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'appeal-test-key-1',
  });

  expect(result.blockedBy).toBeUndefined();
  expect(result.appeal?.state).toBe('SUBMITTED');
  expect(result.review.state).toBe(before.state);
  expect(result.review.ratingValue).toBe(before.ratingValue);
  expect(result.review.content).toBe(before.content);
  expect(result.review.retirement).toEqual(before.retirement);
});

test('appeal idempotency reuses identical retry and rejects materially different payload on the same key', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const key = 'appeal-idempotency-key';
  const first = submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: key,
  });
  expect(first.appeal).toBeDefined();

  const retry = submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: key,
    existingAppeal: first.appeal,
  });
  expect(retry.reused).toBe(true);
  expect(retry.appeal?.id).toBe(first.appeal?.id);

  const conflict = submitReviewAppeal(retiredPatientReview, {
    ...defaultAppealDraft,
    grounds: `${defaultAppealDraft.grounds} سبب مختلف ماديًا.`,
  }, {
    actorAuthorized: true,
    idempotencyKey: key,
    existingAppeal: first.appeal,
  });
  expect(conflict.blockedBy).toBe('IDEMPOTENCY_CONFLICT');

  const secondIntent = submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'different-key',
    existingAppeal: first.appeal,
  });
  expect(secondIntent.blockedBy).toBe('ACTIVE_APPEAL_EXISTS');
});

test('appeal projection enforces decision visibility, authorization, window and existing-appeal uniqueness', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  expect(submitReviewAppeal(retiredReviewWithoutReadableDecision, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'missing-decision',
  }).blockedBy).toBe('DECISION_UNAVAILABLE');

  expect(submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: false,
    idempotencyKey: 'unauthorized',
  }).blockedBy).toBe('NOT_AUTHORIZED');

  expect(submitReviewAppeal(retiredNoAppealReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'policy-no-appeal',
  }).blockedBy).toBe('NOT_AUTHORIZED');

  expect(submitReviewAppeal(retiredReviewWithExpiredAppealWindow, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'expired',
  }).blockedBy).toBe('WINDOW_EXPIRED');

  expect(submitReviewAppeal(retiredReviewWithSubmittedAppeal, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: 'second-appeal',
  }).blockedBy).toBe('ACTIVE_APPEAL_EXISTS');

  const retryFromRecord = submitReviewAppeal(retiredPatientReview, defaultAppealDraft, {
    actorAuthorized: true,
    idempotencyKey: submittedReviewAppeal.idempotencyKey,
    existingAppeal: submittedReviewAppeal,
  });
  expect(retryFromRecord.reused).toBe(true);
});

test('FLOW-REVIEWS-006 submits one appeal then returns to immutable review history without a second appeal action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-reviews-006-review-appeal--default');

  await page.getByRole('button', { name: 'الاعتراض على قرار الأرشفة' }).click();
  await expect(page.getByText('راجع نطاق الاعتراض قبل أن تكتب', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تقديم الاعتراض' }).click();
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /تقديم الاعتراض/ })).toHaveCount(0);

  await page.getByRole('button', { name: 'العودة إلى تقييمي' }).click();
  await expect(page.getByText('الاعتراض المسجّل', { exact: true })).toBeVisible();
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'الاعتراض على قرار الأرشفة' })).toHaveCount(0);
});
