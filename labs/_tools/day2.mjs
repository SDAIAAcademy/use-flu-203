// Day 2 of the Ghiras file pack: the AI answer with 12 citations (real scholarly records with
// planted faults), the ten public documents, the twenty test questions with the recorded answers
// of the notebook, and the files of the reporting lab.
import { F } from "./day1.mjs";

// ---------------------------------------------------------------- lab 2.1: twelve citations
// "as cited" is what the answer prints. "record" is what the registers returned on 2026-11-17.
export const SNAPSHOT_DATE = "17 نوفمبر 2026";
export const citations = [
  { n: 1, claim: "في المكسيك انخفضت مشتريات المشروبات الخاضعة للضريبة 6% في المتوسط خلال عام 2014، وبلغ الانخفاض 12% في ديسمبر من العام نفسه.",
    cited: "Colchero MA, Popkin BM, Rivera JA, Ng SW. Beverage purchases from stores in Mexico under the excise tax on sugar sweetened beverages: observational study. BMJ. 2016;352:h6704.", doi: "10.1136/bmj.h6704",
    record: { title: "Beverage purchases from stores in Mexico under the excise tax on sugar sweetened beverages: observational study", first: "Colchero", journal: "BMJ", year: 2016 },
    says: "الملخص: انخفضت مشتريات المشروبات الخاضعة للضريبة 6% في المتوسط عام 2014، ووصل الانخفاض إلى 12% في ديسمبر 2014، مقارنة بما كان متوقعًا دون الضريبة. دراسة رصدية.",
    fault: null, verdict: "سليم", decision: "يُعتمد، ويُكتب «ارتبطت الضريبة بـ» لأن الدراسة رصدية" },
  { n: 2, claim: "وخلصت مراجعة منهجية إلى أن كل ضريبة بنسبة 10% تخفض المشتريات والاستهلاك 20%.",
    cited: "Teng AM, Jones AC, Mizdrak A, Signal L, Genç M, Wilson N. Impact of sugar-sweetened beverage taxes on purchases and dietary intake: systematic review and meta-analysis. Obesity Reviews. 2019;20(9):1187-1204.", doi: "10.1111/obr.12868",
    record: { title: "Impact of sugar-sweetened beverage taxes on purchases and dietary intake: Systematic review and meta-analysis", first: "Teng", journal: "Obesity Reviews", year: 2019 },
    says: "الملخص: ضريبة تعادل 10% ارتبطت بانخفاض متوسطه 10.0% في المشتريات والاستهلاك (فترة الثقة 95%: من 5.0% إلى 14.7%)، مع تباين كبير بين الدراسات.",
    fault: "رقم محرَّف", verdict: "معيب: الدعم", decision: "يُصحَّح الرقم إلى 10.0% مع فترة الثقة" },
  { n: 3, claim: "وفي المملكة انخفض حجم مبيعات المشروبات الغازية 35% مقارنة بدول الخليج العربي الأخرى بعد ضريبة انتقائية بنسبة 50%.",
    cited: "Alsukait R, Wilde P, Bleich SN, Singh G, Folta SC. Evaluating Saudi Arabia's 50% carbonated drink excise tax: Changes in prices and volume sales. Economics & Human Biology. 2020;38:100868.", doi: "10.1016/j.ehb.2020.100868",
    record: { title: "Evaluating Saudi Arabia’s 50% carbonated drink excise tax: Changes in prices and volume sales", first: "Alsukait", journal: "Economics & Human Biology", year: 2020 },
    says: "أبرز النتائج: ضريبة انتقائية 50% على المشروبات الغازية عام 2017، وانخفض حجم مبيعاتها 35% مقارنة بدول الخليج العربي الأخرى.",
    fault: null, verdict: "سليم", decision: "يُعتمد" },
  { n: 4, claim: "وفي تجربة عنقودية في مدارس ابتدائية ألمانية انخفض خطر زيادة الوزن 31% في مدارس وُفّرت فيها نوافير الماء مع دروس توعية.",
    cited: "Muckelbauer R, Libuda L, Clausen K, Toschke AM, Reinehr T, Kersting M. Promotion and provision of drinking water in schools for overweight prevention: randomized, controlled cluster trial. Pediatrics. 2009;123(4):e661-e667.", doi: "10.1542/peds.2008-2186",
    record: { title: "Promotion and Provision of Drinking Water in Schools for Overweight Prevention: Randomized, Controlled Cluster Trial", first: "Muckelbauer", journal: "Pediatrics", year: 2009 },
    says: "الملخص: 32 مدرسة ابتدائية في مدينتين ألمانيتين، وانخفض خطر زيادة الوزن 31% في مجموعة التدخل. لم يختلف تغير مؤشر كتلة الجسم المعياري بين المجموعتين، ولم يظهر أثر في استهلاك العصائر والمشروبات الغازية.",
    fault: null, verdict: "سليم", decision: "يُعتمد، مع ذكر أن استهلاك العصائر لم يتغير" },
  { n: 5, claim: "وارتبط تركيب برادات الماء في مدارس مدينة نيويورك بانخفاض طفيف في مؤشر كتلة الجسم المعياري: 0.025 للبنين و0.022 للبنات.",
    cited: "Schwartz AE, Leardo M, Aneja S, Elbel B. Effect of a School-Based Water Intervention on Child Body Mass Index and Obesity. JAMA Pediatrics. 2016;170(3):220-226.", doi: "10.1001/jamapediatrics.2015.3778",
    record: { title: "Effect of a School-Based Water Intervention on Child Body Mass Index and Obesity", first: "Schwartz", journal: "JAMA Pediatrics", year: 2016 },
    says: "الملخص: دراسة شبه تجريبية في 1,227 مدرسة، وارتبط تركيب البرادات بانخفاض 0.025 في مؤشر كتلة الجسم المعياري للبنين و0.022 للبنات.",
    fault: null, verdict: "سليم", decision: "يُعتمد" },
  { n: 6, claim: "وأظهرت دراسة أن العلامات الجاذبة على الأطعمة الصحية تغيّر اختيارات أطفال المدارس بين 8 و11 سنة.",
    cited: "Wansink B, Just DR, Payne CR. Can Branding Improve School Lunches? Archives of Pediatrics & Adolescent Medicine. 2012;166(10):967-968.", doi: "10.1001/archpediatrics.2012.999",
    record: { title: "RETRACTED: Can Branding Improve School Lunches?", first: "Wansink", journal: "Archives of Pediatrics & Adolescent Medicine", year: 2012, retracted: true },
    says: "السجل: العنوان يبدأ بكلمة RETRACTED، وللمقال إشعارا سحب مسجلان عام 2017.",
    fault: "ورقة مسحوبة", verdict: "معيب: النسبة", decision: "يُحذف الادعاء: لا يُستشهد بورقة مسحوبة دليلًا" },
  { n: 7, claim: "وفي مراجعة منهجية خفضت معايير الأطعمة والمشروبات التنافسية في المدارس تناول المشروبات المحلاة 0.18 حصة يوميًا.",
    cited: "Mozaffarian D, et al. Effectiveness of school food environment policies on children's dietary behaviors. The Lancet. 2018;391:1205-1214.", doi: "10.1371/journal.pone.0194555",
    record: { title: "Effectiveness of school food environment policies on children’s dietary behaviors: A systematic review and meta-analysis", first: "Micha", journal: "PLOS ONE", year: 2018 },
    says: "السجل: المؤلف الأول Micha والمجلة PLOS ONE، وMozaffarian آخر المؤلفين. الملخص يدعم الرقم: 0.18 حصة يوميًا.",
    fault: "نسبة خاطئة: المؤلف الأول والمجلة", verdict: "معيب: النسبة", decision: "يُصحَّح الاستشهاد إلى Micha وزملائها في PLOS ONE، والادعاء يبقى" },
  { n: 8, claim: "وفي تجربة في ثلاث مدن خليجية انخفض تناول السكريات الحرة 27% في مدارس اقتصرت مشروباتها على الماء.",
    cited: "Al-Mansouri K, Whitfield J. Water-only beverage policies and free sugar intake among secondary school students: a cluster randomised trial in three Gulf cities. Journal of School Nutrition and Health. 2021;9(3):201-214.", doi: "10.1016/j.jsnh.2021.03.014",
    record: null,
    says: "المعرِّف لا ينحلّ، والبحث بالعنوان كاملًا في Crossref وOpenAlex لا يجد المقال ولا المجلة.",
    fault: "مرجع مختلق", verdict: "معيب: الوجود", decision: "يُحذف الادعاء ومرجعه" },
  { n: 9, claim: "وفي الولايات المتحدة خفّض حظر جميع المشروبات المحلاة في المدارس المتوسطة استهلاك الطلاب الكلي لها.",
    cited: "Taber DR, Chriqui JF, Powell LM, Chaloupka FJ. Banning all sugar-sweetened beverages in middle schools: reduction of in-school access and purchasing but not overall consumption. Archives of Pediatrics & Adolescent Medicine. 2012;166(3):256-262.", doi: "10.1001/archpediatrics.2011.200",
    record: { title: "Banning All Sugar-Sweetened Beverages in Middle Schools", first: "Taber", journal: "Archives of Pediatrics & Adolescent Medicine", year: 2012 },
    says: "العنوان نفسه يقول: انخفاض الوصول والشراء داخل المدرسة، لا الاستهلاك الكلي. الملخص: دراسة مقطعية في 40 ولاية، والاستهلاك الكلي لم يرتبط بسياسة الولاية.",
    fault: "المصدر يقول عكس الادعاء", verdict: "معيب: الدعم", decision: "يُعاد كتابة الادعاء: قلّ الوصول والشراء داخل المدرسة، ولم يقل الاستهلاك الكلي" },
  { n: 10, claim: "وتقول إرشادات منظمة الصحة العالمية: «توصي المنظمة بمنع بيع جميع المشروبات المحلاة في المدارس».",
    cited: "World Health Organization. Guideline: sugars intake for adults and children. Geneva: WHO; 2015. ISBN 978-92-4-154902-8.", url: "https://www.who.int/publications/i/item/9789241549028",
    record: { title: "Guideline: sugars intake for adults and children", first: "World Health Organization", journal: "WHO", year: 2015 },
    says: "صفحة الإرشاد: توصيات عن مقدار السكريات الحرة (أقل من 10% من مجموع الطاقة، وأقل من 5% لفائدة إضافية). لا تَرِد فيها الجملة المنسوبة.",
    fault: "اقتباس لا يوجد في المصدر", verdict: "معيب: الدعم", decision: "يُحذف الاقتباس، ويُكتب ما توصي به المنظمة فعلًا" },
  { n: 11, claim: "واستمر انخفاض تناول طلاب المدارس للسكر في المكسيك بعد عامين من الضريبة.",
    cited: "Colchero MA, Popkin BM, Rivera JA, Ng SW. Sustained reductions in school-age sugar intake two years after the Mexican beverage tax. BMJ. 2017;356:j1123.", doi: "10.1136/bmj.j1123",
    record: { title: "Half of NHS doctors trained in other EU countries are considering quitting UK, warns GMC", first: "O’Dowd", journal: "BMJ", year: 2017 },
    says: "المعرِّف ينحلّ إلى خبر آخر في BMJ عن أطباء في بريطانيا. للمؤلفين أنفسهم مقال حقيقي في Health Affairs عام 2017 عن استمرار استجابة المستهلكين بعد عامين (10.1377/hlthaff.2016.1231)، وليس عن طلاب المدارس.",
    fault: "مرجع مركَّب: مؤلفون حقيقيون وعنوان مختلق ومعرِّف لمقال آخر", verdict: "معيب: الوجود", decision: "يُحذف، أو يُستبدل بالمقال الحقيقي بعد قراءته وإعادة كتابة الادعاء" },
  { n: 12, claim: "وقال مدير إدارة التغذية في المنظمة، د. فرانشيسكو برانكا، عام 2015: «لدينا دليل متين على أن إبقاء السكريات الحرة دون 10% من مجموع الطاقة يقلل خطر زيادة الوزن والسمنة وتسوس الأسنان».",
    cited: "World Health Organization. WHO calls on countries to reduce sugars intake among adults and children. News release, 4 March 2015.", url: "https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children",
    record: { title: "WHO calls on countries to reduce sugars intake among adults and children", first: "World Health Organization", journal: "WHO", year: 2015 },
    says: "البيان الصحفي فيه الاقتباس نفسه بالإنجليزية منسوبًا إلى Dr Francesco Branca. الترجمة العربية في الإجابة أمينة.",
    fault: null, verdict: "سليم", decision: "يُعتمد، ويُذكر أن النص مترجم" },
];
// What the checker looks for in the live page of the two WHO citations
export const WHO_QUOTE_EN = "We have solid evidence that keeping intake of free sugars to less than 10% of total energy intake reduces the risk of overweight, obesity and tooth decay";

