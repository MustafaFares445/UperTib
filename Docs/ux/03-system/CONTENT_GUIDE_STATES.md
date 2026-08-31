# UberTib Content Guide — Lifecycle Status Copy

**Phase:** 3 — Design System, Session 4 (Content)
**Owns:** the Arabic chip label and the required per-audience meaning for every lifecycle status in
every machine. **Does not own:** the tone/icon/emphasis triple, which `design_tokens/semantic.state.json`
already fixes — this file names that token by key and never restates or contradicts it. Does not own
the canonical `ERR-*` message — see `CONTENT_GUIDE_ERRORS.md`.

**Scope measured, not estimated:** 18 lifecycle machines, 82 statuses, matching
`INFORMATION_ARCHITECTURE.md` section 10.16's lifecycle sweep exactly. Sixteen of the eighteen carry
full transition tables in `docs/domain/STATE_MACHINES.md`; the remaining two —
**onboarding application** and **staff invitation and grant** — are defined in
`docs/domain/STAFF_INTERACTION_CONTRACTS.md` (`SDC-IDENTITY-001`, `SDC-IDENTITY-003`) and in the
per-screen `Lifecycle statuses shown` fields of `INFORMATION_ARCHITECTURE.md`. This was verified by a
fresh count against both sources before writing a single label, because building 18 copy families on
top of an unverified count would have been exactly the kind of measurement error section 12.1 of the
implementation plan warns against. 6 + 4 + 4 + 8 + 5 + 4 + 3 + 3 + 2 + 2 + 5 + 3 + 6 + 5 + 3 + 6 + 5 + 8
= 82.

**Format per machine:** source, which audiences see it at all, the token owner key, then one row per
status carrying the chip label, the token triple by name, and the meaning per audience — collapsed to
one cell where the meaning does not differ, split into three where it must. A **Notes** column carries
the prohibition or obligation that would otherwise have to be remembered separately.

**Standing rules that bind every row in this file, not repeated per row:**

- No chip label is ever a bare enumeration value. `PENDING_EVALUATION` is not rendered as
  `PENDING_EVALUATION`; it is rendered as its Arabic label.
- No chip label or meaning may abbreviate a status to a single Latin letter. `F`, `S`, `P`, `H`, `I`
  and `R` never appear as, or inside, a status label — copy obligation 6 and `docs/README.md`'s
  glossary entries for Scientific Grade, Pricing Class, Protection Level and Risk Profile.
- Where a meaning differs from what the raw status name would suggest if translated literally, this
  file states the correct meaning; it does not translate the enum.
- A flag (`escalated`, `overdue`) is never worded as if it were a status. It is additive: "still
  `IN_PROGRESS`, and also escalated," never a replacement label.
- Every status here traces to `CMP-PLATFORM-001` (State chip) and, where the surface is a detail or
  dashboard archetype, `CMP-PLATFORM-002` (State summary), which additionally requires the controlling
  reason, the assessment time and the available action alongside the chip.

---

## TXT-STATE-IDENTITY-001 — Onboarding application

**Source:** `SDC-IDENTITY-001`, `SDC-IDENTITY-002`; `INFORMATION_ARCHITECTURE.md` §10.16 row
"Onboarding application" (6 statuses).
**Audiences:** the applicant (prospective clinic/provider) and the authorized Admin reviewer. **Not a
Patient surface**, in any variant, at any disclosure level.
**Token owner:** `semantic.state.json` → `state.onboarding-application`.

| Status | Chip label | Triple | Applicant meaning | Admin reviewer meaning | Notes |
|---|---|---|---|---|---|
| `DRAFT` | مسودة | `neutral` / `pencil-square` / `muted` | الطلب لم يُرسل بعد؛ يمكن متابعة تعبئته والحفظ كمسودة والعودة إليه لاحقًا. | لا يظهر هذا الطلب على قائمة المراجعين لأنه لم يُقدَّم بعد. | مسودة لا تُنشئ سجل تقديم؛ `IX-PLATFORM-005`. |
| `SUBMITTED` | بانتظار المراجعة | `info` / `inbox-arrow-down` / `subtle` | تم استلام الطلب وهو بانتظار مراجعة الفريق المخوَّل. | طلب جديد وارد بحاجة إلى تعيين مراجع. | — |
| `CHANGES_REQUESTED` | مطلوب تعديل | `warning` / `arrow-uturn-left` / `solid` | الطلب يحتاج إلى تعديلات محددة قبل المتابعة؛ راجع الملاحظات المرفقة لكل حقل. | تم إرسال طلب تعديل مُفصَّل إلى مقدّم الطلب. | التعديل مطلوب على حقول محددة، لا رفضًا كليًا؛ الملاحظات مبنية على عنصر (item-level)، ليست حكمًا عامًا. |
| `RESUBMITTED` | أُعيد الإرسال | `info` / `arrow-path` / `subtle` | تم إرسال النسخة المعدَّلة وهي بانتظار المراجعة من جديد. | وردت نسخة معدَّلة من مقدّم الطلب استجابةً لملاحظات سابقة. | — |
| `APPROVED` | تمت الموافقة | `success` / `check-badge` / `subtle` | تمت الموافقة على طلب الانضمام؛ تم إنشاء حساب العيادة والصلاحيات المرتبطة به. | الطلب معتمد؛ نُفِّذت خطوات الإنشاء المرتبطة به تلقائيًا (منظمة العيادة، الهوية، الفرع الأساسي، صلاحية ممثل مقدّم الخدمة). | الموافقة لا تفعِّل الخدمات ولا تحدد الدرجة العلمية ولا تضع قيم `P`/`H`/`I` مباشرة — `SDC-IDENTITY-002`. |
| `REJECTED` | مرفوض | `danger` / `x-circle` / `subtle` | لم تتم الموافقة على هذا الطلب. | الطلب مرفوض نهائيًا لهذه المحاولة؛ لا يُعاد فتحه، ويلزم تقديم طلب جديد لإعادة المحاولة. | حالة نهائية غير قابلة للتراجع عن طريق إعادة المحاولة على السجل نفسه. |

