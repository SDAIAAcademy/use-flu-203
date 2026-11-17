// Runs the reference solution of every lab against the course files and prints PASS or the first
// difference.
//
//     node labs/solutions/check.mjs              every lab
//     node labs/solutions/check.mjs 1.3 2.1      some labs
//     node labs/solutions/check.mjs --offline    lab 2.1 on the saved records only
//
// What runs for real: every check a participant does by opening a file or a register (the brief
// against the checklist, the links and registers of the closed web, the arithmetic of each traced
// number, the twelve identifiers on Crossref and the two WHO pages, the passages of the ten
// documents). What a participant does in an AI tool is not run: where a lab needs a tool's
// output, a scripted stand-in is used (a fixed classification in 1.2, a word-overlap retriever
// in 2.2, the recorded answers in 2.3). No model is called and nothing is written to disk.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILES = path.join(HERE, "..", "files");
const REF = path.join(HERE, "reference");
const args = process.argv.slice(2);
const OFFLINE = args.includes("--offline");
const only = args.filter(a => !a.startsWith("--"));

const read = (base, rel) => fs.readFileSync(path.join(base, rel), "utf8").replace(/^﻿/, "");
const json = rel => JSON.parse(read(REF, rel));
function csv(text) {
  const rows = []; let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') inQ = false; else cell += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  return rows.filter(r => r.some(c => c !== ""));
}
// Arabic as compared here: diacritics and tatweel removed, alef, teh marbuta and alef maqsura folded
const norm = s => s.normalize("NFKC").replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();
const strip = html => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const web = file => strip(read(FILES, `web/${file}`));
const has = (text, part) => norm(text).includes(norm(part));

const LABS = {};

// ------------------------------------------------------------------ 1.1
LABS["1.1"] = () => {
  const tests = {
    "السؤال": t => /هل\s/.test(t) && /السكر/.test(t) && /(قصر|منع|إزالة)/.test(t),
    "النطاق": t => /لا يدخل/.test(t) && /يدخل/.test(t.replace(/لا يدخل/g, "")),
    "القرار والموعد": t => /د\. إيمان الحقباني/.test(t) && /(أسبوع|أسابيع)/.test(t) && /صفح/.test(t),
    "معايير المصادر": t => /يُعد دليلًا/.test(t) && /يُستبعد/.test(t),
    "خطة البحث": t => /[A-Za-z]{4,}/.test(t) && /«[^»]*[؀-ۿ][^»]*»/.test(t),
  };
  const sections = text => Object.fromEntries([...text.matchAll(/\*\*([^*:]+):\*\*\s*([^\n]*)/g)].map(m => [m[1].trim(), m[2]]));
  const score = text => { const s = sections(text); return Object.entries(tests).filter(([k, f]) => f(s[k] || "")).map(([k]) => k); };
  const points = json("D1_1_checklist.json").map(x => x.point);
  assert.deepEqual(points, Object.keys(tests));
  const weak = score(read(FILES, "start/brief_draft_weak.md")), ref = score(read(REF, "D1_1_brief.md"));
  console.log(`  weak draft meets ${weak.length} of 5 points; reference brief meets ${ref.length} of 5`);
  assert.equal(weak.length, 0); assert.equal(ref.length, 5);
  const words = read(REF, "D1_1_brief.md").split(/\s+/).length;
  console.log(`  reference brief: ${words} words (one page)`); assert.ok(words < 330);
  assert.ok(has(read(FILES, "case/policy_question.md"), "بعد ثلاثة أسابيع"));
};

