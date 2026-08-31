# UberTib Content Guide — Voice, Tone, and Cross-Cutting Copy Rules

**Phase:** 3 — Design System, Session 4 (Content)
**Status:** Implements the content-system scope of `PHASE_03_IMPLEMENTATION_PLAN.md` section 8 —
`TXT-*` rules and complete `ERR-*` user-facing copy coverage. Component architecture, tokens, and
interaction patterns are unchanged; this session found no direct contradiction requiring one.
**Companions:** `CONTENT_GUIDE_STATES.md` (18 lifecycle status families, 82 statuses),
`CONTENT_GUIDE_ERRORS.md` (21 error recovery families). This file owns everything else: voice, tone,
the cross-cutting `TXT-PLATFORM-*` rule set, the audience-translation table, the prohibitions master
list, and the surface vocabulary this file's companion applies per error.

---

## 1. What `TXT-*` owns, and what it must not touch

Carried forward from the implementation plan section 8.1, restated because every rule below depends on
this boundary holding.

| Owned by Phase 3 `TXT-*` | Owned elsewhere, referenced only |
|---|---|
| The Arabic label and required meaning for each of the 82 lifecycle statuses, per audience | The canonical Arabic `ERR-*` client-facing message, owned by `docs/api/ERROR_CATALOG.md` |
| Recovery guidance for each `ERR-*`, on each profile | The stable machine code and HTTP status |
| Audience translations of canonical terms | The canonical glossary term itself, owned by `docs/README.md` |
| Action-role labels, one label per role across all three platforms | Requirement and permission semantics |
| Empty-state and recovery copy per archetype | Per-screen final strings, which are Phase 4 |
| The prohibitions — what may never be said, and why | The rules the prohibitions enforce |

**This file never restates a canonical Arabic error message.** Every occurrence of catalog text below
is a reference, quoted only where needed for a supporting rule to make sense, never a second source of
truth.

## 2. Authority chain for content decisions

Unchanged from `docs/ux/README.md` and the implementation plan section 2. Where this file's guidance
and a canonical requirement disagree, the requirement wins. Three sources bind every rule below directly:
`docs/api/ERROR_CATALOG.md` (error messages), `docs/domain/STATE_MACHINES.md` (status meanings and
transitions), and the eleven named copy obligations first recorded in Phase 1 and Phase 2 and carried
here as enforceable rules, not suggestions.

## 3. The house voice, adapted for an Arabic-first, three-audience, safety-critical product

`content/voice-tone.md` at the repository root sets the house tone philosophy: clear, concise, useful,
human, honest; the what→why→how error formula; the value→action empty-state formula; frontload the
verb; never blame the user; no humor under stress. Those principles hold. Its **mechanics** section is
Latin-oriented — contractions, English capitalization, English idiom rules — and does not transfer
directly. `TXT-PLATFORM-001` through `TXT-PLATFORM-021` below are where this file adapts the philosophy
to Arabic, RTL, and this product's specific prohibitions, rather than reinventing it.

---

## TXT-PLATFORM-001 — Voice and tone

**Voice (constant across every surface, every audience):** واضح، مباشر، محايد تجاه اللوم، وصريح بشأن ما
هو معروف وما لا يزال غير معروف. المنتج لا يتحدث بصيغة "أنا"، ولا يستخدم لغة تسويقية أو مبالغة. لا صفات
تفضيلية عن أي طبيب أو عيادة — لا "الأفضل"، لا "الموصى به"، لا أي لقب تفوّق غير مدعوم بواقعة قابلة
للتحقق.

**Tone (يتكيّف حسب اللحظة، على غرار `content/voice-tone.md` لكن بمعايير هذا المنتج):**

| السياق | ما يشعر به المستخدم | النبرة المطلوبة |
|---|---|---|
| حالة معلّقة (تقييم أهلية، مراجعة إدارية) | قلق، غموض | محايدة، لا اتهامية — `TXT-PLATFORM-010` |
| خطأ قابل للتصحيح من المستخدم | إحباط بسيط | هادئة، مباشرة نحو الحل |
| عطل في النظام | حيرة | مطمئنة، تحمّل المسؤولية بصيغة الجمع لا اتهام المستخدم |
| إجراء لا رجعة فيه | حذر مطلوب | واضحة الأثر، لا تخفيفية ولا مبالغة في التخويف — `TXT-PLATFORM-012` |
| مسألة مالية | حساسية تجاه الدقة | دقيقة حرفيًا، لا تفسير أو تبسيط يغيّر المعنى — `TXT-PLATFORM-013` |
| مهلة تقترب | حاجة للتصرف في الوقت | واضحة الوقت المتبقي دون إثارة ذعر غير مبرر |

**القاعدة الحاكمة:** كلما ارتفع التوتر المحتمل لدى المستخدم، كانت الصياغة أبسط وأقل زخرفة. لا فكاهة في
الأخطاء، ولا في المسائل المالية، ولا في أي إجراء لا رجعة فيه — هذا امتداد مباشر لقاعدة `content/voice-tone.md`
نفسها، والمنتج لا يخفف منها في أي سياق.