---

## TXT-STATE-IDENTITY-002 — Staff invitation and scoped grant

**Source:** `SDC-IDENTITY-003`; `INFORMATION_ARCHITECTURE.md` §10.16 row "Staff invitation and grant"
(4 statuses). Mermaid also names an internal `REPLACED` transition, which is never surfaced as its own
chip — it is absorbed into a new `PENDING` invitation and the superseded one leaves the actor-facing
list.
**Audiences:** the inviting representative and the invited staff member. **Not a Patient surface.**
**Token owner:** `semantic.state.json` → `state.staff-invitation`.

| Status | Chip label | Triple | Representative meaning | Invitee / staff meaning | Notes |
|---|---|---|---|---|---|
| `PENDING` | بانتظار القبول | `warning` / `clock` / `solid` | الدعوة أُرسلت وبانتظار قبول المدعو ضمن المهلة المحددة. | لديك دعوة بانتظار قبولها؛ تحقق من هويتك للمتابعة. | العرض يذكر النطاق الكامل المعروض — مقدّم الخدمة، الفروع، الصلاحيات، الفترة الفعّالة — قبل إتاحة القبول؛ القبول يمنح هذا النطاق بالضبط ولا شيء غيره. |
| `ACCEPTED` | فعّالة | `success` / `check-circle` / `subtle` | المدعو قبل الدعوة والصلاحية فعّالة الآن. | صلاحيتك فعّالة ضمن النطاق والفروع المحددة. | العمل السريري (كطبيب معالج) يبقى مشروطًا بتحقّق مهني منفصل وعلاقة حالة قائمة، حتى مع صلاحية فعّالة. |
| `EXPIRED` | منتهية الصلاحية | `restricted` / `stop-circle` / `outline` | انتهت مهلة هذه الدعوة ولم تُقبل؛ يلزم إرسال دعوة جديدة — لا يمكن إحياء القديمة. | انتهت صلاحية هذه الدعوة ولا يمكن قبولها الآن. | يُذكر صراحة أن دعوة جديدة هي المسار الوحيد؛ لا تُعرض كإجراء معطَّل يوحي بإمكانية تفعيله. |
| `REVOKED` | أُلغيت | `restricted` / `lock-closed` / `subtle` | تم إلغاء هذه الصلاحية اعتبارًا من تاريخ الإلغاء. | لم تعد هذه الصلاحية سارية. | عند الإلغاء أثناء فتح الجلسة، ينطبق `IX-PLATFORM-007` — الإجراءات القديمة تُزال فورًا، لا تُعطَّل. |

---

## TXT-STATE-ELIG-001 — Eligibility outcome

**Source:** `docs/domain/STATE_MACHINES.md` §7 (immutable decisions). **The single most consequential
status family in the product** — it gates whether a booking may even be requested.
**Audiences:** Patient (practical meaning only), Clinic (the controlling reason via `CMP-ELIG-003`'s
`provider` variant), Admin (full governing context).
**Token owner:** `semantic.state.json` → `state.eligibility-outcome`.
**Related qualifier, not a state:** `pricing_class_state` (`FINAL`, `CALIBRATING`, `PROVISIONAL`,
`NOT_APPLICABLE`) is never rendered as if it were an eligibility status — it only ever governs whether
a starting price (`P`) is shown at all, and only on the two screens `INFORMATION_ARCHITECTURE.md`
§10.16 names.