// ------------------------------------------------------------------ 1.2
LABS["1.2"] = () => {
  const report = read(FILES, "report/deep_research_report.md");
  const ref = csv(read(REF, "D1_2_claim_table.csv")).slice(1);
  const start = csv(read(FILES, "start/claim_table.csv"));
  assert.equal(ref.length, 20);
  const types = ["حقيقة", "إحصائية", "ادعاء سببي", "اقتباس", "قاعدة", "توقع"];
  const dist = Object.fromEntries(types.map(t => [t, 0]));
  for (const [id, text, type, check] of ref) {
    assert.ok(types.includes(type), type); dist[type]++; assert.ok(check.length > 10);
    assert.equal(report.split(`[${id}]`).length, 2, `${id} is tagged once in the report`);
    assert.ok(report.includes(`${text} [${id}]`), `${id}: the table quotes the report`);
    const row = start.find(r => r[0] === id); assert.ok(row && row[1] === text && row[2] === "", `${id} is empty in the starting table`);
  }
  console.log("  distribution:", JSON.stringify(dist));
  assert.deepEqual(Object.values(dist), [4, 5, 4, 2, 3, 2]);
  const standin = json("D1_2_standin_types.json");
  const miss = ref.filter(([id, , type]) => standin[id] !== type).map(([id, , type]) => `${id} ${type} -> ${standin[id]}`);
  console.log(`  stand-in assistant matches the reference on ${20 - miss.length} of 20; misses: ${miss.join("; ")}`);
  assert.equal(20 - miss.length, 14); assert.ok(20 - miss.length < 16, "the stand-in is below the bar of 16");
};