export const aiAnswer = `# سؤال إلى المساعد «مُنقِّب»

**السؤال:** ما الدليل على أن تقييد المشروبات المحلاة، بالمنع في المدارس أو بالضريبة، يقلل ما يستهلكه الأطفال من السكر؟

*إجابة تدريبية: فيها اثنا عشر استشهادًا، بعضها سليم وبعضها مختلق أو منسوب خطأً أو لا يدعم ما نُسب إليه. المراجع الحقيقية فيها تُفحص على السجلات العلمية الحقيقية.*

*كل خطأ في هذه الإجابة من صنع المساعد الافتراضي «مُنقِّب» وحده، لا من المؤلفين ولا من المجلات ولا من الجهات المذكورة فيها.*

## الإجابة

${citations.map(c => `${c.claim} [${c.n}]`).join("\n\n")}

## المراجع

${citations.map(c => `${c.n}. ${c.cited} ${c.doi ? "doi:" + c.doi : c.url}`).join("\n")}
`;

export const lookupSnapshot = `# ما أعادته السجلات: نسخة محفوظة بتاريخ ${SNAPSHOT_DATE}

للاستخدام حين لا تتاح الشبكة في القاعة. المصدر: حلّ المعرِّف في doi.org، وسجل Crossref، وملخصات PubMed وOpenAlex، وموقع منظمة الصحة العالمية. عمود «ما يقوله المصدر» تلخيص بالعربية، لا نص المصدر.

| # | المعرِّف أو الرابط | ما أعاده السجل | ما يقوله المصدر |
|---|---|---|---|
${citations.map(c => `| ${c.n} | ${c.doi || c.url} | ${c.record ? `${c.record.first}، ${c.record.journal}، ${c.record.year}: ${c.record.title}` : "لا ينحلّ: لا سجل بهذا المعرِّف"} | ${c.says} |`).join("\n")}
`;

