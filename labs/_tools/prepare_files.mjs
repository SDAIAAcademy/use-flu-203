// Writes the Ghiras School Health Authority file pack (labs/files/) and the trainer's reference
// files (labs/solutions/reference/, labs/solutions/*.md).
//
//     node labs/_tools/prepare_files.mjs
//
// Deterministic: no clock, no network, and the only random numbers come from a fixed seed, so
// every participant and every answer key match. Everything about Ghiras is fictional.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as D1 from "./day1.mjs";
import * as D2 from "./day2.mjs";

const LABS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = path.join(LABS, "files");
const SOL = path.join(LABS, "solutions");
const REF = path.join(SOL, "reference");
const SEED = 1448;

let written = 0;
function write(base, rel, text) {
  const file = path.join(base, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.replace(/\r\n/g, "\n"), "utf8");
  written++;
}
// A spreadsheet opens a UTF-8 file with Arabic correctly only when it starts with a byte order mark
const csv = rows => "﻿" + rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
const mdTable = (head, rows) => `| ${head.join(" | ")} |\n|${head.map(() => "---").join("|")}|\n${rows.map(r => `| ${r.join(" | ")} |`).join("\n")}\n`;
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

for (const dir of [FILES, REF]) fs.rmSync(dir, { recursive: true, force: true });

// ------------------------------------------------------------ the case and lab 1.1
write(FILES, "case/policy_question.md", D1.policyQuestion);
write(FILES, "start/brief_draft_weak.md", D1.weakBrief);
write(FILES, "start/brief_template.md", D1.briefTemplate);
write(REF, "D1_1_brief.md", D1.referenceBrief);
write(REF, "D1_1_checklist.json", JSON.stringify(D1.checklist.map(([point, test]) => ({ point, test })), null, 2));

// ------------------------------------------------------------ lab 1.2
write(FILES, "report/deep_research_report.md", D1.report);
write(FILES, "start/claim_table.csv", csv([["#", "الادعاء", "النوع", "الفحص المخطط له"],
  ...D1.claims.map(c => [c.id, c.text, "", ""]),
  [], ["الأنواع الستة", D1.TYPES.join(" / ")], ...D1.TYPES.map(t => [t, D1.CHECKS[t]])]));
write(REF, "D1_2_claim_table.csv", csv([["#", "الادعاء", "النوع", "الفحص المخطط له"], ...D1.claims.map(c => [c.id, c.text, c.type, D1.CHECKS[c.type]])]));
write(REF, "D1_2_standin_types.json", JSON.stringify(Object.fromEntries(D1.claims.map(c => [c.id, D1.standinTypes[c.id] || c.type])), null, 2));

// ------------------------------------------------------------ labs 1.3 and 1.4: the closed web
const CSS = `body{font-family:"IBM Plex Sans Arabic","Segoe UI",Tahoma,sans-serif;max-width:46rem;margin:0 auto;padding:1rem;line-height:1.8;color:#1e2a36;background:#fbfaf7}
.bar{font-size:.85rem;background:#eef2f4;border:1px solid #d5dde2;border-radius:.4rem;padding:.4rem .8rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.site{color:#0f766e;font-weight:700;margin:1.2rem 0 0}h1{font-size:1.5rem;line-height:1.5;margin:.2rem 0 1rem}h2{font-size:1.1rem;margin:1.2rem 0 .3rem}
.meta{color:#5b6773;font-size:.9rem}.ad{border:1px dashed #b08900;padding:.5rem;color:#6b5300;font-size:.9rem}
table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{border:1px solid #cfd8dc;padding:.35rem .5rem;text-align:start;vertical-align:top}th{background:#eef2f4}
img{max-width:100%;height:auto;border:1px solid #cfd8dc}input{font:inherit;padding:.4rem;width:100%;box-sizing:border-box}li{margin:.3rem 0}.s{font-size:.8rem;color:#5b6773}`;
const page = (title, inner) => `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${CSS}</style></head>
<body>
<div class="bar"><span>شبكة تدريبية مغلقة · كل ما فيها اصطناعي</span><a href="index.html">صفحة البحث</a></div>
${inner}
</body>
</html>
`;
for (const pg of D1.pages)
  write(FILES, `web/${pg.file}`, page(`${pg.title} · ${pg.site}`, `<p class="site">${pg.site}</p>\n<h1>${pg.title}</h1>\n${pg.body}`));