// ------------------------------------------------------------------ 1.3
LABS["1.3"] = () => {
  const dir = path.join(FILES, "web");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".html"));
  assert.equal(files.length, 21, "20 pages and the search page");
  let links = 0;
  for (const f of files) for (const m of read(FILES, `web/${f}`).matchAll(/(?:href|src)="([^"#]+)"/g)) { links++; assert.ok(fs.existsSync(path.join(dir, m[1])), `${f} -> ${m[1]}`); }
  const index = read(FILES, "web/index.html");
  for (const f of files) if (f !== "index.html") assert.ok(index.includes(`href="${f}"`), `the search page lists ${f}`);
  console.log(`  closed web: ${files.length - 1} pages, ${links} links, none broken`);
  const sources = json("D1_3_sources.json"); assert.equal(sources.length, 8);
  const media = web("registry-media.html"), scholar = web("scholar-index.html"), charities = web("registry-charities.html"), regs = web("ghiras-regulations.html");
  // S1 superseded: its own page is silent, the register says it
  assert.ok(!has(web("ghiras-standard-2023.html"), "ملغى") && /GH-STD-2023-04\s+ملغى/.test(regs) && has(web("ghiras-standard-2025.html"), "يلغي المعيار GH-STD-2023-04"));
  // S2 licensed outlet, secondary
  assert.ok(has(media, "صحيفة المرفأ اليومية") && has(web("almarfa-news-40.html"), "بيان صحفي"));
  // S3 "independent" on its own page, funded by the producers elsewhere
  assert.ok(has(web("institute-about.html"), "مستقل") && has(charities, "اتحاد منتجي العصائر والمرطبات") && has(web("federation-annual-report.html"), "المعهد الخليجي لتغذية الطفل"));
  // S4 fabricated: neither the outlet, the journal nor the university exist anywhere else
  const others = files.filter(f => f !== "afiyatak-article.html" && f !== "index.html").map(f => web(f)).join(" ");
  for (const ghost of ["School Hydration", "كيلبراي", "Hartwell"]) assert.ok(!has(others, ghost), ghost);
  assert.ok(!has(media, "عافيتك"));
  // S5 and S6 primary
  assert.ok(has(scholar, "المجلة الخليجية للصحة العامة") && has(scholar, "gjph.2024.12.4.07") && has(web("study-athl-2024.html"), "gjph.2024.12.4.07"));
  assert.ok(has(web("stats-survey-2024.html"), "إحصاء رسمي"));
  // S7 anonymous account, S8 registered charity
  assert.ok(!has(media, "تربويات") && has(charities, "جمعية ابتسامة سليمة لصحة الفم"));
  const tally = {}; for (const s of sources) tally[s.judgement.split(":")[0]] = (tally[s.judgement.split(":")[0]] || 0) + 1;
  console.log("  judgements:", JSON.stringify(tally));
  assert.deepEqual(tally, { "قديم": 1, "موثوق مع تحفّظ": 3, "غير موثوق": 2, "موثوق": 2 });
  const start = csv(read(FILES, "start/source_log.csv")); assert.ok(start.slice(1, 9).every(r => r[3] === "" && r[5] === ""));
};

// ------------------------------------------------------------------ 1.4
LABS["1.4"] = () => {
  const sources = json("D1_3_sources.json");
  const judged = csv(read(FILES, "start/source_log_judged.csv")).slice(1, 9);
  assert.ok(judged.every((r, i) => r[5] === sources[i].judgement && r[6] === ""), "the fallback log has the judgements and no origins");
  // the statistic: headline -> press release -> the study's table
  const news = web("almarfa-news-40.html"), press = web("uni-press-release.html"), study = web("study-athl-2024.html");
  const headline = +news.match(/(\d+)%/)[1], pressFig = +press.match(/قدره (\d+)%/)[1];
  const [, before, after] = study.match(/مدارس التدخل\s+([\d.]+)\s+([\d.]+)/).map(Number);
  const drop = Math.round(1000 * (before - after) / before) / 10;
  console.log(`  statistic: headline ${headline}% <- press release ${pressFig}% <- table ${before} g to ${after} g = ${drop}%`);
  assert.equal(drop, 14.2); assert.equal(pressFig, 14); assert.equal(headline, 40);
  assert.ok(has(study, `-${drop}%`) && has(press, "خلال اليوم الدراسي") && !has(news, "اليوم الدراسي") && has(study, "فرق غير دال"));
  assert.ok(read(FILES, "web/almarfa-news-40.html").includes('href="uni-press-release.html"') && read(FILES, "web/uni-press-release.html").includes('href="study-athl-2024.html"'));
  // the cherry-picked stage
  const survey = web("stats-survey-2024.html"), paper = web("institute-paper.html");
  const row = k => +survey.match(new RegExp(`${k}\\s+([\\d.]+)%`))[1];
  const quoted = +paper.match(/\(([\d.]+)%\)/)[1];
  console.log(`  scope: the institute quotes ${quoted}% = primary ${row("الابتدائية")}%; all stages ${row("جميع المراحل")}%, secondary ${row("الثانوية")}%`);
  assert.equal(quoted, row("الابتدائية")); assert.equal(row("جميع المراحل"), 24.8); assert.ok(has(paper, "أقل من خُمس الطلاب"));
  // the quotation
  const q = s => s.match(/«([^»]*الماء وحده[^»]*)»/)?.[1] || s.match(/(الماء وحده[^.]*)\./)[1];
  const drift = q(web("ngo-factsheet.html")), orig = q(web("interview-transcript.html"));
  console.log(`  quotation: "${drift}" <- "${orig}"`);
  assert.ok(orig.includes("لا يكفي") && !drift.includes("لا يكفي") && orig.replace("لا يكفي", "يكفي").startsWith(drift));
  // the rule, through the archive
  const lim = f => +web(f).match(/على (\d+) غ لكل 100 مل/)[1];
  console.log(`  rule: ${lim("ghiras-standard-2023.html")} g (2023, repealed) -> ${lim("ghiras-standard-2025.html")} g (2025, in force)`);
  assert.deepEqual([lim("ghiras-standard-2023.html"), lim("ghiras-standard-2025.html")], [10, 5]);
  const arch = web("archive.html"); assert.ok(has(arch, "20 مارس 2023") && has(arch, "5 سبتمبر 2025"));
  // the image
  const img = web("image-search.html"); const years = [...img.matchAll(/\d+ \S+ (20\d\d)/g)].map(m => +m[1]);
  console.log(`  image: first seen ${Math.min(...years)}, posted as new in ${Math.max(...years)}`);
  assert.equal(Math.min(...years), 2019); assert.ok(has(web("almarfa-2019-festival.html"), "مهرجان الرياضة المدرسية"));
  assert.ok(read(FILES, "web/social-post.html").includes("img/queue.svg") && read(FILES, "web/almarfa-2019-festival.html").includes("img/queue.svg"));
  for (const s of sources) if (s.originFile) assert.ok(fs.existsSync(path.join(FILES, "web", s.originFile)));
  assert.equal(sources.filter(s => !s.originFile).length, 1, "one source has no origin: the fabricated study");
};

// ------------------------------------------------------------------ 2.1
async function get(url, asJson) {
  const r = await fetch(url, { signal: AbortSignal.timeout(40000), headers: { "User-Agent": "Mozilla/5.0 (course lab checker)" } });
  return { status: r.status, body: r.ok ? (asJson ? await r.json() : await r.text()) : null };
}
const words = s => new Set(norm(s).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 3));
const overlap = (a, b) => { const A = words(a), B = words(b); return [...A].filter(w => B.has(w)).length / Math.max(1, A.size); };
LABS["2.1"] = async () => {
  const cites = json("D2_1_citations.json");
  const answer = read(FILES, "answer/ai_answer.md");
  const refs = answer.split("## المراجع")[1].trim().split("\n");
  assert.equal(refs.length, 12); assert.equal(cites.length, 12);
  let live = !OFFLINE, liveCount = 0;
  const verdicts = [];
  for (const c of cites) {
    const cited = refs[c.n - 1];
    let rec = c.record, exists = !!c.record, retracted = !!c.record?.retracted, how = "saved record";
    if (live && c.doi) {
      try {
        const r = await get(`https://api.crossref.org/works/${c.doi}`, true);
        if (r.status === 404) { exists = false; rec = null; how = "Crossref: 404"; liveCount++; }
        else if (r.body) {
          const m = r.body.message; liveCount++; how = "Crossref: live";
          rec = { title: m.title?.[0] || "", first: m.author?.[0]?.family || "", journal: m["container-title"]?.[0] || "", year: m.issued?.["date-parts"]?.[0]?.[0] };
          retracted = /^retracted/i.test(rec.title) || (m["updated-by"] || []).some(u => u.type === "retraction");
          exists = true;
          // the saved record must still agree with the register
          assert.equal(rec.first, c.record.first, `citation ${c.n}: first author changed in the register`);
          assert.equal(rec.year, c.record.year, `citation ${c.n}: year`);
          assert.ok(overlap(c.record.title, rec.title) > 0.7, `citation ${c.n}: title`);
          assert.equal(retracted, !!c.record.retracted, `citation ${c.n}: retraction status`);
        } else how = `Crossref: status ${r.status}, saved record used`;
      } catch (e) { live = false; how = "network not reachable, saved record used"; }
    }
    // test 1: exists
    let verdict = "سليم";
    if (!exists) verdict = "معيب: الوجود";
    else {
      // test 2: attribution, from what the answer printed against the record
      const sameWork = overlap(rec.title.replace(/^RETRACTED:\s*/i, ""), cited) > 0.6;
      const sameAuthor = cited.includes(rec.first.replace("’", "'")) && cited.trimStart().replace(/^\d+\.\s*/, "").startsWith(rec.first.split(" ")[0]);
      const journalWords = rec.journal.replace(/&amp;/g, "&").replace(/[&]/g, " ").split(/\s+/).filter(w => w.length > 2);
      const sameJournal = journalWords.every(w => norm(cited).includes(norm(w)));
      if (!sameWork) verdict = "معيب: الوجود";             // the identifier belongs to another work: the cited work does not exist
      else if (retracted || !sameAuthor || !sameJournal) verdict = "معيب: النسبة";
      else if (c.fault) verdict = "معيب: الدعم";              // test 3 is a reading; the planted reading faults come from the key
    }
    verdicts.push(verdict);
    console.log(`  [${String(c.n).padStart(2)}] ${verdict.padEnd(14)} ${how}${rec ? ` | ${rec.first}, ${rec.journal}, ${rec.year}` : ""}`);
    assert.equal(verdict, c.verdict, `citation ${c.n}`);
  }
  // the two WHO pages: the quotation of citation 12 is on its page, the one of citation 10 is on neither
  if (live) {
    try {
      const news = await get(cites[11].url), guide = await get(cites[9].url);
      if (news.body && guide.body) {
        const en = "We have solid evidence that keeping intake of free sugars to less than 10% of total energy intake reduces the risk of overweight, obesity and tooth decay";
        const t = s => strip(s).replace(/&ldquo;|&rdquo;|&rsquo;/g, "'");
        assert.ok(t(news.body).includes(en), "citation 12: the quotation is in the news release");
        for (const body of [news.body, guide.body]) assert.ok(!/\b(ban|prohibit)\w* (the )?(sale|sales)\b[^.]*school/i.test(t(body)), "citation 10: no such recommendation on the page");
        console.log("  WHO pages: live; the quotation of [12] is there, the one of [10] is not");
      } else console.log(`  WHO pages: status ${news.status}/${guide.status}, not compared`);
    } catch (e) { console.log("  WHO pages: not reachable, not compared"); }
  }
  const soundN = verdicts.filter(v => v === "سليم").length;
  const resolves = cites.filter(c => c.record).length;
  console.log(`  sound ${soundN} of 12, faulty ${12 - soundN}; an "it resolves" check alone would pass ${resolves} of 12; live lookups: ${liveCount}`);
  assert.equal(soundN, 5); assert.equal(resolves, 11);
  const snap = read(FILES, "answer/lookup_snapshot.md"); assert.equal(snap.split("\n").filter(l => /^\| \d+ \|/.test(l)).length, 12);
  assert.ok(csv(read(FILES, "start/citation_audit.csv")).slice(1).every(r => r[3] === "" && r[6] === ""));
};