---

## TXT-PLATFORM-002 — Action-role labels

**واحد لكل دور، عبر المنصات الثلاث كلها، بما فيها داخل تأكيده الخاص** — copy obligation 11 و
`IX-AUDIT-001`'s غير القابل للتفاوض: "one action role keeps one label across all three platforms,
including inside its own confirmation." الجدول أدناه يغطي كل دور فعل يظهر في أكثر من سياق واحد؛ أدوار
خاصة بشاشة واحدة تُترك لـ Phase 4.

| الدور | التسمية العربية | يظهر في | ملاحظة |
|---|---|---|---|
| تأكيد (غير حساس) | تأكيد | أي التزام روتيني | — |
| إلغاء الحوار | إلغاء | أي حوار أو نافذة تأكيد | لا يُستخدم لإلغاء سجل فعلي — ذلك دور منفصل أدناه |
| حفظ كمسودة | حفظ كمسودة | نماذج طويلة قابلة للاستئناف | `IX-PLATFORM-005` — لا ينشئ سجل تقديم |
| إرسال | إرسال | تقديم فعلي لسجل عمل | فعل متعمَّد ومنفصل عن الحفظ كمسودة |
| إعادة المحاولة | إعادة المحاولة | فشل قابل لإعادة المحاولة عبر `CMP-PLATFORM-010`/`-011` | يعيد استخدام نفس مفتاح إعادة المحاولة دائمًا — `IX-PLATFORM-002` |
| استئناف | استئناف الرفع | نقل أدلة متوقف أو متعثر | لا يُستبدل بـ"إعادة المحاولة" — الاستئناف يكمل من نقطة التوقف |
| استبدال الملف | استبدال الملف | دليل مرفوض | لا يُستخدم لفشل نقل قابل لإعادة المحاولة |
| قبول | قبول | خطة علاجية، موعد بديل، دعوة صلاحية | نفس التسمية تظهر داخل تأكيدها الخاص إن وُجد |
| رفض | رفض | خطة، موعد بديل، طلب انضمام | — |
| إلغاء الحجز | إلغاء الحجز | إلغاء حجز فعلي من المريض أو العيادة | فعل حساس — `IX-AUDIT-001`؛ لا يُختصر إلى "إلغاء" وحدها لتفادي الخلط مع إلغاء حوار |
| سحب الاقتراح | سحب الاقتراح | مُقترِح موعد بديل يسحب اقتراحه | — |
| إلغاء الصلاحية | إلغاء الصلاحية | إبطال دعوة/منحة موظف فعّالة | فعل حساس، لا رجعة فيه فعليًا إلا بدعوة جديدة |
| طلب تعديل | طلب تعديل | مراجع يعيد طلبًا لمقدّمه | — |
| تقديم اعتراض | تقديم اعتراض | اعتراض على تقييم أو قرار طلب | يقود إلى `TXT-STATE-REVIEWS-002` أو `TXT-STATE-CLAIMS-002` |
| تصعيد | تصعيد | وضع علم "مُصعَّد" على بند عمل | علم إضافي، لا يستبدل الحالة — `TXT-STATE-OPS-001` |
| إعادة الإسناد | إعادة الإسناد | نقل بند عمل لمالك آخر | — |
| تصدير | تصدير البيانات | تصدير بيانات شخصية | فعل حساس يمر عبر `IX-AUDIT-001` |
| تبديل السياق | تبديل السياق | تغيير مقدّم الخدمة/الفرع الفعّال (Clinic) | لا ينشئ أي صلاحية جديدة بحد ذاته |

**قاعدة الزر:** التسمية فعل يبدأ الجملة، لا اسمًا. "حفظ" لا "الحفظ". لا علامة ترقيم ختامية على أي تسمية
زر.

---

## TXT-PLATFORM-003 — Field labels

- التسمية دائمًا ظاهرة وثابتة فوق الحقل أو ملاصقة له منطقيًا؛ **النص التوضيحي داخل الحقل (placeholder)
  ليس بديلاً عن التسمية تحت أي ظرف** — هذا امتداد مباشر لقاعدة `content/voice-tone.md`، والأهم هنا لأن
  اختفاء placeholder عند الكتابة في حقل عربي RTL يترك المستخدم بلا مرجع.
- لا نقطتان ختاميتان بعد التسمية.
- الحقول الإلزامية تُعلَّم بعلامة نصية واضحة ("مطلوب") لا بنجمة حمراء وحدها — قاعدة "لا اللون وحده"
  تمتد إلى علامات الإلزام.
- تسميات الحقول المالية تسمي الوحدة (العملة) ضمن التسمية نفسها، لا في نص منفصل قد يُفصل بصريًا عنها في
  تخطيط RTL.

---

## TXT-PLATFORM-004 — Helper text