| Status | Chip label | Triple | Patient meaning | Clinic meaning | Admin meaning | Notes |
|---|---|---|---|---|---|---|
| `PENDING_EVALUATION` | قيد التقييم | `info` / `magnifying-glass` / `subtle` | هذا الخيار قيد التقييم حاليًا؛ لا حاجة لاتخاذ أي إجراء إضافي ما لم يُطلب منك ذلك صراحة. | لم يكتمل تقييم هذا الطبيب/الفرع/الخدمة بعد. | كما في عمود العيادة، مع مرجع السجل الداخلي عند التفويض. | **هذه ليست الدرجة العلمية `F`؛ لا تُستخدم `F` بديلاً عن هذه الحالة تحت أي ظرف** — `docs/domain/STATE_MACHINES.md` §7. لا يُعرض `P`/`I`/قيم المعايرة الداخلية. |
| `ELIGIBLE` | مؤهَّل | `success` / `check-circle` / `subtle` | هذا الخيار متاح للحجز حاليًا. | متاح للحجز. | متاح للحجز. | التأهيل حقيقة لحظية تُعاد مراجعتها عند التنفيذ الفعلي — `IX-ELIG-001`؛ لا يُعرض كوعد دائم. |
| `SUSPENDED` | معلَّق مؤقتًا | `restricted` / `pause-circle` / `solid` | هذا الخيار غير متاح للحجز حاليًا. | السبب العملي المتحكم بالتعليق، بالقدر المصرَّح بإطلاع العيادة عليه. | السبب الكامل الحاكم للتعليق. | **قاعدة السلامة الحاسمة: لا يجوز لأي تجاوز إداري إتاحة حضور الموعد ما دام نطاق الأهلية `SUSPENDED`** — `docs/domain/STATE_MACHINES.md` §8.2. لا مسار واجهة يتجاوز هذه الحالة، على أي دور. |
| `NOT_ELIGIBLE` | غير مؤهَّل حاليًا | `restricted` / `no-symbol` / `subtle` | هذا الخيار غير متاح للحجز حاليًا؛ يمكن اختيار خيار آخر. | غير متاح للحجز حاليًا. | السبب الكامل الحاكم لعدم التأهيل. | لا تُصاغ كخطأ من المريض ولا كاتهام لمقدّم الخدمة — نتيجة تقييم موضوعية فقط. |

---

## TXT-STATE-BOOKING-001 — Booking

**Source:** `docs/domain/STATE_MACHINES.md` §8. **This family carries copy obligations 1 and 2 in
full — the two most-cited obligations in the whole content system.**
**Audiences:** Patient, Clinic, Admin — all three, on every surface bound to `CMP-PLATFORM-001`/`-002`.
**Token owner:** `semantic.state.json` → `state.booking`.

| Status | Chip label | Triple | Meaning (all audiences unless noted) | Notes |
|---|---|---|---|---|
| `REQUESTED` | بانتظار تأكيد العيادة | `warning` / `clock` / `subtle` | تم إرسال طلب الحجز وهو بانتظار رد العيادة ضمن المهلة المحددة. | — |
| `ALTERNATIVE_PROPOSED` | عُرض موعد بديل | `warning` / `arrows-right-left` / `solid` | اقترحت العيادة موعدًا بديلًا؛ **الموعد الأصلي يبقى هو المرجع حتى القبول أو الرفض أو انتهاء المهلة.** | `IX-BOOKING-002` — لا يُعرض كأنه استبدل الطلب الأصلي؛ يُعرض إلى جانبه. |
| `CONFIRMED` | مؤكَّد | `success` / `calendar-days` / `subtle` | الموعد مؤكَّد. | — |
| `ELIGIBILITY_REVIEW` | قيد مراجعة الأهلية | `warning` / `shield-exclamation` / `solid` | **الموعد قيد مراجعة إضافية للأهلية. هذا ليس اتهامًا ولا تعليمات بالحضور — لا حاجة لأي إجراء من طرفك حتى تنتهي المراجعة.** | **copy obligation 2.** لغة محايدة إلزامية على كل الأسطح، بما فيها لوحة العيادة. الحضور وبدء الإجراء وإتمامه تُزال هيكليًا طوال هذه الحالة — `IX-ELIG-001`. |
| `REJECTED` | مرفوض | `danger` / `x-circle` / `subtle` | لم تتم الموافقة على طلب الحجز هذا. | — |
| `CANCELLED` | لم يُؤكَّد الحجز | `restricted` / `minus-circle` / `subtle` | **يعتمد النص الدقيق على سبب الإغلاق — انظر الصفوف الفرعية أدناه. لا تُستخدم كلمة "إلغاء" مقرونة بأي عبارة غرامة أو جزاء تحت أي سبب، لأنه لا توجد أي غرامة في V1.** | **copy obligation 1 — الأهم في هذا الملف.** التون `restricted` وليس `danger` لأن ثلاثة من أسباب الإغلاق لا تحمل أي جزاء على المريض إطلاقًا؛ التون لا يجوز أن يوحي بنتيجة عقابية قد لا يدعمها السبب. |
| ↳ سبب `ALTERNATIVE_EXPIRED` | لم يُؤكَّد — انتهت مهلة الرد | (كما أعلاه) | انتهت مهلة الرد على الموعد البديل المقترح، **فلم يُؤكَّد الحجز**. لا توجد أي غرامة على ذلك. يمكن تقديم طلب حجز جديد. | يُعرض كطلب لم يُؤكَّد، لا كحجز أُلغي عقابيًا — `IX-BOOKING-001`. |
| ↳ سبب `ALTERNATIVE_DECLINED` | لم يُؤكَّد — تم رفض البديل | (كما أعلاه) | تم رفض الموعد البديل المقترح، **فلم يُؤكَّد الحجز**. يمكن تقديم طلب حجز جديد في أي وقت. | نفس المعالجة أعلاه؛ رفض البديل فعل متعمَّد من المريض ولا يُعرض كأنه خطأ. |
| ↳ أسباب أخرى | تم إلغاء الحجز | (كما أعلاه) | تم إلغاء هذا الحجز. | يُذكر الطرف الذي بادر بالإلغاء عبر `CMP-PLATFORM-013` عند توفره؛ لا تُضاف عبارة غرامة لعدم وجودها في V1. |
| `NO_SHOW` | لم يحضر | `danger` / `user-minus` / `subtle` | تم تسجيل عدم حضور المريض لهذا الموعد. | وقائعي لا اتهامي في صياغته؛ السجل يُنسب لمن أدخله عبر `CMP-PLATFORM-013`. |
| `COMPLETED` | مكتمل | `success` / `check-circle` / `subtle` | تم إتمام هذا الموعد. | — |