// ------------------------------------------------------------------ 2.2
const docsOf = () => fs.readdirSync(path.join(FILES, "notebook")).sort().map(f => {
  const text = read(FILES, `notebook/${f}`); const paras = text.split("\n\n").slice(2).map(s => s.trim()).filter(Boolean);
  return { id: f.slice(0, 3), file: f, text, paras };
});
const STOP = new Set(["في", "من", "ما", "كم", "هل", "على", "عن", "الى", "التي", "الذي", "او", "هذا", "عام", "كل", "لا", "ان", "متى", "كيف", "به"].map(norm));
const toks = s => norm(s).replace(/[^؀-ۿa-z0-9% ]/g, " ").split(/\s+/).map(w => w.replace(/^(وال|بال|لل|ال|و)/, "")).filter(w => w.length > 1 && !STOP.has(w));
LABS["2.2"] = () => {
  const docs = docsOf(); assert.equal(docs.length, 10);
  const qs = json("D2_3_questions.json"); assert.equal(qs.length, 20);
  const start = csv(read(FILES, "start/test_questions.csv")); assert.equal(start.length, 21); assert.ok(start.slice(1).every(r => r[2] === ""));
  for (const x of qs) if (x.gold) assert.ok(docs.find(d => d.id === x.gold[0]).paras[x.gold[1]], `question ${x.n}: the gold passage exists`);
  // the stand-in notebook: the paragraph that shares most words with the question
  let hit = 0, answerable = 0; const wrong = [];
  for (const x of qs) {
    const qt = toks(x.text); let best = null;
    for (const d of docs) d.paras.forEach((p, i) => { const pt = new Set(toks(p)); const s = qt.filter(w => pt.has(w)).length / Math.sqrt(pt.size); if (!best || s > best.s) best = { s, d: d.id, i }; });
    if (!x.gold) continue;
    answerable++;
    if (best.d === x.gold[0]) hit++; else wrong.push(`Q${x.n}: ${best.d} for ${x.gold[0]}`);
  }
  console.log(`  ten documents, ${docs.reduce((n, d) => n + d.paras.length, 0)} paragraphs; ${answerable} questions have an answer, ${20 - answerable} do not`);
  console.log(`  stand-in retriever finds the right document for ${hit} of ${answerable}; misses: ${wrong.join("; ") || "none"}`);
  assert.equal(answerable, 17); assert.ok(hit >= 12);
  // the superseded standard is in the set on purpose
  assert.ok(has(docs[0].text, "ملغى") && has(docs[1].text, "يلغي المعيار"));
};