**الصيغة:** يسبق نص المساعدة أي خطأ، لا يظهر بعده كتفسير متأخر — يضبط التوقع قبل أن يخطئ المستخدم، تمامًا
كما في `content/voice-tone.md`. عند ظهور خطأ حقل فعلي، نص المساعدة يبقى ظاهرًا إلى جانب رسالة الخطأ، لا
يُستبدَل بها، لأن السياق الذي يفسر الصيغة المطلوبة لا يزال مفيدًا وقت التصحيح.

**مثال الصيغة:** "[الصيغة أو النطاق المتوقع]" — لا تكرار لاسم الحقل نفسه، ولا تعليمات بديهية ("أدخل
قيمة").

---

## TXT-PLATFORM-005 — Validation

**الصيغة الثابتة لكل رسالة تحقق حقل: [ما الخطأ] + [كيف يُصحَّح]، دون فقرة "لماذا" إلا حين لا يكون السبب
بديهيًا** — نفس صيغة `content/voice-tone.md` بالضبط، مطبَّقة بالعربية. الرسالة مرتبطة بالحقل مباشرة، لا
معروضة في شريط عام حين يمكن إسنادها لحقل واحد — `IX-PLATFORM-018`.

**ممنوع:** "خطأ: إدخال غير صالح" بلا تفصيل؛ رمز خطأ داخلي معروضًا وحده؛ عبارة "حدث خطأ ما" بلا مسار
تالٍ.

**الحقل الحدودي:** حيث يعجز التحقق عن إسناد الخطأ لحقل واحد، تُستخدم الرسالة العامة لـ
`ERR-PLATFORM-001` من `docs/api/ERROR_CATALOG.md`، مرجَعة لا مُعاد صياغتها — انظر `TXT-ERR-PLATFORM-001`.

---

## TXT-PLATFORM-006 — System error copy

كل نسخة خطأ يواجهها المستخدم مبنية من طبقتين لا تُدمَجان في جملة واحدة مُخترَعة: **رسالة الكتالوج
الرسمية** (مرجَعة حرفيًا من `docs/api/ERROR_CATALOG.md`، لا تُعاد صياغتها أبدًا) ثم **إرشاد الاسترداد**
الذي يملكه هذا الملف. التغطية الكاملة للأربعة والعشرين — تصحيح: الواحد والعشرين — رمزًا موجودة في
`CONTENT_GUIDE_ERRORS.md`، منظَّمة كعائلة واحدة لكل `ERR-*`.

**قاعدة صلبة:** لا تفاصيل تقنية داخلية تظهر للمستخدم أبدًا — لا أثر مكدس (stack trace)، لا خطأ SQL، لا
اسم صنف داخلي، لا بيانات اعتماد مزوّد — `docs/api/ERROR_CATALOG.md` §14.

---

## TXT-PLATFORM-007 — Empty states

**تمييز إلزامي بين أربع حالات مختلفة، لا تُكتب أبدًا بجملة واحدة عامة:**

| الحالة | الصيغة | مثال بنية الجملة |
|---|---|---|
| لا بيانات فعلاً (أول استخدام أو فراغ حقيقي) | [ما الذي يظهر هنا ولماذا هو مفيد] ← [الإجراء الأول] | "لا توجد [عناصر] بعد. [إجراء البدء]." |
| فارغ بسبب فلترة | [أن النتائج الحالية محكومة بالفلتر، لا أن لا بيانات إطلاقًا] ← [مسح الفلتر أو تعديله] | "لا نتائج تطابق [معايير الفلتر الحالية]. عدّل الفلتر أو امسحه." |
| بيانات جزئية (تحميل بعضها فشل) | [أن ما يظهر ليس كامل الصورة] ← [إعادة تحميل الجزء الناقص] | لا يُعرض كأنه اكتمل — `IX-PLATFORM-017` |
| بيانات قديمة (قراءة سابقة محتفَظ بها) | [وقت آخر قراءة ناجحة] ← [تحديث] | "البيانات كما كانت في [الوقت]. تحديث." |

**ممنوع إطلاقًا:** "لا توجد بيانات" أو "خطأ" كجملة وحيدة بلا سياق أو إجراء؛ رسم توضيحي (illustration)
يحل محل إجراء الاسترداد الفعلي — `CMP-PLATFORM-009`؛ أي إيموجي بأي موضع.

---

## TXT-PLATFORM-008 — Loading states

| النوع | الصيغة |
|---|---|
| تحميل أولي | هيكل عظمي (skeleton) بلا نص إلزامي؛ إن وُجد نص فهو يسمّي ما يُحمَّل، لا "يرجى الانتظار" العامة |
| تحديث (refresh) | المحتوى الحالي يبقى ظاهرًا ويُعلَّم بأنه "قيد التحديث"، لا يُستبدل بمؤشر تحميل فارغ |
| قراءة طويلة مع تقدم (`IX-PLATFORM-009`) | نسبة تقدم محددة حيث ممكنة؛ حيث غير ممكنة، مؤشر غير محدد **مع سبب مذكور دومًا** — لا مؤشر دوّار عارٍ |
| التزام (submitting) | يسمّي الفعل قيد التنفيذ ("جارٍ [الفعل]…")، لا "جارٍ التحميل" العامة لكل شيء |

---

## TXT-PLATFORM-009 — Offline and weak network

- انقطاع الاتصال يُعرض كحالة واضحة ("لا يوجد اتصال حاليًا")، لا كفشل غامض. آخر بيانات معروفة تبقى ظاهرة
  ومُعلَّمة بوقتها — "قديم ومُعلَّم أفضل من فارغ" (`IX-PLATFORM-003`).
- فشل نقل بسبب شبكة ضعيفة **لا يُصاغ أبدًا كرفض** — copy obligation 3، الأهم في هذا الملف كله. انظر
  `TXT-STATE-PLATFORM-001` و`TXT-ERR-PLATFORM-005`.
- الاستئناف من نقطة التوقف هو المسار الافتراضي، لا إعادة البدء من الصفر، حيث تدعمه الجلسة —
  `IX-PLATFORM-006`.
- لا رقم عد محاولات يُعرض كعقوبة؛ عدد المحاولات معلومة تشغيلية، لا حكمًا على المستخدم.

---

## TXT-PLATFORM-010 — Pending and review states

**القاعدة الأهم في هذا القسم — copy obligation 2 حرفيًا:** أي حالة معلّقة أو قيد المراجعة تُصاغ كـ
"حجز إجراء ريثما يكتمل تحقق"، **ليست أبدًا اتهامًا، وليست أبدًا تعليمات بالحضور أو الالتزام بشيء لم
يُطلب صراحة.** هذا يشمل `ELIGIBILITY_REVIEW` على الحجز، و`PENDING_EVALUATION` على الأهلية، وأي حالة
`UNDER_REVIEW` في عائلات الاعتراضات والمطالبات.

**صيغة موحّدة:** "[الشيء] قيد [نوع المراجعة] حاليًا. [ما إن كان مطلوبًا من المستخدم فعل شيء، أو لا شيء
مطلوب حتى إشعار آخر]." لا فعل أمر موجَّه للمستخدم ("راجع"، "احضر") ما لم يكن فعلاً مطلوبًا فعليًا وموثقًا.