---

## TXT-STATE-BOOKING-002 — Reschedule proposal

**Source:** `docs/domain/STATE_MACHINES.md` §8.3; `IX-BOOKING-002`. A separate governed record from
the booking it targets — its state is never merged into the booking's own chip.
**Audiences:** Patient, Clinic, Admin.
**Token owner:** `semantic.state.json` → `state.reschedule-proposal`.

| Status | Chip label | Triple | Meaning | Notes |
|---|---|---|---|---|
| `PENDING` | بانتظار الرد | `warning` / `clock` / `solid` | هناك اقتراح لتغيير الموعد بانتظار رد الطرف الآخر ضمن مهلة محددة؛ **موعدك الحالي يبقى مؤكَّدًا حتى ذلك الحين.** | يُعرض دائمًا إلى جانب حالة الحجز `CONFIRMED`، لا بديلاً عنها. |
| `ACCEPTED` | تم القبول | `success` / `check-circle` / `subtle` | تم قبول الموعد الجديد وحلّ محل الموعد السابق بعد إعادة التحقق من الأهلية والسعة. | إعادة التحقق (`IX-ELIG-001`) جزء من عملية القبول نفسها، لا خطوة منفصلة مرئية. |
| `DECLINED` | مرفوض | `restricted` / `x-circle` / `outline` | تم رفض اقتراح تغيير الموعد؛ **الموعد الأصلي لم يتأثر.** | — |
| `EXPIRED` | منتهي المهلة | `restricted` / `stop-circle` / `outline` | انتهت مهلة الرد على اقتراح تغيير الموعد؛ **الموعد الأصلي لم يتأثر ما دام قائمًا.** | حيث كان الاقتراح هو المسار الوحيد نحو تأكيد، تُطبَّق صياغة `IX-BOOKING-001` بدل هذه. |
| `WITHDRAWN` | تم سحبه | `restricted` / `minus-circle` / `outline` | سحب مُقدِّم الاقتراح هذا الاقتراح؛ **الموعد الأصلي لم يتأثر.** | يُنسب السحب صراحة إلى الطرف الذي بادر به، لا يُعرض كتغيّر تلقائي. |

---

## TXT-STATE-CLINICAL-001 — Treatment plan and accepted terms

**Source:** `docs/domain/STATE_MACHINES.md` §9; `IX-CLINICAL-001`; `CMP-CLINICAL-002`.
**Audiences:** Patient sees `PROPOSED`/`ACCEPTED`/`EXPIRED`; Clinic sees all four including `DRAFT`;
Admin sees all four.
**Token owner:** `semantic.state.json` → `state.treatment-plan`.

| Status | Chip label | Triple | Patient meaning | Clinic / Admin meaning | Notes |
|---|---|---|---|---|---|
| `DRAFT` | مسودة | `neutral` / `pencil-square` / `muted` | **لا تُعرض هذه الحالة للمريض.** | الخطة قيد الإعداد ولم تُرسل للمريض بعد. | — |
| `PROPOSED` | مقترحة — بانتظار موافقتك | `warning` / `clock` / `solid` | هذه الخطة العلاجية مقترحة وتحتاج إلى موافقتك؛ تنتهي صلاحية الاقتراح إن لم يُرَدّ عليه خلال المهلة المحددة (سبعة أيام تقويمية افتراضيًا). | الخطة أُرسلت للمريض وبانتظار الموافقة. | القبول يتطلب اطّلاعًا على أي تغييرات جوهرية طرأت — `IX-CLINICAL-001`. |
| `ACCEPTED` | مقبولة | `success` / `document-check` / `subtle` | وافقت على هذه الخطة. **هذه هي الشروط المعتمدة الآن، وهي غير قابلة للتغيير إلا بخطة معدَّلة جديدة تُعرض عليك لاحقًا للموافقة من جديد.** | لقطة الشروط المقبولة غير قابلة للتعديل؛ أي تصحيح ينشئ نسخة جديدة، والنسخة السابقة تبقى مقروءة بكامل التباين لا معتمة. | — |
| `EXPIRED` | انتهت صلاحية الاقتراح | `restricted` / `stop-circle` / `outline` | انتهت مهلة الموافقة على هذا الاقتراح؛ يمكن طلب خطة جديدة من العيادة إن رغبت بالمتابعة. | انتهاء الصلاحية لا يُبطل أي لقطة سبق قبولها؛ يسري فقط على اقتراح لم يُقبَل بعد. | لا يُعرض كخطأ من المريض؛ الانتهاء تلقائي بحكم المهلة. |