// ---------------------------------------------------------------- labs 2.2 and 2.3: ten public documents
const doc = (id, file, title, status, paras) => ({ id, file, title, status, paras });
export const docs = [
  doc("D01", "D01_canteen_standard_2023.md", `معيار المقاصف المدرسية ${F.std23.no}`, `صدر في ${F.std23.date} · ملغى منذ ${F.std25.date}`, [
    `يُسمح ببيع العصائر والمشروبات المنكّهة إذا لم يزد السكر فيها على ${F.std23.sugar} غ لكل 100 مل، وفي عبوات لا تتجاوز ${F.std23.pack} مل.`,
    "يُمنع بيع مشروبات الطاقة في جميع المراحل.",
    "يوفّر المقصف ماء الشرب المعبأ بسعر لا يزيد على سعر أرخص مشروب آخر."]),
  doc("D02", "D02_canteen_standard_2025.md", `معيار المقاصف المدرسية ${F.std25.no}`, `نافذ من ${F.std25.date} · يلغي المعيار ${F.std23.no}`, [
    `يُسمح ببيع العصائر والمشروبات المنكّهة إذا لم يزد السكر فيها على ${F.std25.sugar} غ لكل 100 مل، وفي عبوات لا تتجاوز ${F.std25.pack} مل.`,
    "يُمنع بيع المشروبات الغازية ومشروبات الطاقة في جميع المراحل.",
    `توفّر المدرسة براد ماء واحدًا على الأقل لكل ${F.std25.cooler} طالبًا.`]),
  doc("D03", "D03_canteen_programme_report_2024.md", "التقرير السنوي لبرنامج المقاصف المدرسية 2024", "نُشر في فبراير 2025", [
    `أشرف البرنامج في عام 2024 على ${F.canteens.toLocaleString("en")} مقصفًا مدرسيًا يخدم ${F.students.toLocaleString("en")} طالب وطالبة.`,
    `نفّذ مراقبو البرنامج ${F.visits.toLocaleString("en")} زيارة تفتيش، وبلغت نسبة الالتزام بالمعيار ${F.compliance}%، وسُجّلت ${F.violations} مخالفة.`,
    `تمثل المشروبات ${F.revenueShare}% من إيرادات المقاصف.`]),
  doc("D04", "D04_student_health_survey_2024.md", "مسح صحة الطلاب 2024: ملخص النتائج", `الهيئة العامة للإحصاء في ${F.region} · ديسمبر 2024`, [
    `شمل المسح ${F.survey.n.toLocaleString("en")} طالب وطالبة في ${F.survey.schools} مدرسة.`,
    `نسبة من يشربون مشروبًا محلّى مرة واحدة يوميًا على الأقل: ${F.survey.primary}% في المرحلة الابتدائية، و${F.survey.middle}% في المتوسطة، و${F.survey.secondary}% في الثانوية، و${F.survey.all}% في جميع المراحل.`,
    "المشروب المحلّى: كل مشروب أضيف إليه سكر، ومنه العصائر المحلاة والحليب المنكّه والمشروبات الغازية."]),
  doc("D05", "D05_water_coolers_circular.md", "تعميم: برادات الماء في المدارس", "تعميم رقم GH-C-2025-31 · أكتوبر 2025", [
    `رُكّب حتى تاريخ هذا التعميم ${F.coolers.toLocaleString("en")} برادًا للماء في ${F.coolerSchools.toLocaleString("en")} مدرسة، أي ${F.coolerPct}% من المدارس.`,
    "تُستكمل التغطية في جميع المدارس قبل نهاية العام الدراسي 2026/2027.",
    "تُفحص جودة الماء في كل براد مرة كل فصل دراسي."]),
  doc("D06", "D06_parents_faq.md", "أسئلة أولياء الأمور الشائعة عن المقاصف", "صفحة عامة · حُدّثت في سبتمبر 2025", [
    `هل يُباع العصير الطبيعي؟ نعم، إذا كان بلا سكر مضاف وفي عبوة لا تتجاوز ${F.std25.pack} مل.`,
    "هل يُمنع الطالب من إحضار مشروبه من البيت؟ لا. المعيار ينظّم ما يُباع في المقصف، لا ما يحضره الطالب.",
    "كيف أبلّغ عن مقصف مخالف؟ عبر نموذج البلاغات في موقع الهيئة."]),
  doc("D07", "D07_operators_open_meeting.md", "محضر اللقاء المفتوح مع مشغلي المقاصف", "لقاء عام · نوفمبر 2025", [
    `حضر اللقاء ${F.operators} مشغلًا.`,
    `في استطلاع أُجري في اللقاء توقّع ${F.operatorsWorried}% من المشغلين الحاضرين انخفاض إيراداتهم إن مُنعت العصائر المحلاة.`,
    "اقترح المشغلون فترة انتقالية مدتها فصل دراسي واحد."]),
  doc("D08", "D08_violations_regulation.md", "لائحة مخالفات المقاصف وجزاءاتها GH-REG-2024-01", "نافذة منذ يناير 2024", [
    "المخالفة الأولى: إنذار كتابي.",
    `المخالفة الثانية: غرامة قدرها ${F.fine2.toLocaleString("en")} ريال.`,
    "المخالفة الثالثة: إيقاف التعاقد مع المشغل."]),
  doc("D09", "D09_open_data_drink_sales_2024.md", "نشرة البيانات المفتوحة: مبيعات مشروبات المقاصف 2024", "بوابة البيانات المفتوحة · مارس 2025", [
    "بلغ مجموع المبيعات 18.6 مليون عبوة في عام 2024.",
    "حصة كل صنف من العبوات المبيعة: الماء 41%، والعصائر المحلاة 27%، والحليب المنكّه 14%، والحليب غير المحلّى 9%، والعصائر بلا سكر مضاف 9%.",
    "البيانات من أنظمة البيع في المقاصف، ولا تشمل ما يحضره الطلاب من البيت."]),
  doc("D10", "D10_publication_and_disclosure_policy.md", "سياسة النشر والإفصاح في هيئة غِراس", "نافذة منذ يونيو 2025", [
    "كل ما يُنشر في بوابة البيانات المفتوحة وفي موقع الهيئة مصنف «عام».",
    "لا تُدخل البيانات الشخصية ولا البيانات المصنفة «مقيد» فأعلى في أي أداة خارجية، ومنها أدوات الذكاء الاصطناعي.",
    "كل محتوى استُعين في إعداده بالذكاء الاصطناعي يحمل سطر إفصاح يذكر الأداة وما راجعه الموظف."]),
];
export const docText = d => `# ${d.title}

*${d.status} · هيئة غِراس للصحة المدرسية · مستند عام اصطناعي لأغراض التدريب*

${d.paras.join("\n\n")}
`;