**اللون والأيقونة مختلفان دومًا بين حالة معلّقة إيجابية الاتجاه وحالة سلبية النتيجة** — `PENDING_EVALUATION`
و`NOT_ELIGIBLE` لا يتشاركان أي عنصر بصري، تنفيذًا لـ `CMP-PLATFORM-001`'s القاعدة الهيكلية.

---

## TXT-PLATFORM-011 — Warnings

تمييز بين نوعين لا يُدمَجان:

- **تحذير معلوماتي (غير حاسم):** يُخبر المستخدم بأمر يستحق الانتباه دون منعه من المتابعة. نبرة هادئة،
  لا علامة تعجب متعددة (بحد أقصى واحدة لكل شاشة، وفق `content/voice-tone.md`).
- **تحذير مهلة تقترب (`CMP-PLATFORM-005`):** يذكر الوقت المتبقي بالتحديد، ويتحول لونه وأيقونته ونصه معًا
  عند بلوغ عتبة السياسة المحددة لكل مهلة — لا عتبة موحّدة افتراضية.

**ممنوع:** أي تحذير يخلط بين "معلوماتي" و"حاسم لا رجعة فيه" في نفس الصياغة — الإجراء الذي لا يمكن التراجع
عنه يستخدم `TXT-PLATFORM-012` حصرًا، لا هذه القاعدة.

---

## TXT-PLATFORM-012 — Irreversible actions

**صيغة `IX-AUDIT-001` الثابتة، بلا استثناء لأي سياق:**

1. **ما هو هذا الإجراء** — بتسمية الزر المُشغِّل نفسها، لا صياغة أخرى.
2. **ماذا سيفعل** — بالتحديد، لا "سيتم تنفيذ الإجراء".
3. **هل يمكن التراجع عنه** — **مكتوبة بالكلمات صراحة، لا بالنبرة أو اللون وحده.**
4. **ما الذي يتأثر** — بالتحديد.
5. **سبب مطلوب** لكل تصنيف حساس أو مدمّر أو قرار مسؤول — copy obligation 11.
6. **تسمية زر التأكيد تطابق تسمية الزر المُشغِّل تمامًا**، بما فيها التصنيف اللوني/الدور (فعل مدمّر يبقى
   مدمّرًا في التأكيد، لا يتحول إلى تصنيف عادي أو العكس).

**مثال بنية الجملة:** "[الفعل — نفس تسمية الزر]؟ سيؤدي هذا إلى [الأثر المحدد]. [هذا الإجراء لا يمكن
التراجع عنه. / يمكن التراجع عن هذا بـ...]. [تأثيره على: كذا]."

---

## TXT-PLATFORM-013 — Financial transparency