---

## TXT-STATE-CLINICAL-002 — Treatment stage

**Source:** `docs/domain/STATE_MACHINES.md` §10.
**Audiences:** Patient, Clinic, Admin.
**Token owner:** `semantic.state.json` → `state.treatment-stage`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `INCOMPLETE` | لم تكتمل بعد | `neutral` / `ellipsis-horizontal-circle` / `muted` | هذه المرحلة العلاجية لم تكتمل بعد. |
| `COMPLETED` | مكتملة | `success` / `check-circle` / `subtle` | تم إكمال هذه المرحلة العلاجية. |
| `REOPENED` | أُعيد فتحها | `info` / `arrow-path` / `subtle` | أُعيدت هذه المرحلة إلى العمل بعد اكتمالها؛ سبب إعادة الفتح مسجَّل ضمن السجل التاريخي عبر `CMP-PLATFORM-013`. |

---

## TXT-STATE-CLINICAL-003 — Clinical reviewer credential

**Source:** `docs/domain/STATE_MACHINES.md` §5. Immutable snapshots.
**Audiences:** Clinic (the credentialed reviewer), Admin. **Not a Patient surface.**
**Token owner:** `semantic.state.json` → `state.clinical-reviewer-credential`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `verified` | موثَّق | `success` / `check-badge` / `subtle` | الاعتماد موثَّق وسارٍ. |
| `revoked` | أُلغي التوثيق | `restricted` / `lock-closed` / `subtle` | أُلغي هذا التوثيق ولم يعد ساريًا اعتبارًا من تاريخ الإلغاء. |
| `expired` | منتهي الصلاحية | `restricted` / `stop-circle` / `subtle` | انتهت صلاحية هذا التوثيق. |

---

## TXT-STATE-FINANCE-001 — External financial event

**Source:** `docs/domain/STATE_MACHINES.md` §11 (append-only). **Binds copy obligation 9 harder than
any other family: no status here may say or imply that UberTib held, captured, settled, or refunded
money — these are records of a fact reported from outside the platform, nothing more.**
**Audiences:** Patient, Clinic, Admin.
**Token owner:** `semantic.state.json` → `state.external-financial-event`.

| Status | Chip label | Triple | Meaning | Notes |
|---|---|---|---|---|
| `REPORTED_UNCONFIRMED` | مُبلَّغ عنه — غير مؤكَّد | `warning` / `banknotes` / `subtle` | تم تسجيل هذا الحدث المالي كواقعة **مُبلَّغ عنها من خارج المنصة**، وهو بانتظار التأكيد. | لا تُستخدم كلمات "دفعة" أو "تحصيل" بمعنى أن المنصة قبضت المبلغ؛ الحدث سجل لواقعة خارجية فقط. |
| `CONFIRMED` | مؤكَّد | `success` / `check-circle` / `subtle` | تم تأكيد هذا الحدث المالي كسجل واقعي. | التأكيد يخص دقة **تسجيل** الواقعة، لا تنفيذ أي عملية دفع من قبل المنصة. |
| `DISPUTED` | محل اعتراض | `danger` / `hand-raised` / `solid` | هذا الحدث المالي محل اعتراض من أحد الأطراف. | مسار حل الاعتراض هو `TXT-STATE-CLAIMS-001`/`002` حيث ينطبق؛ لا يُفتح مسار تسوية داخل هذا السجل نفسه. |

---

## TXT-STATE-REVIEWS-001 — Review

**Source:** `docs/domain/STATE_MACHINES.md` §12.
**Audiences:** Patient (author), Clinic (subject provider), Admin.
**Token owner:** `semantic.state.json` → `state.review`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `ACTIVE` | منشور | `success` / `eye` / `subtle` | هذا التقييم منشور ومرئي حاليًا. |
| `RETIRED` | مؤرشَف | `restricted` / `archive-box` / `outline` | لم يعد هذا التقييم منشورًا؛ يبقى محفوظًا كسجل تاريخي. |

---

## TXT-STATE-REVIEWS-002 — Review appeal

**Source:** `docs/domain/STATE_MACHINES.md` §13. Escalation route for `ERR-REVIEWS-001` — see
`CONTENT_GUIDE_ERRORS.md`.
**Audiences:** the authorized appellant — authoring patient/guardian **or** the affected provider or
clinic per `PO-UX-10` — and the Admin decider.
**Token owner:** `semantic.state.json` → `state.review-appeal`.

| Status | Chip label | Triple | Meaning | Notes |
|---|---|---|---|---|
| `SUBMITTED` | مُقدَّم | `info` / `inbox-arrow-down` / `subtle` | تم تقديم الاعتراض وهو بانتظار قرار المُراجع المخوَّل. | — |
| `DECIDED` | صدر القرار | `neutral` / `scale` / `subtle` | صدر قرار بشأن هذا الاعتراض؛ **تفاصيل النتيجة مذكورة في السبب المسجَّل**، لا في لون الحالة. | الحالة نفسها محايدة عمدًا — النتيجة تعيش في القرار المسبَّب عبر `CMP-PLATFORM-013`، لا في الرمز. اعتراض يطلب تعديل محتوى التقييم نفسه بدل الطعن بالأهلية أو التحقق أو الالتزام بالسياسة لا يدخل هذا المسار. |