// Twenty test questions. gold = the document and paragraph that hold the answer (null: not in the
// documents). rec = the recorded answer of the notebook «رَفّ»: its text, the document it cited and
// the passage it showed. keys = what the answer claims, as strings that must be in the passage.
const NO = "لا أجد جوابًا عن هذا السؤال في المصادر المحمّلة.";
const p = (d, i) => docs.find(x => x.id === d).paras[i];
const q = (text, gold, rec, expect, why = "") => ({ text, gold, rec, expect, why });
export const questions = [
  q("كم مقصفًا مدرسيًا يشرف عليه البرنامج؟", ["D03", 0], { a: `${F.canteens.toLocaleString("en")} مقصفًا مدرسيًا.`, d: "D03", pass: p("D03", 0), keys: ["1,240"] }, "مدعوم"),
  q("كم زيارة تفتيش نُفّذت في عام 2024؟", ["D03", 1], { a: `${F.visits.toLocaleString("en")} زيارة تفتيش.`, d: "D03", pass: p("D03", 1), keys: ["3,720"] }, "مدعوم"),
  q("ما نسبة الالتزام بالمعيار في عام 2024؟", ["D03", 1], { a: "بلغت نسبة الالتزام بالمعيار 68%.", d: "D03", pass: p("D03", 1), keys: ["68%"] }, "غير مدعوم", "الرقم في الإجابة 68% والمقطع يقول 86%: رقمان مقلوبان"),
  q("ما الحد الأعلى للسكر في العصائر المسموح ببيعها؟", ["D02", 0], { a: `${F.std23.sugar} غ لكل 100 مل.`, d: "D01", pass: p("D01", 0), keys: ["10 غ لكل 100 مل"] }, "مدعوم", "المقطع يدعم الإجابة، لكن المستند ملغى: المعيار النافذ يقول 5 غ. الدعم لا يعني الصحة"),
  q("ما أكبر عبوة عصير يُسمح ببيعها اليوم؟", ["D02", 0], { a: `${F.std25.pack} مل.`, d: "D02", pass: p("D02", 0), keys: ["200 مل"] }, "مدعوم"),
  q("هل يُسمح ببيع المشروبات الغازية في المقاصف؟", ["D02", 1], { a: "لا. يُمنع بيع المشروبات الغازية ومشروبات الطاقة في جميع المراحل.", d: "D02", pass: p("D02", 1), keys: ["المشروبات الغازية", "جميع المراحل"] }, "مدعوم"),
  q("كم برادًا للماء رُكّب، وفي كم مدرسة؟", ["D05", 0], { a: `${F.coolers.toLocaleString("en")} برادًا في ${F.coolerSchools.toLocaleString("en")} مدرسة، بتكلفة بلغت 4 ملايين ريال.`, d: "D05", pass: p("D05", 0), keys: ["2,150", "1,010", "4 ملايين ريال"] }, "مدعوم جزئيًا", "العددان في المقطع، والتكلفة ليست فيه ولا في أي مستند"),
  q("متى تكتمل تغطية المدارس ببرادات الماء؟", ["D05", 1], { a: "قبل نهاية العام الدراسي 2026/2027.", d: "D05", pass: p("D05", 1), keys: ["2026/2027"] }, "مدعوم"),
  q("ما نسبة الطلاب الذين يشربون مشروبًا محلّى يوميًا؟", ["D04", 1], { a: `${F.survey.secondary}% من الطلاب يشربون مشروبًا محلّى يوميًا.`, d: "D04", pass: p("D04", 1), keys: ["31.4%", "من الطلاب يشربون"] }, "مدعوم جزئيًا", "الرقم في المقطع لكنه للمرحلة الثانوية وحدها، ونسبة جميع المراحل 24.8%: سقط النطاق"),
  q("كيف يعرّف المسح المشروب المحلّى؟", ["D04", 2], { a: "كل مشروب أضيف إليه سكر، ومنه العصائر المحلاة والحليب المنكّه والمشروبات الغازية.", d: "D04", pass: p("D04", 2), keys: ["أضيف إليه سكر", "الحليب المنكّه"] }, "مدعوم"),
  q("ما عقوبة المخالفة الثانية؟", ["D08", 1], { a: `غرامة قدرها ${F.fine2.toLocaleString("en")} ريال.`, d: "D06", pass: p("D06", 2), keys: ["2,000 ريال"] }, "غير مدعوم", "الإجابة صحيحة لكن المقطع المستشهد به عن نموذج البلاغات: الاستشهاد يشير إلى مستند آخر، والجواب في لائحة المخالفات"),
  q("ما عقوبة المخالفة الثالثة؟", ["D08", 2], { a: "إيقاف التعاقد مع المشغل.", d: "D08", pass: p("D08", 2), keys: ["إيقاف التعاقد"] }, "مدعوم"),
  q("ما حصة الماء من مبيعات المشروبات في عام 2024؟", ["D09", 1], { a: "41% من العبوات المبيعة.", d: "D09", pass: p("D09", 1), keys: ["41%"] }, "مدعوم"),
  q("ما رأي مشغلي المقاصف في أثر المنع في إيراداتهم؟", ["D07", 1], { a: `سيخسر ${F.operatorsWorried}% من المشغلين إيراداتهم عند المنع.`, d: "D07", pass: p("D07", 1), keys: ["71%", "سيخسر"] }, "مدعوم جزئيًا", "النسبة في المقطع، لكنها توقّع المشغلين الحاضرين في استطلاع، لا خسارة مؤكدة: تغيّرت درجة اليقين والمقام"),
  q("ما الفترة الانتقالية التي اقترحها المشغلون؟", ["D07", 2], { a: "فصل دراسي واحد.", d: "D07", pass: p("D07", 2), keys: ["فصل دراسي واحد"] }, "مدعوم"),
  q("هل يُمنع الطالب من إحضار مشروبه من البيت؟", ["D06", 1], { a: "لا. المعيار ينظّم ما يُباع في المقصف، لا ما يحضره الطالب.", d: "D06", pass: p("D06", 1), keys: ["ما يُباع في المقصف"] }, "مدعوم"),
  q("هل يجوز إدخال قوائم التفتيش المصنفة «مقيد» في أداة ذكاء اصطناعي خارجية؟", ["D10", 1], { a: "لا. لا تُدخل البيانات المصنفة «مقيد» فأعلى في أي أداة خارجية، ومنها أدوات الذكاء الاصطناعي.", d: "D10", pass: p("D10", 1), keys: ["مقيد", "أدوات الذكاء الاصطناعي"] }, "مدعوم"),
  q("كم طالبًا في مدارس المنطقة يعاني السمنة؟", null, { a: "تبلغ نسبة السمنة بين الطلاب 17%.", d: "D04", pass: p("D04", 0), keys: ["17%", "السمنة"] }, "غير مدعوم", "السؤال لا جواب له في المستندات، والمقطع المستشهد به عن حجم العينة: رقم مختلق كان الصواب فيه الامتناع"),
  q("كم يكلّف تطبيق قرار المنع في السنة الأولى؟", null, { a: NO, d: "", pass: "", keys: [] }, "امتناع صحيح"),
  q("ما رأي مجلس الإدارة في المقترح؟", null, { a: NO, d: "", pass: "", keys: [] }, "امتناع صحيح"),
].map((x, i) => ({ n: i + 1, ...x }));
export const REFUSAL = NO;