**كل الصياغات المالية في المنتج محكومة بخمس قواعد لا استثناء لها، مجمَّعة من عوائق النسخ 4 و5 و9 و10:**

1. **سعر بداية يُقرأ كسعر بداية، نطاق يُقرأ كنطاق، سعر مجاني يُقرأ كمجاني فعلاً لا كبيانات ناقصة، وسعر
   مرهون بالفحص يُقرأ كسعر لا يحدده إلا فحص فعلي** — لا كرفض إفصاح.
2. **لا نص سعر يذكر متوسط السوق، متوسط المدينة، تعرفة، أو سعرًا موصى به**، على أي منصة، بأي صياغة. المنتج
   يعرض سعر مقدّم الخدمة نفسه فقط.
3. **لا نص يذكر أو يوحي بأن المنصة قبضت مالًا أو دفعته أو أمّنته أو استردته.** كل حدث مالي هو **تسجيل
   لواقعة خارجية**، لا معاملة تنفذها المنصة — `TXT-STATE-FINANCE-001`.
4. **الحماية تُصاغ بمعناها الشرطي الموثَّق حصرًا** — لا تأمين، لا تعويض مضمون، لا نتيجة مضمونة.
5. **كل سطر في خطة علاجية يسمي فئته وسببه وما يغطيه.** لا "رسوم إضافية" ولا "تسوية" ولا "أخرى" — copy
   obligation 7.

**ممنوع أي عنصر واجهة قرب مبلغ مالي يوحي بمحفظة، رصيد، شحن، سحب، أو استرداد تنفذه المنصة** — هذه القدرات
غير موجودة في V1 على الإطلاق.

---

## TXT-PLATFORM-014 — Version and amendment communication

يُبنى على `CMP-CLINICAL-002` (كشف التغيير):

- **النسخة السابقة تبقى مرئية وغير قابلة للتعديل، بكامل التباين البصري، لا معتمة.**
- **ما تغيّر يُكشف قبل أن يصبح القبول ممكنًا** — لا زر قبول متاح قبل عرض الفرق.
- المنطقتان تُسمّيان صراحة: "كما كانت" و"كما أصبحت" — لا "قديم/جديد" غامضة.
- زر القبول يسمّي أنه يقبل **الشروط المعدَّلة تحديدًا**، لا "قبول" وحدها بلا سياق — مهم لمستخدمي قارئ
  الشاشة الذين لا يرون المقارنة البصرية.
- **لا نص يذكر أو يوحي بأن مالًا تحرّك لمجرد تغيّر الشروط.**

---

## TXT-PLATFORM-015 — Claims and disputes copy

- كل حالة في عائلتَي "طلب الاسترداد/الحماية" و"الاعتراض على الطلب" (`TXT-STATE-CLAIMS-001`/`-002`)
  محايدة اللهجة — لا تفترض خطأ أي طرف قبل صدور قرار.
- **الحماية دومًا مشروطة، لا مضمونة** — `TXT-PLATFORM-013` القاعدة 4 تنطبق هنا حرفيًا.
- المهلة الزمنية لتقديم طلب أو اعتراض تُعرض بوضوح تام قبل انتهائها، لا تُكتشف بعد فواتها —
  `CMP-PLATFORM-005`.
- عند صدور قرار (`DECIDED`)، النتيجة تعيش في **السبب المسجَّل** المنسوب لمُقرِّر محدد
  (`CMP-PLATFORM-013`)، لا في لون الحالة وحده — الحالة `DECIDED` نفسها محايدة عمدًا.
- اعتراض يطلب تعديل محتوى تقييم، لا الطعن بأهليته أو التحقق منه أو الالتزام بالسياسة، لا يدخل مسار
  الاعتراض إطلاقًا — يُقال ذلك صراحة، لا يُترك المستخدم يكتشفه برفض غامض.

---

## TXT-PLATFORM-016 — Permissions

- رفض الصلاحية **لا يسمي أبدًا مفتاح صلاحية داخليًا، ولا يوحي بوجود تجاوز (override)** —
  `IX-PLATFORM-007`.
- **إزالة إجراء بسبب نقص صلاحية أو حالة دورة حياة تعني أن الإجراء غائب ومُفسَّر، لا معطَّلاً (disabled)**
  — إجراء معطَّل يوحي بوجود تجاوز، وغيابه لا يوحي بشيء — `CMP-PLATFORM-004`.
- حيث يوجد مسار مشروع للحصول على النطاق المطلوب (طلب منحة صلاحية من ممثل مخوَّل، مثلاً)، يُذكر بالضبط —
  `TXT-STATE-IDENTITY-002`.
- حيث لا يوجد مسار توثَّق، لا يُخترَع مسار — الملف يذكر ذلك صراحة بدل صياغة عامة توحي بوجود حل غير موجود
  فعليًا.