// ------------------------------------------------------------------ 2.3
LABS["2.3"] = () => {
  const docs = docsOf(); const qs = json("D2_3_questions.json");
  const rows = csv(read(FILES, "start/notebook_answers_recorded.csv")).slice(1, 21);
  const tally = {}; const fails = [];
  for (const x of qs) {
    const row = rows[x.n - 1]; assert.equal(row[2], x.answer); assert.equal(row[5], "", "the judgement is empty in the starting file");
    let label;
    if (x.keys.length === 0) label = x.gold ? "امتناع خاطئ" : "امتناع صحيح";
    else {
      const doc = docs.find(d => d.id === x.cited);
      assert.ok(doc && doc.text.includes(x.passage), `answer ${x.n}: the passage shown is in the cited document`);
      const found = x.keys.filter(k => has(x.passage, k)).length;
      label = found === x.keys.length ? "مدعوم" : found === 0 ? "غير مدعوم" : "مدعوم جزئيًا";
    }
    assert.equal(label, x.expect, `answer ${x.n}`);
    tally[label] = (tally[label] || 0) + 1;
    if (label === "مدعوم جزئيًا" || label === "غير مدعوم") { fails.push(x.n); assert.ok(x.why.length > 20, `failure ${x.n} is annotated`); }
  }
  const claims = 20 - (tally["امتناع صحيح"] || 0) - (tally["امتناع خاطئ"] || 0);
  console.log("  judgements:", JSON.stringify(tally));
  console.log(`  support rate: ${tally["مدعوم"]} of ${claims} answers that make a claim = ${Math.round(100 * tally["مدعوم"] / claims)}%; over all 20: ${Math.round(100 * tally["مدعوم"] / 20)}%`);
  console.log(`  failures to annotate: ${fails.join(", ")}`);
  assert.deepEqual([tally["مدعوم"], tally["مدعوم جزئيًا"], tally["غير مدعوم"], tally["امتناع صحيح"]], [12, 3, 3, 2]);
  // supported is not the same as right: answer 4 is supported by a repealed document
  const a4 = qs[3]; assert.equal(a4.cited, "D01"); assert.equal(a4.gold[0], "D02"); assert.equal(a4.expect, "مدعوم");
  console.log("  answer 4: supported by its passage, from the repealed standard D01; the standard in force is D02");
};