// ---------------------------------------------------------------- lab 2.4
export const findingsDraft = `# النتائج الرئيسية (مسودة المساعد «مُنقِّب»، قبل التحقق)

1. منع العصائر المحلاة في المقاصف يخفض استهلاك الطلاب للسكر ${F.headline}%.
2. حظر المشروبات المحلاة في المدارس يخفض استهلاك الطلاب الكلي لها، كما ثبت في الولايات المتحدة.
3. المعيار النافذ يسمح بعصائر لا يزيد سكرها على ${F.std23.sugar} غ لكل 100 مل.

المطلوب في المختبر 2.4: أعد كتابة كل نتيجة كما يدعمها سجل التحقق، واكتب لكل نتيجة إفادة ثقة.
`;

export const logHeader = ["#", "التاريخ", "الأداة أو الجلسة", "الادعاء", "من أين جاء", "المصدر الذي فُتح", "موضع الدليل", "القرار"];
export const logRows = [
  [1, "اليوم 1", "بحث معمق: المساعد «مُنقِّب»، جلسة واحدة", `المنع يخفض استهلاك السكر ${F.headline}%`, "تقرير المساعد، عن صحيفة المرفأ", "دراسة جامعة الأثل في المجلة الخليجية للصحة العامة", `جدول النتائج: من ${F.trial.before} غ إلى ${F.trial.after} غ، أي ${F.trial.drop}%، في سكر المشروبات خلال اليوم الدراسي`, "يُعدَّل: الرقم والنطاق"],
  [2, "اليوم 1", "قراءة الدراسة نفسها", "لا تغير دال في السكر في اليوم كله", "الدراسة", "دراسة جامعة الأثل", `جدول النتائج، السطر الثاني: ${F.trial.total}%، فرق غير دال`, "يُعتمد"],
  [3, "اليوم 1", "صفحة الأنظمة واللوائح في موقع الهيئة", `حد السكر ${F.std23.sugar} غ لكل 100 مل`, "تقرير المساعد", `المعيار ${F.std25.no}`, `المادة 4: ${F.std25.sugar} غ لكل 100 مل، والمعيار ${F.std23.no} ملغى`, "يُعدَّل: القاعدة تغيّرت"],
  [4, "اليوم 2", "doi.org وسجل Crossref", "حظر المشروبات المحلاة خفّض الاستهلاك الكلي", "إجابة المساعد، الاستشهاد 9", "Taber وزملاؤه 2012", "العنوان والملخص: قلّ الوصول والشراء داخل المدرسة، لا الاستهلاك الكلي", "يُعدَّل: المصدر يقول العكس"],
  [5, "اليوم 2", "doi.org وسجل Crossref", "تجربة في ثلاث مدن خليجية: انخفاض 27%", "إجابة المساعد، الاستشهاد 8", "لا شيء: المعرِّف لا ينحلّ", "لا سجل للمقال ولا للمجلة", "يُحذف: مرجع مختلق"],
  [6, "اليوم 2", "الدفتر «رَفّ»، عشرون سؤالًا", `${F.survey.secondary}% من الطلاب يشربون مشروبًا محلّى يوميًا`, "إجابة الدفتر عن السؤال 9", "مسح صحة الطلاب 2024", `الجدول: ${F.survey.secondary}% للثانوية و${F.survey.all}% لجميع المراحل`, "يُعدَّل: يُذكر النطاق"],
];
export const referenceFindings = [
  { finding: `في تجربة واحدة في ${F.trial.schools} مدرسة متوسطة، ارتبطت إزالة العصائر المحلاة من المقصف بانخفاض ${F.trial.drop}% في السكر المضاف من المشروبات خلال اليوم الدراسي، ولم يتغير ما يستهلكه الطلاب في يومهم كله تغيرًا دالًا.`,
    confidence: "متوسطة", why: "تجربة عشوائية محكّمة فُتحت وقُرئ جدولها، لكنها دراسة واحدة، لعام واحد ومرحلة واحدة، بسجل غذائي يملؤه الطالب.", change: "تجربة ثانية في مرحلة أخرى، أو قياس لسنتين.", log: [1, 2] },
  { finding: "في دراسة مقطعية أمريكية، ارتبط حظر جميع المشروبات المحلاة في المدارس المتوسطة بانخفاض الوصول إليها وشرائها داخل المدرسة، ولم يرتبط بانخفاض استهلاك الطلاب الكلي لها.",
    confidence: "منخفضة إلى متوسطة", why: "مصدر أصلي فُتح وقُرئ ملخصه، لكنه دراسة مقطعية لا تثبت سببية، من بلد آخر، وبياناتها من 2004 إلى 2007.", change: "دراسة بمجموعة مقارنة في بلد قريب من سياقنا.", log: [4, 5] },
  { finding: `المعيار النافذ ${F.std25.no} يسمح بعصائر لا يزيد سكرها على ${F.std25.sugar} غ لكل 100 مل، ويمنع المشروبات الغازية ومشروبات الطاقة.`,
    confidence: "عالية", why: "النص الرسمي النافذ من الجهة التي أصدرته، فُتح اليوم، وصفحة الأنظمة تؤكد إلغاء المعيار السابق.", change: "صدور معيار جديد: يُعاد فتح صفحة الأنظمة قبل التسليم.", log: [3] },
];
export const limitations = [
  "لم نجد دراسة منشورة من دول الخليج العربي عن أثر منع مشروبات المقاصف في الاستهلاك الكلي.",
  "أثر القرار في إيرادات المقاصف توقّع من المشغلين، لا قياس.",
  "لم يُبحث في قواعد بيانات مدفوعة، واقتصر البحث على العربية والإنجليزية.",
];
export const disclosure = "أُعدّ هذا الموجز بالاستعانة بمساعد للبحث المعمق وبدفتر مستند إلى المصادر. كل ادعاء أنتجته الأداتان مسجّل في سجل التحقق، وكل مصدر مستشهد به فُتح وقُرئ. المسؤولية عن المحتوى على معدّة الموجز.";