- فقدان الصلاحية أثناء فتح شاشة يزيل الإجراءات القديمة فورًا (لا تعطيلها)، ويعكس رأس السياق
  (`CMP-PLATFORM-003`) النطاق الجديد — لا يُترك المستخدم يكتشف الفقدان بمحاولة فاشلة.

---

## TXT-PLATFORM-017 — Audience translation families

كل مصطلح كنسي في `docs/README.md` له عرض مختلف بحسب الجمهور. الجدول التالي يترجم كل مصطلح إلى صياغة
عملية لكل جمهور — المصطلح الداخلي يبقى كما هو في `docs/README.md`؛ هذا الجدول يملك فقط الترجمة الظاهرة
للمستخدم.

| المصطلح الكنسي | المعنى الداخلي | صياغة المريض | صياغة العيادة | صياغة الإدارة |
|---|---|---|---|---|
| Evaluation Catalog | كتالوج تقييم أولي مؤقت، غير معتمد سريريًا | لا يظهر كمفهوم منفصل — يظهر فقط محتوى فعّال (`active`) | "كتالوج مرشح، غير معتمد للإنتاج بعد" | نفس صياغة العيادة، مع حالة بوابة الإطلاق |
| Service Family | طبقة الاكتشاف والحجز المريضية | اسم الخدمة كما يظهر في البحث | "الخدمة (مستوى المريض)" | نفس صياغة العيادة |
| Procedure Item | طبقة تفصيلية سريرية ومحاسبية | **لا يظهر للمريض أبدًا بهويته الكتالوجية** — copy obligation 6/8؛ يظهر فقط أثره العملي ضمن `CMP-CLINICAL-001` | "بند الإجراء (تفصيلي)" | نفس صياغة العيادة |
| Price Display Mode | نمط عرض سعر محكوم (مجاني/ثابت/بداية/نطاق/يتطلب خطة) | يُترجم إلى الصياغة العملية المطابقة — `TXT-PLATFORM-013` القاعدة 1 | نفس صياغة المريض، مع اسم النمط الداخلي متاحًا للمرجعية فقط | نفس صياغة العيادة |
| Market Observation | دليل حوكمة أسعار محلية، ليس تعرفة | **لا يظهر للمريض إطلاقًا** | "رصد سوقي" (أداة إدخال بيانات، لا تُعرض كسعر مرجعي للمريض) | "رصد سوقي" مع مصدره وحوكمته الكاملة |
| Calibration State | هل يمكن تصنيف السعر أصلاً | **لا يظهر للمريض إطلاقًا** — يُترجم فقط إلى: هل يظهر سعر بداية أم لا | **لا يظهر كمصطلح** — يُترجم لنفس الأثر العملي | القيمة الداخلية الكاملة (`FINAL`/`CALIBRATING`/`PROVISIONAL`/`NOT_APPLICABLE`) لغرض الحوكمة فقط |
| Service Risk Level | تصنيف مخاطر سريرية على تعريف إجراء | يُترجم إلى أثره العملي فقط (مثال: تنبيه احترازي بلغة بسيطة)، **لا كحرف أو رمز** — copy obligation 6 | نفس صياغة المريض، مع تفصيل سريري إضافي حيث يخوَّل الطاقم | التصنيف الكامل لغرض الحوكمة |
| Production Ready | جاهزية معتمدة بعد بوابات الإطلاق | لا يظهر كمصطلح — أثره هو ظهور الخدمة أصلاً أو عدم ظهورها | "معتمد للإنتاج" / "غير معتمد بعد" — `TXT-STATE-CATALOG-002` | نفس صياغة العيادة |
| Scientific Grade / `S` | تصنيف علمي داخلي (A–D، F) | **لا يظهر الحرف نفسه إطلاقًا** — يُترجم فقط لأثره العملي إن وُجد أثر مسموح بالإفصاح عنه | **لا يظهر إلا ضمن سياق مهني موثّق ومصرَّح به صراحة**، وحتى حينها لا يُستخدم بديلاً عن `PENDING_EVALUATION` | القيمة الكاملة لغرض الحوكمة |
| Pricing Class / `P` | تصنيف سعري داخلي مرحلي | **لا يظهر إطلاقًا** — يحكم فقط ظهور سعر البداية أو غيابه | **لا يظهر** | القيمة الداخلية لغرض الحوكمة |
| Protection Level / `H` | تصنيف حماية داخلي غير ممول | يُترجم حصرًا إلى المعنى الشرطي الموثَّق — `TXT-PLATFORM-013` القاعدة 4 | نفس صياغة المريض | القيمة الداخلية لغرض الحوكمة |
| Risk Profile / `I` | تصنيف مخاطر مزوّد داخلي | **لا يظهر إطلاقًا، بأي شكل، على أي مستوى إفصاح** | **لا يظهر إطلاقًا** | القيمة الداخلية لغرض الحوكمة فقط |
| External Financial Event | سجل واقعة مالية خارجية | "حدث مالي" بلا أي إيحاء بحيازة مالية من المنصة | نفس صياغة المريض | نفس صياغة العيادة، مع تفاصيل السجل الكاملة |