// ------------------------------------------------------------------ 2.4
LABS["2.4"] = () => {
  const ref = json("D2_4_findings.json");
  const log = csv(read(REF, "D2_4_verification_log.csv")), start = csv(read(FILES, "start/verification_log.csv"));
  assert.equal(log.length, 7); assert.equal(start.length, 7);
  const open = start.slice(1).filter(r => r[5] === "" && r[7] === "").map(r => +r[0]);
  console.log(`  log: ${log.length - 1} lines, ${open.length} left open in the starting file (${open.join(", ")})`);
  assert.deepEqual(open, [1, 3, 4]);
  for (const r of log.slice(1)) assert.ok(r.every(c => c !== ""), `log line ${r[0]} is complete`);
  const draft = read(FILES, "case/findings_draft.md");
  assert.equal(ref.findings.length, 3);
  for (const [i, f] of ref.findings.entries()) {
    assert.ok(f.confidence && f.why.length > 30 && f.change.length > 10);
    for (const n of f.log) assert.ok(log[n], `finding ${i + 1} points at log line ${n}`);
  }
  assert.ok(draft.includes("40%") && !ref.findings[0].finding.includes("40%") && ref.findings[0].finding.includes("14.2%"));
  assert.ok(draft.includes("10 غ") && ref.findings[2].finding.includes("5 غ"));
  console.log("  confidence:", ref.findings.map(f => f.confidence).join(" | "));
  const raw = read(FILES, "start/research_request_raw.md"), clean = read(REF, "D2_4_request_clean.md");
  const leaked = ref.personal.filter(p => clean.includes(p));
  console.log(`  request: ${ref.personal.filter(p => raw.includes(p)).length} personal or classified items in the raw text, ${leaked.length} after cleaning`);
  assert.equal(ref.personal.filter(p => raw.includes(p)).length, ref.personal.length); assert.equal(leaked.length, 0);
  assert.ok(!/\b[12]\d{9}\b/.test(clean) && /\b[12]\d{9}\b/.test(raw));
  assert.ok(ref.disclosure.includes("سجل التحقق") && ref.limitations.length === 3);
  const tpl = read(FILES, "start/verified_brief_template.md"); for (const h of ["النتائج الرئيسية", "القيود المتبقية", "المصادر", "الإفصاح"]) assert.ok(tpl.includes(`## ${h}`));
};

// ------------------------------------------------------------------ run
let failed = 0;
for (const id of Object.keys(LABS)) {
  if (only.length && !only.includes(id)) continue;
  console.log(`Lab ${id}`);
  try { await LABS[id](); console.log("  PASS"); }
  catch (e) { failed++; console.log(`  FAIL: ${e.message}`); }
}
console.log(failed ? `${failed} lab(s) failed` : "all reference solutions pass");
process.exit(failed ? 1 : 0);