export const rawRequest = `ابحث لي عن أثر منع العصائر المحلاة في المدارس في استهلاك الطلاب للسكر.

للسياق: وصلتنا شكوى من ممرضة مدرسة ثانوية الأثل الثالثة عن الطالب راشد سالم البدراني (رقم الهوية 1098765432، مصاب بالسكري من النوع الأول) الذي اشترى ثلاث عبوات عصير من المقصف في يوم واحد.

وأرفقت لك قائمة التفتيش الداخلية المصنفة «مقيد» وفيها أسماء المقاصف المخالفة ومشغليها، لتستخرج منها أمثلة.

أريد تقريرًا من صفحتين بمصادره.
`;
export const cleanRequest = `ابحث عن أثر منع العصائر المحلاة في مقاصف المدارس في ما يستهلكه الطلاب من السكر المضاف، داخل المدرسة وفي يومهم كله.

النطاق: طلاب من 6 إلى 18 سنة، ودراسات منشورة منذ 2009 بالعربية والإنجليزية.
المصادر: دراسات محكّمة ومراجعات منهجية وإحصاءات رسمية منشورة للعموم. لكل ادعاء رقمي: المصدر الأصلي ورابطه.
المخرج: تقرير من صفحتين، وفي آخره قسم «ما لم نجد له دليلًا».
`;
export const PERSONAL = ["راشد سالم البدراني", "1098765432", "السكري", "قائمة التفتيش", "مقيد", "ثانوية الأثل الثالثة"];

export const verifiedBriefTemplate = `# موجز بحث متحقق منه

**السؤال والقرار:** (من موجز البحث: السؤال، والقرار الذي يستند إليه، وصاحبه)

## النتائج الرئيسية

| # | النتيجة كما يدعمها الدليل | درجة الثقة | سبب الدرجة | ما يغيّرها | أسطر السجل |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

## القيود المتبقية

(ما لم تجد له دليلًا، وما لم تبحث فيه، وما قد يكون تغيّر)

## المصادر

(كل مصدر فُتح وقُرئ، بمعرِّفه أو رابطه، وتاريخ فتحه، والنسخة المؤرشفة إن وُجدت)

## الإفصاح

(سطر واحد: الأدوات التي استُعين بها، وما راجعته بنفسك، ومن يتحمل المسؤولية عن المحتوى)

---
شرط النجاح: لا استشهاد مختلق ولا استشهاد لا يدعم ما نُسب إليه. المصادر عامة فقط.
`;