**قاعدة عامة تحكم الجدول:** حيث يقول العمود "لا يظهر إطلاقًا"، فالغياب هيكلي وليس اجتهاد صياغة — يجب أن
لا يكون هناك أي مسار واجهة، بما فيه إفصاح متقدم (advanced disclosure) أو تكبير الشاشة، يكشف القيمة
للجمهور المذكور. هذا امتداد مباشر لالتزام Phase 2 "Patient-safe hiding of internal `P`, `I`, calibration
math, risk codes and professional discovery codes."

---

## TXT-PLATFORM-018 — Prohibitions master list

القائمة الكاملة لما لا يُقال أبدًا، مجمَّعة من كل مصدر كنسي، لأنها القسم الذي تعتمد عليه مراجعة أي نص
جديد في هذا المنتج:

1. **لا حرف مفرد (`S`/`P`/`H`/`I`/`R`) يظهر كتسمية أو جزء من تسمية حالة أو تصنيف، على أي جمهور** — copy
   obligation 6؛ `F` تحديدًا لا تُستخدم أبدًا بديلاً لـ `PENDING_EVALUATION`.
2. **لا صياغة سعر تذكر متوسط سوق، متوسط مدينة، تعرفة، أو سعرًا موصى به** — copy obligation 5.
3. **لا نص يذكر أو يوحي بأن المنصة حازت مالًا أو دفعته أو أمّنته أو استردته**، ولا أي عنصر محفظة/رصيد/شحن/
   سحب/استرداد منصة — copy obligation 9؛ Explicit Non-Goal 6.
4. **الحماية لا تُصاغ كتأمين أو تعويض مضمون أو نتيجة مضمونة** — copy obligation 10.
5. **لا سطر خطة علاجية بلا فئة وسبب معتمدين** — لا "رسوم إضافية"، "تسوية"، أو "أخرى" — copy obligation 7.
6. **إغلاق حجز بسبب انتهاء أو رفض بديل لا يُصاغ كإلغاء عقابي** — copy obligation 1.
7. **`ELIGIBILITY_REVIEW` لا تُصاغ كاتهام أو أمر بالحضور** — copy obligation 2.
8. **فشل نقل قابل لإعادة المحاولة لا يُصاغ كرفض دليل** — copy obligation 3.
9. **لا مصطلح تصنيف داخلي أو معايرة أو مخاطر يظهر بصيغته الداخلية للمريض**؛ حيث يتطلب متطلب كنسي إفصاحًا،
   يُترجم أثره العملي فقط — copy obligation 8.
10. **لا نص يوحي بوجود تجاوز صلاحية (override)**، ولا يسمّي مفتاح صلاحية داخليًا.
11. **لا وصف تفوّق غير موثَّق عن أي طبيب أو عيادة** ("الأفضل"، "موصى به" بلا مصدر معتمد).
12. **لا عنصر واجهة يعرض نقاطًا أو درجة أو تصنيفًا مركَّبًا من حساب المنصة الداخلي**، ولا علامة "الأفضل
    قيمة" مُستنتَجة.
13. **إجراء لا رجعة فيه لا يُصاغ بالنبرة أو اللون وحده** — يُذكر بالكلمات دائمًا — `TXT-PLATFORM-012`.
14. **لا رمز خطأ داخلي، أثر مكدس، خطأ SQL، اسم صنف داخلي، أو بيانات اعتماد مزوّد يظهر للمستخدم** —
    `docs/api/ERROR_CATALOG.md` §14.
15. **لا إيموجي في أي موقع، بأي صيغة** — أيقونة حقيقية من المجموعة المعتمدة أو كلمات صريحة فقط.
16. **لا اللون وحده لنقل حالة أو خطأ أو حماية أو أهلية أو استعجال** — القناة غير اللونية (أيقونة + نص)
    إلزامية دومًا، مُنفَّذة هيكليًا عبر ثلاثية الحالة في `semantic.state.json`.

---

## TXT-PLATFORM-019 — Structural state and archetype copy

يبني على `TXT-PLATFORM-007`/`-008` لكل نمط أرشيتايب (dashboard, list-and-detail, form, workspace,
detail):

- **form:** خطأ التحقق مرتبط بالحقل دائمًا؛ حفظ كمسودة متاح لأي نموذج طويل — `TXT-PLATFORM-005`،
  `IX-PLATFORM-005`.
- **list-and-detail:** فارغ حقيقي مقابل فارغ بالفلتر يُميَّزان دومًا — `TXT-PLATFORM-007`؛ حد أقصى على
  عدد الصفوف المعروضة يُذكر صراحة، لا يُخفى كأنه العدد الكلي — `CMP-PLATFORM-006`.
- **detail:** ملخص الحالة (`CMP-PLATFORM-002`) يحمل السبب المتحكم ووقت التقييم والإجراء المتاح معًا، لا
  الحالة وحدها.