---

## TXT-STATE-CLAIMS-001 — Claim / refund request

**Source:** `docs/domain/STATE_MACHINES.md` §14. **`EVIDENCE_INCOMPLETE` is the one status in this
file where inaction before a deadline can lose the claim — its `solid` emphasis is deliberate.**
**Audiences:** Patient (claimant), Clinic (where affected), Admin.
**Token owner:** `semantic.state.json` → `state.claim-request`.

| Status | Chip label | Triple | Meaning | Notes |
|---|---|---|---|---|
| `SUBMITTED` | مُقدَّم | `info` / `inbox-arrow-down` / `subtle` | تم تقديم الطلب وهو بانتظار المراجعة. | — |
| `EVIDENCE_INCOMPLETE` | أدلة ناقصة — إجراء مطلوب | `warning` / `exclamation-triangle` / `solid` | الأدلة المطلوبة لهذا الطلب غير مكتملة أو غير صالحة؛ **يلزم استكمالها ضمن المهلة المحددة، وإلا فقد يُغلق الطلب.** | يُذكر العنصر الناقص تحديدًا حيث يُخوَّل المريض بمعرفته؛ لا صياغة عامة. تمييز فشل النقل القابل لإعادة المحاولة عن رفض الدليل نفسه إلزامي — copy obligation 3. |
| `UNDER_REVIEW` | قيد المراجعة | `info` / `magnifying-glass` / `subtle` | الطلب قيد مراجعة الفريق المخوَّل. | — |
| `DECIDED` | صدر القرار | `neutral` / `scale` / `subtle` | صدر قرار بشأن هذا الطلب؛ تفاصيل النتيجة مذكورة في السبب المسجَّل. | لا تُستخدم كلمات تأمين أو تعويض مضمون — الحماية شرطية دائمًا؛ `TXT-PLATFORM-013`. |
| `CLOSED` | مُغلَق | `restricted` / `archive-box` / `outline` | هذا الطلب مُغلَق ولا يقبل مزيدًا من الإجراءات ضمن هذا السجل. | مسار الطعن بقرار مُغلَق هو `TXT-STATE-CLAIMS-002` (اعتراض على الطلب)، لا إعادة فتح السجل نفسه. |

---

## TXT-STATE-CLAIMS-002 — Claim appeal

**Source:** `docs/domain/STATE_MACHINES.md` §15. Escalation route for `ERR-CLAIMS-001` — see
`CONTENT_GUIDE_ERRORS.md`. Decided independently of the original claim decision.
**Audiences:** the authorized appellant, Admin.
**Token owner:** `semantic.state.json` → `state.claim-appeal`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `SUBMITTED` | مُقدَّم | `info` / `inbox-arrow-down` / `subtle` | تم تقديم الاعتراض وهو بانتظار المراجعة. |
| `UNDER_REVIEW` | قيد المراجعة | `info` / `magnifying-glass` / `subtle` | الاعتراض قيد مراجعة الفريق المخوَّل. |
| `DECIDED` | صدر القرار | `neutral` / `scale` / `subtle` | صدر قرار بشأن هذا الاعتراض، مستقل عن القرار الأصلي؛ تفاصيل النتيجة مذكورة في السبب المسجَّل. |

---

## TXT-STATE-CATALOG-001 — Service definition

**Source:** `docs/domain/STATE_MACHINES.md` §3. **Detailed procedure item versions reuse this exact
machine and this exact set of labels — one governance mechanism covers both catalog layers, so there
is no second copy family for procedure items.**
**Audiences:** Clinic, Admin. **No Patient surface renders this component, per `CMP-POLICY-001`'s
content rule** — the patient sees the practical service/procedure content, never its governance state.
**Token owner:** `semantic.state.json` → `state.service-definition`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `draft` | مسودة | `neutral` / `pencil-square` / `muted` | هذا التعريف قيد الإعداد ولم يُرسل للمراجعة. |
| `reviewed` | روجعت | `info` / `check-badge` / `subtle` | خضع هذا التعريف للمراجعة السريرية المطلوبة. |
| `scheduled` | مجدول للتفعيل | `info` / `flag` / `subtle` | سيصبح هذا التعريف فعّالًا في التاريخ المحدد. |
| `active` | فعّال | `success` / `eye` / `subtle` | هذا التعريف فعّال ومرئي حاليًا. |
| `retired` | متقاعد | `restricted` / `archive-box` / `outline` | لم يعد هذا التعريف فعّالًا؛ يبقى محفوظًا كسجل تاريخي قابل للاطّلاع. |
| `superseded` | استُبدل بنسخة أحدث | `restricted` / `rectangle-stack` / `outline` | استُبدل هذا التعريف بنسخة أحدث؛ يبقى قابلاً للاطّلاع كسجل تاريخي. |