write(FILES, "web/img/queue.svg", D1.queueSvg);
// The search page lists every page in a seeded order, so position says nothing about quality
const rand = rng(SEED);
const order = D1.pages.map(pg => [rand(), pg]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
write(FILES, "web/index.html", page("صفحة البحث · الشبكة المغلقة", `<h1>صفحة البحث في الشبكة المغلقة</h1>
<p>هذه الشبكة هي العالم كله في المختبرين 1.3 و1.4: ${D1.pages.length} صفحة. ما ليس فيها غير موجود. اكتب كلمة لتصفية القائمة.</p>
<p><input id="q" type="search" placeholder="ابحث باسم موقع أو جهة أو مجلة" aria-label="بحث"></p>
<ul id="r">
${order.map(pg => `<li><a href="${pg.file}">${pg.title}</a><br><span class="s">${pg.site}</span></li>`).join("\n")}
</ul>
<script>
const q = document.getElementById("q"), items = [...document.querySelectorAll("#r li")];
const norm = s => s.replace(/[\\u064B-\\u0652\\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();
q.addEventListener("input", () => { const v = norm(q.value.trim()); for (const li of items) li.hidden = v !== "" && !norm(li.textContent).includes(v); });
</script>`));

const src = n => D1.pages.find(pg => pg.s === n);
const logHead = ["#", "المصدر", "الصفحة", "من يقف خلفه؟", "ماذا يقول عنه غيره؟ (الدليل)", "الحكم على الموثوقية", "الأصل", "ما الذي تغيّر في الطريق؟"];
const JUDGEMENTS = "الأحكام: موثوق: مصدر أولي / موثوق مع تحفّظ (ناقل، أو صاحب مصلحة، أو مناصرة) / قديم: حلّ محله أحدث / غير موثوق";
write(FILES, "start/source_log.csv", csv([logHead, ...D1.sources.map(s => [s.s, src(s.s).site, `web/${src(s.s).file}`, "", "", "", "", ""]), [], [JUDGEMENTS]]));
write(FILES, "start/source_log_judged.csv", csv([logHead, ...D1.sources.map(s => [s.s, src(s.s).site, `web/${src(s.s).file}`, s.who, s.evidence, s.judgement, "", ""]), [], [JUDGEMENTS]]));
write(REF, "D1_3_source_log.csv", csv([logHead, ...D1.sources.map(s => [s.s, src(s.s).site, `web/${src(s.s).file}`, s.who, s.evidence, s.judgement, s.origin, s.changed])]));
write(REF, "D1_3_sources.json", JSON.stringify(D1.sources.map(s => ({ ...s, file: src(s.s).file, site: src(s.s).site })), null, 2));

// ------------------------------------------------------------ lab 2.1
write(FILES, "answer/ai_answer.md", D2.aiAnswer);
write(FILES, "answer/lookup_snapshot.md", D2.lookupSnapshot);
const auditHead = ["#", "الادعاء", "المرجع كما ورد", "1) هل يوجد؟", "2) هل النسبة صحيحة؟", "3) هل يدعم الادعاء؟", "القرار"];
write(FILES, "start/citation_audit.csv", csv([auditHead, ...D2.citations.map(c => [c.n, c.claim, `${c.cited} ${c.doi ? "doi:" + c.doi : c.url}`, "", "", "", ""])]));
write(REF, "D2_1_citations.json", JSON.stringify(D2.citations.map(({ n, doi, url, record, fault, verdict, decision }) => ({ n, doi: doi || null, url: url || null, record, fault, verdict, decision })), null, 2));
write(REF, "D2_1_citation_audit.csv", csv([["#", "المعرِّف أو الرابط", "الحكم", "الخطأ المزروع", "ما يقوله المصدر", "القرار"],
  ...D2.citations.map(c => [c.n, c.doi || c.url, c.verdict, c.fault || "لا خطأ", c.says, c.decision])]));

// ------------------------------------------------------------ labs 2.2 and 2.3
for (const d of D2.docs) write(FILES, `notebook/${d.file}`, D2.docText(d));
write(FILES, "start/test_questions.csv", csv([["#", "السؤال", "إجابة دفترك", "المستند والمقطع المستشهد به"], ...D2.questions.map(x => [x.n, x.text, "", ""])]));
const docName = id => id ? `${id}: ${D2.docs.find(d => d.id === id).title}` : "";
const scoreHead = ["#", "السؤال", "إجابة الدفتر «رَفّ»", "المستند المستشهد به", "المقطع الذي عرضه الدفتر", "الحكم", "ما قالته الإجابة ولم يقله المقطع"];
write(FILES, "start/notebook_answers_recorded.csv", csv([scoreHead, ...D2.questions.map(x => [x.n, x.text, x.rec.a, docName(x.rec.d), x.rec.pass, "", ""]),
  [], ["الأحكام: مدعوم / مدعوم جزئيًا / غير مدعوم / امتناع صحيح / امتناع خاطئ"]]));
write(REF, "D2_3_support.csv", csv([scoreHead, ...D2.questions.map(x => [x.n, x.text, x.rec.a, docName(x.rec.d), x.rec.pass, x.expect, x.why])]));
write(REF, "D2_3_questions.json", JSON.stringify(D2.questions.map(x => ({ n: x.n, text: x.text, gold: x.gold, answer: x.rec.a, cited: x.rec.d, passage: x.rec.pass, keys: x.rec.keys, expect: x.expect, why: x.why })), null, 2));

// ------------------------------------------------------------ lab 2.4 and the capstone
write(FILES, "case/findings_draft.md", D2.findingsDraft);
write(FILES, "start/verification_log.csv", csv([D2.logHeader, ...D2.logRows.map((r, i) => i === 0 || i === 2 || i === 3 ? [...r.slice(0, 5), "", "", ""] : r)]));
write(FILES, "start/research_request_raw.md", D2.rawRequest);
write(FILES, "start/verified_brief_template.md", D2.verifiedBriefTemplate);
write(REF, "D2_4_verification_log.csv", csv([D2.logHeader, ...D2.logRows]));
write(REF, "D2_4_findings.json", JSON.stringify({ findings: D2.referenceFindings, limitations: D2.limitations, disclosure: D2.disclosure, personal: D2.PERSONAL }, null, 2));
write(REF, "D2_4_request_clean.md", D2.cleanRequest);

// ------------------------------------------------------------ the reference solutions, as pages for the trainer
const count = (arr, f) => arr.filter(f).length;
const sound = count(D2.citations, c => !c.fault);
const sup = l => count(D2.questions, x => x.expect === l);
const claimsAnswered = D2.questions.length - sup("امتناع صحيح") - sup("امتناع خاطئ");
const standinHits = count(D1.claims, c => (D1.standinTypes[c.id] || c.type) === c.type);
const RUN = "التحقق بالكود: `node labs/solutions/check.mjs`، أو لمختبر واحد: `node labs/solutions/check.mjs";

write(SOL, "D1_1_research_brief.md", `# الحل المرجعي: المختبر 1.1 موجز بحث لسؤال هيئة غِراس

نقطة البداية: \`files/case/policy_question.md\` و\`files/start/brief_draft_weak.md\` و\`files/start/brief_template.md\`. ${RUN} 1.1\`.

## ما ينقص المسودة الضعيفة

${mdTable(["النقطة", "ما تطلبه القائمة", "ما في المسودة"], D1.checklist.map(([k, t], i) => [k, t, ["«تأثير المشروبات في صحة الطلاب»: لا إجراء ولا نتيجة تُقاس", "«كل الدراسات»: لا حدود", "«في أقرب وقت»: لا قرار ولا صاحب ولا موعد", "«مصادر موثوقة»: لا معيار", "«نبحث ونسأل المساعد»: لا كلمات ولا لغات ولا أماكن"][i]]))}
## الموجز المرجعي

الملف: \`reference/D1_1_brief.md\`. يستوفي النقاط الخمس، والمسودة الضعيفة لا تستوفي أي نقطة.

## دور المساعد

المساعد يسأل عن النطاق ولا يكتب الموجز. إن كتب موجزًا كاملًا فالمشارك لم يتعلم الصياغة: اطلب منه أن يعيد الخطوة بطلب «اسألني ولا تكتب».
`);

write(SOL, "D1_2_claim_table.md", `# الحل المرجعي: المختبر 1.2 جدول الادعاءات العشرين

نقطة البداية: \`files/report/deep_research_report.md\` و\`files/start/claim_table.csv\`. ${RUN} 1.2\`.

${mdTable(["#", "النوع", "الفحص المخطط له", "الادعاء"], D1.claims.map(c => [c.id, c.type, D1.CHECKS[c.type], c.text]))}
التوزيع: ${D1.TYPES.map(t => `${t} ${count(D1.claims, c => c.type === t)}`).join("، ")}. دليل الناتج: مطابقة المرجع في 16 ادعاءً على الأقل.

## أين يقع الخلاف

- C09 وC19: فيهما رقم، لكن الفعل «أدّى» و«بسبب» يجعلهما ادعاءين سببيين. الرقم يُفحص أيضًا، والسؤال الأول عن تصميم الدراسة.
- C10: توصية جهة رسمية قاعدة تُفحص في نصها النافذ، لا حقيقة عامة.
- C14: اقتباس حتى لو كان قائله مسؤولًا: يُفحص في النص الأصلي.
- C13: ادعاء سببي بلا رقم.

## المساعد البديل في التمرين الإضافي

تصنيف مساعد مكتوب مسبقًا (\`reference/D1_2_standin_types.json\`) يطابق المرجع في ${standinHits} من 20: يقرأ الرقم فيسمّي الادعاء إحصائية، ويقرأ اسم جهة رسمية فيسمّيه حقيقة.
`);

write(SOL, "D1_3_lateral_reading.md", `# الحل المرجعي: المختبران 1.3 و1.4 سجل المصادر الثمانية

نقطة البداية: \`files/web/index.html\` و\`files/start/source_log.csv\`، وللمختبر 1.4 \`files/start/source_log_judged.csv\`. ${RUN} 1.3 1.4\`.

## الحكم (المختبر 1.3، دون ذكاء اصطناعي)

${mdTable(["#", "المصدر", "من يقف خلفه", "الدليل من خارج الصفحة", "الحكم"], D1.sources.map(s => [s.s, src(s.s).site, s.who, s.evidence, s.judgement]))}
- الدراسة المختلقة: المصدر 4. المجلة والجامعة ليستا في فهرس الأبحاث، والبوابة ليست في سجل المنشآت الإعلامية.
- الصفحة الرسمية الملغاة: المصدر 1. صفحة الأنظمة واللوائح تقول إن المعيار ملغى، والصفحة القديمة نفسها لا تقول ذلك.

## الأصل (المختبر 1.4)

${mdTable(["#", "الأصل", "ما تغيّر في الطريق"], D1.sources.map(s => [s.s, s.origin, s.changed]))}
الحساب في المصدر 2: من ${D1.F.trial.before} غ إلى ${D1.F.trial.after} غ، أي ${D1.F.trial.drop}%، لا ${D1.F.headline}%. والبيان الصحفي قرّبها إلى 14% وذكر النطاق، والصحيفة غيّرت الرقم وأسقطت النطاق.
`);

write(SOL, "D2_1_citation_audit.md", `# الحل المرجعي: المختبر 2.1 تدقيق اثني عشر استشهادًا

نقطة البداية: \`files/answer/ai_answer.md\` و\`files/start/citation_audit.csv\`، وعند انقطاع الشبكة \`files/answer/lookup_snapshot.md\`. ${RUN} 2.1\` (يحلّ المعرِّفات على Crossref مباشرة حين تتاح الشبكة).

${mdTable(["#", "الحكم", "الخطأ المزروع", "القرار"], D2.citations.map(c => [c.n, c.verdict, c.fault || "لا خطأ", c.decision]))}
السليم ${sound} من 12، والمعيب ${12 - sound}: اثنان يسقطان في اختبار الوجود (8 و11)، واثنان في النسبة (6 و7)، وثلاثة في الدعم (2 و9 و10).

لو اكتفينا بسؤال «هل ينحلّ المعرِّف أو يفتح الرابط؟» لمرّ 11 من 12: حتى المرجع المركَّب رقم 11 ينحلّ معرِّفه، لكن إلى مقال آخر.
`);

write(SOL, "D2_2_notebook_setup.md", `# الحل المرجعي: المختبر 2.2 دفتر على عشرة مستندات عامة

نقطة البداية: \`files/notebook/\` (عشرة مستندات) و\`files/start/test_questions.csv\`. ${RUN} 2.2\`.

إجابات الدفتر الحي تختلف من أداة إلى أخرى ومن يوم إلى آخر، فلا حل مرجعيًا لنصها. المرجع هو موضع الجواب في المستندات:

${mdTable(["#", "السؤال", "موضع الجواب"], D2.questions.map(x => [x.n, x.text, x.gold ? `${x.gold[0]}، الفقرة ${x.gold[1] + 1}` : "لا جواب في المستندات: الصواب الامتناع"]))}
السؤالان 4 و5 فخ المستند الملغى: المعياران 2023 و2025 في الدفتر معًا، والجواب الصحيح من المعيار النافذ D02.

ما يشغّله الكود: مسترجع نصي بسيط يقوم مقام الدفتر (لا نموذج لغوي)، يبحث عن أقرب فقرة لكل سؤال، ويطبع كم سؤالًا أصاب مستنده.
`);

write(SOL, "D2_3_support_rate.md", `# الحل المرجعي: المختبر 2.3 معدل الدعم في عشرين إجابة

نقطة البداية: \`files/start/notebook_answers_recorded.csv\` والمستندات العشرة. ${RUN} 2.3\`.

${mdTable(["#", "الحكم", "ما قالته الإجابة ولم يقله المقطع"], D2.questions.map(x => [x.n, x.expect, x.why || ""]))}
العدّ: مدعوم ${sup("مدعوم")}، مدعوم جزئيًا ${sup("مدعوم جزئيًا")}، غير مدعوم ${sup("غير مدعوم")}، امتناع صحيح ${sup("امتناع صحيح")}.

**معدل الدعم: ${sup("مدعوم")} من ${claimsAnswered} إجابة قدّمت ادعاءً، أي ${Math.round(100 * sup("مدعوم") / claimsAnswered)}%.** الامتناعان الصحيحان يُذكران منفصلين ولا يدخلان المقام. من يحسب على العشرين يكتب ${sup("مدعوم")} من 20 ويذكر مقامه.

حالات الإخفاق الست: 3 و7 و9 و11 و14 و18. يشرح المشارك ثلاثًا منها. والإجابة 4 مدعومة بمقطعها وخاطئة اليوم: المقطع من معيار ملغى.
`);

write(SOL, "D2_4_log_and_confidence.md", `# الحل المرجعي: المختبر 2.4 سجل التحقق وإفادات الثقة

نقطة البداية: \`files/case/findings_draft.md\` و\`files/start/verification_log.csv\` و\`files/start/research_request_raw.md\` و\`files/start/verified_brief_template.md\`. ${RUN} 2.4\`.

## سجل التحقق كاملًا

${mdTable(D2.logHeader, D2.logRows)}
## النتائج الثلاث بعد التحقق

${mdTable(["#", "النتيجة", "درجة الثقة", "سبب الدرجة", "ما يغيّرها", "أسطر السجل"], D2.referenceFindings.map((f, i) => [i + 1, f.finding, f.confidence, f.why, f.change, f.log.join(" و")]))}
## القيود المتبقية

${D2.limitations.map(l => `- ${l}`).join("\n")}

## سطر الإفصاح

${D2.disclosure}

## الطلب بعد التنقية

الملف: \`reference/D2_4_request_clean.md\`. يُحذف: اسم الطالب، ورقم هويته، وحالته الصحية، واسم مدرسته، وقائمة التفتيش المصنفة «مقيد». السؤال البحثي لا يحتاج إلى أي منها.
`);

write(SOL, "answer_key.md", `# مفتاح الإجابة: ما زُرع في ملفات هيئة غِراس، وأين، وأي مختبر يكشفه

كل ما يخص هيئة غِراس اصطناعي. الملفات يكتبها \`labs/_tools/prepare_files.mjs\`، والبذرة ${SEED}. والحلول يشغّلها \`node labs/solutions/check.mjs\`.

${mdTable(["المزروع", "أين", "المختبر"], [
    ["موجز ضعيف لا يستوفي أي نقطة من الخمس", "`files/start/brief_draft_weak.md`", "1.1"],
    ["عشرون ادعاءً من ستة أنواع، خمسة منها يُختلف في نوعها", "`files/report/deep_research_report.md`", "1.2"],
    ["صفحة رسمية ملغاة لا تقول إنها ملغاة", "`files/web/ghiras-standard-2023.html`", "1.3 و1.4"],
    ["دراسة مختلقة في بوابة غير مرخصة", "`files/web/afiyatak-article.html`", "1.3"],
    ["معهد «مستقل» يموّله اتحاد المنتجين", "`files/web/institute-paper.html`", "1.3"],
    [`رقم تغيّر في الطريق: ${D1.F.trial.drop}% صار ${D1.F.headline}%`, "`files/web/almarfa-news-40.html`", "1.4"],
    ["رقم مرحلة واحدة عُرض كأنه لكل الطلاب", "`files/web/institute-paper.html`", "1.4"],
    ["اقتباس سقطت منه «لا»", "`files/web/ngo-factsheet.html`", "1.4"],
    ["صورة من عام 2019 نُسبت إلى حدث في 2026", "`files/web/social-post.html`", "1.4"],
    [`سبعة استشهادات معيبة من اثني عشر`, "`files/answer/ai_answer.md`", "2.1"],
    ["معياران في الدفتر، أحدهما ملغى", "`files/notebook/D01…` و`D02…`", "2.2"],
    ["ست إجابات لا يدعمها مقطعها كاملًا، وإجابة مدعومة من مستند ملغى", "`files/start/notebook_answers_recorded.csv`", "2.3"],
    ["ثلاث نتائج مبالغ فيها، وطلب بحث فيه بيانات شخصية ومصنفة", "`files/case/findings_draft.md` و`files/start/research_request_raw.md`", "2.4"],
  ])}
## الأرقام المرجعية

- 1.2: المساعد البديل يطابق المرجع في ${standinHits} من 20.
- 2.1: ${sound} سليمة و${12 - sound} معيبة.
- 2.3: معدل الدعم ${sup("مدعوم")} من ${claimsAnswered}.

الاستشهادات الحقيقية في المختبر 2.1 سُجّل ما أعادته السجلات عنها بتاريخ ${D2.SNAPSHOT_DATE}. السجلات تتغير: شغّل \`check.mjs 2.1\` قبل كل دفعة، وهو يقارن السجل الحي بالمحفوظ.
`);

console.log(`wrote ${written} files under labs/files and labs/solutions`);