- **dashboard:** أي مقياس بلا أساس مقارنة لا يُعرض بمفرده؛ التحديث الأخير يُذكر وقته دومًا.
- **workspace:** كثافة العرض لا تُقلَّص أبدًا دون هدف تفاعلي حقيقي؛ لا اختصار في نص الخطأ أو التحذير حتى
  في السياقات الكثيفة.

---

## TXT-PLATFORM-020 — Arabic mechanics: numerals, dates, and bidirectional content

- **الأرقام:** أرقام غربية (Western/tabular) لكل قيمة عددية — مبالغ، تواريخ، أوقات، عدّادات — كي لا
  تتغيّر عرضًا أثناء العد التنازلي أو التحديث، ومتوافقة مع `IX-PLATFORM-010`.
- **العزل ثنائي الاتجاه (bidi isolation):** أي رمز خدمة، رقم نسخة، مبلغ مع رمز عملة، تاريخ، أو اسم عيادة
  لاتيني داخل نص عربي يُعزَل اتجاهيًا حتى لا يُعاد ترتيبه — إعادة ترتيب رمز أو مبلغ هي **رمز أو مبلغ خاطئ**،
  لا عيبًا بصريًا فقط.
- **اسم الملف:** يُقتطَع من المنتصف عند الحاجة، مع الحفاظ على الامتداد ظاهرًا، ويُعزَل اتجاهيًا كذلك —
  `IX-PLATFORM-006`.
- **الوقت المتبقي/المطلق:** يُعرض بأرقام تصفيفية ثابتة العرض (tabular lining) كي لا يتحرك النص أثناء العد
  — `IX-BOOKING-001`.

---

## TXT-PLATFORM-021 — Capitalization and mechanics (Arabic equivalent of the house style)

`content/voice-tone.md`'s sentence-case/no-terminal-punctuation/Oxford-comma rules are Latin-specific and
do not map onto Arabic script one-to-one. This product's equivalents:

- **لا علامة ترقيم ختامية** على تسميات الأزرار، التسميات، أو التلميحات ذات الجملة الواحدة. الفقرات
  متعددة الجمل (رسائل خطأ، تأكيدات حساسة) تستخدم النقطة بشكل طبيعي.
- **لا تشكيل (تنقيط/حركات) في نصوص الواجهة** — الفصحى المعيارية غير المُشكَّلة هي المعيار، متسقة مع
  الطبقة الشرعية القانونية والرسمية دون ثقل بصري إضافي.
- **لا اختصارات عامية أو لهجية.** الصياغة فصحى معيارية معتدلة الرسمية — مباشرة دون جفاف بيروقراطي.
- **الفاصلة العربية (،) لا الفاصلة اللاتينية (,)** في كل نص عربي؛ علامة الاستفهام العربية (؟) في كل جملة
  استفهامية عربية.
- **لا استعارات قد لا تُترجم أو تحمل دلالة استبعادية** — نفس مبدأ `content/voice-tone.md` القسم الشامل،
  مع أهمية أعلى هنا لتعدد اللهجات بين قراء عربية فصحى من خلفيات متفاوتة.

---

## 4. Surface vocabulary — pointer, not a second copy

The full Profile C / Profile A surface mapping for all 21 `ERR-*` codes lives in
`CONTENT_GUIDE_ERRORS.md`'s panel-native surface table, which closes the gap the implementation plan
section 8.4 recorded. It is not repeated here to avoid the exact two-copies-of-one-fact problem this
file exists to prevent.

## 5. Traceability

Every `TXT-PLATFORM-*` rule above names the copy obligation, `CMP-*`, or `IX-*` it enforces inline,
rather than in a separate table, because the source is what makes each rule legible on its own. Every
one of the 82 statuses in `CONTENT_GUIDE_STATES.md` and all 21 error families in
`CONTENT_GUIDE_ERRORS.md` traces back to at least one rule in this file.

## 6. What this session did not do

- **No component architecture, token, or interaction-pattern change.** This session found no direct
  contradiction between the existing `CMP-*`/`IX-*` system and the content obligations it needed to
  cover; every rule above builds on, and cites, the existing blocks rather than replacing any of them.
- **No `docs/README.md` registry edit.** The implementation plan section 15 assigns the `TXT-*`/`WF-*`/
  `CMP-*`/`IX-*` registry-line correction to Session 7, batched with the other corrections recorded in
  section 16, so that `docs/README.md` changes exactly once within its line budget rather than once per
  session. This session's `TXT-*` identifiers are not tracked by `docs/scripts/validate_docs.py`'s
  registry check (`TXT` is not one of its tracked prefixes), so no registry gate depends on this edit
  happening now.
- **No accessibility (`A11Y-*`) work beyond what the content rules above already require** — per the
  session brief, accessibility is Session 5.
- **No per-screen final copy.** Every string above is a family-level rule or table, not a placed string
  on a numbered screen — that binding is Phase 4's `WIDGET_SPECS`/`SCREEN_SPECS` work.
