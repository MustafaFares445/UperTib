import { expect, test, type Page, type TestInfo } from '@playwright/test';

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

test('WP-UX-06 ready consent grant summarizes completed steps while the full scope review stays visible', async ({ page }, testInfo) => {
  const id = 'patient-screens-scr-identity-006-create-grant--ready';
  await gotoStory(page, id);
  await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);

  const editGrantee = page.getByRole('button', { name: 'تعديل 1. من سيحصل على الصلاحية؟' });
  const editActions = page.getByRole('button', { name: 'تعديل 2. ما الذي يستطيع فعله؟' });
  const editData = page.getByRole('button', { name: 'تعديل 3. ما المعلومات التي يستطيع الوصول إليها؟' });
  const editPurpose = page.getByRole('button', { name: 'تعديل 4. لماذا؟ وإلى متى؟' });
  const review = page.getByLabel('مراجعة النطاق قبل إنشاء الصلاحية');
  const create = page.getByRole('button', { name: 'إنشاء الصلاحية بهذا النطاق' });

  for (const edit of [editGrantee, editActions, editData, editPurpose]) {
    await expect(edit).toBeVisible();
    await expect(edit).toHaveAttribute('aria-expanded', 'false');
  }

  await expect(page.getByRole('textbox', { name: 'الشخص الذي ستمنحه الصلاحية' })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'الغرض' })).toHaveCount(0);
  await expect(review).toBeVisible();
  await expect(review.getByText('ريم فارس', { exact: true })).toBeVisible();
  await expect(review.getByText('المساعدة في متابعة المواعيد والخطة العلاجية أثناء السفر.', { exact: true })).toBeVisible();
  await expect(review.getByText('الأساس: موافقة مباشرة من المريض', { exact: true })).toBeVisible();
  await expect(create).toBeEnabled();
});

test('consent-grant edit action reopens one completed step without hiding the final controlling review', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-006-create-grant--ready');

  const review = page.getByLabel('مراجعة النطاق قبل إنشاء الصلاحية');
  await page.getByRole('button', { name: 'تعديل 1. من سيحصل على الصلاحية؟' }).click();

  await expect(page.getByRole('button', { name: 'إنهاء تعديل 1. من سيحصل على الصلاحية؟' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('textbox', { name: 'الشخص الذي ستمنحه الصلاحية' })).toHaveValue('ريم فارس');
  await expect(review).toBeVisible();
  await expect(page.getByRole('button', { name: 'إنشاء الصلاحية بهذا النطاق' })).toBeEnabled();
});

test('WP-UX-06 dependent request summarizes completed identity and scope while evidence and final review remain current', async ({ page }, testInfo) => {
  const id = 'patient-screens-scr-identity-037-add-dependent--ready-for-verification';
  await gotoStory(page, id);
  await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);

  const editIdentity = page.getByRole('button', { name: 'تعديل 1. من هو التابع وما علاقتك به؟' });
  const editScope = page.getByRole('button', { name: 'تعديل 2. ما النطاق الذي تطلبه؟' });
  const evidenceDisclosure = page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' });
  const review = page.getByLabel('مراجعة نطاق طلب تمثيل التابع قبل الإرسال');
  const submit = page.getByRole('button', { name: 'إرسال طلب التحقق' });

  await expect(editIdentity).toHaveAttribute('aria-expanded', 'false');
  await expect(editScope).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('textbox', { name: 'بيانات تعريف التابع' })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'الغرض من التمثيل' })).toHaveCount(0);
  await expect(evidenceDisclosure).toBeVisible();
  await expect(evidenceDisclosure).toHaveAttribute('aria-expanded', 'false');

  await expect(review).toBeVisible();
  await expect(review.getByText('ليان فارس — مواليد 2014', { exact: true })).toBeVisible();
  await expect(review.getByText('العلاقة: ولي أمر', { exact: true })).toBeVisible();
  await expect(review.getByText('طلب تمثيل تابع يحتاج تحققًا بشريًا من العلاقة والأساس.', { exact: true })).toBeVisible();
  await expect(review.getByText('متابعة المواعيد والخطة العلاجية للتابع ضمن النطاق المعتمد.', { exact: true })).toBeVisible();
  await expect(review.getByText(/الإرسال ينشئ طلب تحقق فقط/)).toBeVisible();
  await expect(submit).toBeEnabled();
});

test('dependent scope edit reopens choices while rejected evidence remains expanded and blocks submission', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-rejected');

  await expect(page.getByRole('button', { name: 'تعديل 1. من هو التابع وما علاقتك به؟' })).toBeVisible();
  const editScope = page.getByRole('button', { name: 'تعديل 2. ما النطاق الذي تطلبه؟' });
  await editScope.click();
  await expect(page.getByRole('button', { name: 'إنهاء تعديل 2. ما النطاق الذي تطلبه؟' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('textbox', { name: 'الغرض من التمثيل' })).toBeVisible();

  await expect(page.getByText('مرفوض — يلزم استبدال الملف', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toBeVisible();
  await expect(page.getByLabel('مراجعة نطاق طلب تمثيل التابع قبل الإرسال')).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال طلب التحقق' })).toBeDisabled();
});