**Prohibition carried on every row:** **لا يجوز عرض أي محتوى من هذا التعريف كمعتمد للإنتاج سريريًا ما
لم تكن `TXT-STATE-CATALOG-002` (بوابة الإطلاق) في حالة `approved` فعّالة.** كتالوج التقييم الأولي مرشح
ولا يعادل الاعتماد.

---

## TXT-STATE-CATALOG-002 — Service launch gate

**Source:** `docs/domain/STATE_MACHINES.md` §4 (append-only decisions). **`expired` is `solid` because
it is the status most likely to be misread as still approved, and production readiness fails closed on
it — `IX-POLICY-001`.**
**Audiences:** Admin. **Not a Patient or Clinic-authoring surface.**
**Token owner:** `semantic.state.json` → `state.service-launch-gate`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `pending` | بانتظار القرار | `warning` / `exclamation-circle` / `subtle` | لم يصدر بعد قرار بشأن جاهزية هذا العنصر للإنتاج. |
| `approved` | معتمد للإطلاق | `success` / `check-badge` / `subtle` | هذا العنصر معتمد للإنتاج. |
| `rejected` | مرفوض | `danger` / `x-circle` / `subtle` | لم تتم الموافقة على إطلاق هذا العنصر. |
| `revoked` | أُلغي الاعتماد | `restricted` / `lock-closed` / `subtle` | أُلغي هذا الاعتماد؛ لم يعد ساريًا اعتبارًا من تاريخ الإلغاء. |
| `expired` | **منتهي الصلاحية — غير معتمد** | `restricted` / `stop-circle` / `solid` | **انتهت صلاحية هذا الاعتماد وهو يُعامَل الآن كغير معتمد للإطلاق.** لا يجوز عرض ما يعتمد عليه كجاهز للإنتاج حتى صدور اعتماد جديد. | التصنيف `solid` إلزامي هنا تحديدًا كي لا يُقرأ كاعتماد سارٍ منسي. |

---

## TXT-STATE-POLICY-001 — Policy version

**Source:** `docs/domain/STATE_MACHINES.md` §6. **One machine governs price-band, market-calibration,
commercial-option, proposal-validity and currency-normalization policy versions alike — one copy
family, not five.**
**Audiences:** Clinic (where the version is theirs to author), Admin. **Not a Patient surface** —
`CMP-POLICY-001` renders in no Patient variant.
**Token owner:** `semantic.state.json` → `state.policy-version`.

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `draft` | مسودة | `neutral` / `pencil-square` / `muted` | هذه النسخة قيد الإعداد ولم تُرسل للمراجعة. |
| `reviewed` | روجعت | `info` / `check-badge` / `subtle` | خضعت هذه النسخة للمراجعة المطلوبة. |
| `scheduled` | مجدولة للتفعيل | `info` / `flag` / `subtle` | ستصبح هذه النسخة فعّالة في التاريخ المحدد. |
| `active` | فعّالة | `success` / `eye` / `subtle` | هذه هي النسخة الفعّالة حاليًا. |
| `retired` | متقاعدة | `restricted` / `archive-box` / `outline` | لم تعد هذه النسخة فعّالة؛ تبقى محفوظة كسجل تاريخي. |
| `superseded` | استُبدلت بنسخة أحدث | `restricted` / `rectangle-stack` / `outline` | استُبدلت هذه النسخة؛ الخطط التي اعتمدت عليها تحتفظ بما اعتمدت عليه بالضبط. |

**Prohibition:** لا تُعرض نسخة `retired` أو `superseded` كأنها لا تزال تحكم أي التزام قائم؛ ما اعتُمد
تحت نسخة سابقة يبقى محكومًا بها كسجل ثابت — `docs/domain/STATE_MACHINES.md` §16.

---

## TXT-STATE-OPS-001 — Operational work item

**Source:** `docs/domain/STATE_MACHINES.md` §20. **The five statuses and the two flags are rendered in
separate slots — a flag never replaces or recolours the status chip**, because a work item may be
simultaneously `IN_PROGRESS`, escalated and overdue at once, and collapsing that into one value is the
exact defect `CMP-OPS-001` exists to prevent.
**Audiences:** Clinic and Admin staff working operational queues. **Not a Patient surface** — this is
an operational projection, not business truth, per `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`.
**Token owner:** `semantic.state.json` → `state.work-item` (statuses) and `state-flag` (flags).

| Status | Chip label | Triple | Meaning |
|---|---|---|---|
| `OPEN` | مفتوح — غير مُسنَد | `neutral` / `ellipsis-horizontal-circle` / `subtle` | هذا البند مفتوح ولم يُسنَد إلى أحد بعد. |
| `ASSIGNED` | مُسنَد | `info` / `user-circle` / `subtle` | أُسند هذا البند إلى الشخص المذكور. |
| `IN_PROGRESS` | قيد التنفيذ | `info` / `play-circle` / `subtle` | العمل على هذا البند جارٍ حاليًا. |
| `WAITING` | بانتظار عامل خارجي | `warning` / `pause-circle` / `subtle` | هذا البند متوقف بانتظار أمر آخر يجب أن يُستكمل أولًا. |
| `COMPLETED` | مكتمل | `success` / `check-circle` / `subtle` | تم إكمال هذا البند. |

| Flag | Label | Triple | Meaning |
|---|---|---|---|
| `escalated` | مُصعَّد | `danger` / `bell-alert` / `solid` | أُحيل هذا البند لمزيد من الانتباه، بالإضافة إلى حالته الحالية. |
| `overdue` | متأخر | `danger` / `clock` / `solid` | تجاوز هذا البند المهلة المحددة له، بالإضافة إلى حالته الحالية. |

**Prohibition:** لا معرّف طابور داخلي، ولا اسم عامل خلفي (worker)، ولا اسم وظيفة تشغيلية (job) يظهر
للمستخدم على هذا البند — `CMP-OPS-001`.

---

## TXT-STATE-PLATFORM-001 — Evidence transfer session

**Source:** `docs/domain/STATE_MACHINES.md` §21.1 (provider-neutral); `PO-UX-17`; `IX-PLATFORM-006`;
`CMP-PLATFORM-012`. **This is where copy obligation 3 is structurally load-bearing: `FAILED_RETRYABLE`
must never read as `REJECTED`, because a dropped connection is the most likely evidence failure in
this product's weak-connectivity conditions, and telling a patient their document was refused when the
network merely dropped is the single worst copy error this system can commit.**
**Audiences:** the actor transferring evidence (Patient, or Clinic where authoring), and the Clinic/
Admin reviewer of that evidence. Eight fixed states, two exits.
**Token owner:** `semantic.state.json` → `state.evidence-transfer-session`.

| Status | Chip label | Triple | Meaning | Notes |
|---|---|---|---|---|
| `SELECTED` | تم الاختيار | `neutral` / `document-text` / `muted` | الملف مُحدَّد ولم يبدأ رفعه بعد. | — |
| `UPLOADING` | جارٍ الرفع | `info` / `arrow-up-tray` / `subtle` | الرفع جارٍ الآن، بنسبة تقدم محددة. | تقدّم محدَّد (determinate) دائمًا أثناء الرفع، لا مؤشرًا غامضًا. |
| `PAUSED` | متوقَّف مؤقتًا | `neutral` / `pause-circle` / `subtle` | تم إيقاف الرفع مؤقتًا؛ يمكن استئنافه من حيث توقف. | — |
| `FAILED_RETRYABLE` | **تعذّر الرفع — أعد المحاولة** | `warning` / `arrow-path` / `solid` | **لم يكتمل رفع الملف بسبب مشكلة في الاتصال أو النقل. لم تتم مراجعة الملف بعد ولم يُرفض. يمكن استئناف الرفع من حيث توقف أو إعادة المحاولة.** | **الحالة الأهم في هذا الجدول.** يُحظر أي وصف يوحي بالرفض أو التقييم. يُتاح استئناف النقل حيث تدعمه الجلسة، وإلا إعادة محاولة العنصر دون إعادة إدخال باقي النموذج. |
| `UPLOADED` | تم الرفع — بانتظار الفحص | `info` / `cloud-arrow-up` / `subtle` | وصل الملف وينتظر الفحص والتحقق المطلوبَين قبل أن يصبح صالحًا للاستخدام. | **`UPLOADED` ليست `ACCEPTED`** — الملف لا يزال في الحجر (quarantine)؛ لونان وأيقونتان مختلفتان لإظهار الفرق مرئيًا لا في التوثيق وحده. |
| `VALIDATING_SCANNING` | جارٍ الفحص | `info` / `shield-check` / `subtle` | يجري الآن فحص الملف للتأكد من سلامته ومطابقته للمتطلبات. | مؤشر غامض (indeterminate) لكن **مع سبب مذكور** — لا مؤشر دوّار عارٍ بلا تفسير. |
| `ACCEPTED` | مقبول | `success` / `check-circle` / `subtle` | اجتاز الملف الفحص المطلوب وأصبح مرتبطًا بالسجل. | **المخرج الأول.** لا يُستخدم كإجراء قابل للتراجع حتى استبدال الملف عبر مسار جديد. |
| `REJECTED` | مرفوض — يلزم استبدال الملف | `danger` / `x-circle` / `solid` | **لم يُقبل هذا الملف لأنه [السبب المحدد المُتاح — النوع، الحجم، أو نتيجة الفحص]. يرجى استبداله بملف يستوفي المتطلب المذكور.** | **المخرج الثاني.** يسمّي رفضٌ من هذا النوع دائمًا متطلبًا محددًا قابلاً للتصحيح، لا رفضًا عامًا غير مُفسَّر. لا يُكشف عن تفاصيل ماسح الفيروسات أو مساره الداخلي. |

**Structural rule carried by every row:** `FAILED_RETRYABLE` قابل للوصول فقط من مسار النقل، و
`REJECTED` قابل للوصول فقط من مسار التحقق أو المراجعة — لا مسار واحد يقود إلى الآخر. هذا الفصل هو نفسه
ما يمنع الخطأ الأخطر في هذا النظام: أن يُقرأ انقطاع اتصال على أنه رفض وثيقة.
