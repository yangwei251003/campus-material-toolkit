// Early local layout program with newly fabricated synthetic content.
const EARLY=require('./early-runtime.cjs');
EARLY.configure();
const fs = require("fs");
const path = require("path");
const R = require("./content/01-review.js");
const P = require("./content/02-plan.js");
const O = require("./content/03-ops.js");

const OUT = EARLY.output();
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const nl2br = (s) => String(s).replace(/\n/g, "<br>");
const esc = (s) => String(s);
let sec = 0;
const S = (id, title, sub) => {
  sec++;
  return `<section id="${id}" class="sec"><div class="sec-head"><span class="sec-num">${String(sec).padStart(2, "0")}</span><div><h2>${title}</h2>${sub ? `<p class="sec-sub">${sub}</p>` : ""}</div></div>`;
};
const card = (inner, cls = "") => `<div class="card ${cls}">${inner}</div>`;
const table = (headers, rows, cls = "") => {
  let h = `<table class="tb ${cls}"><thead><tr>${headers.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>`;
  rows.forEach((r) => {
    h += `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`;
  });
  return h + "</tbody></table>";
};


const budgetRows = O.budget.items.map((i) => {
  const amt = i.q * i.u;
  return [i.c, i.n, i.s, String(i.q), "¥" + i.u.toFixed(2), "¥" + amt.toFixed(0), i.ph];
});
const grouped = {};
O.budget.items.forEach((i) => {
  grouped[i.c] = (grouped[i.c] || 0) + i.q * i.u;
});
const subtotal = Object.values(grouped).reduce((a, b) => a + b, 0);
const reserve = subtotal * EARLY.syntheticReserveRate;
const total = subtotal + reserve;


const nav = [
  ["sum", "Synthetic field_0049"],
  ["review", "Synthetic field_0108"],
  ["added", "Synthetic field_0388"],
  ["bg", "Synthetic field_0389"],
  ["obj", "Synthetic field_0174"],
  ["persona", "Synthetic field_0182"],
  ["msg", "Synthetic field_0390"],
  ["org", "Synthetic field_0391"],
  ["phase", "Synthetic field_0392"],
  ["content", "Synthetic field_0269"],
  ["ops", "Synthetic field_0393"],
  ["budget", "Synthetic field_0317"],
  ["risk", "Synthetic field_0394"],
  ["data", "Synthetic field_0395"],
  ["appx", "Synthetic field_0379"]
];


const funnelCards = P.objectives.funnel
  .map(
    (f) => `<div class="fn">
    <div class="fn-k">${f.k}</div>
    <div class="fn-m">${f.metric}</div>
    <div class="fn-t">${f.target}</div>
    <div class="fn-n">${f.note}</div>
  </div>`
  )
  .join("");

const phaseStrip = P.phases
  .map(
    (p) => `<div class="ps">
    <div class="ps-id">${p.id}</div>
    <div class="ps-name">${p.name}</div>
    <div class="ps-date">${p.date}</div>
  </div>`
  )
  .join("");

const sumHtml = `
<section id="sum" class="sec">
  <div class="sec-head"><span class="sec-num">EXAMPLE</span><div><h2>Synthetic field_0049</h2><p class="sec-sub">Synthetic field_0396 EXAMPLE Synthetic field_0397：Synthetic field_0053、Synthetic field_0054、Synthetic field_0055、Synthetic field_0056</p></div></div>

  <div class="kpi-row">
    <div class="kpi"><div class="kpi-n">EXAMPLE<span>Synthetic field_0029</span></div><div class="kpi-l">Synthetic field_0028（Synthetic field_0060 EXAMPLE Synthetic field_0061）</div></div>
    <div class="kpi"><div class="kpi-n">EXAMPLE<span>Synthetic field_0029</span></div><div class="kpi-l">Synthetic field_0398 / Synthetic field_0399</div></div>
    <div class="kpi"><div class="kpi-n">EXAMPLE<span>Synthetic field_0029</span></div><div class="kpi-l">Synthetic field_0400</div></div>
    <div class="kpi"><div class="kpi-n">¥${Math.round(total).toLocaleString()}</div><div class="kpi-l">Synthetic field_0401（Synthetic field_0034 EXAMPLE Synthetic field_0402）</div></div>
  </div>

  <h3 class="h3">Synthetic field_0073</h3>
  <div class="phase-strip">${phaseStrip}</div>

  <h3 class="h3">Synthetic field_0079（Synthetic field_0403）</h3>
  <div class="funnel">${funnelCards}</div>

  <h3 class="h3">Synthetic field_0083</h3>
  <div class="three">
    <div class="th"><div class="th-t">① Synthetic field_0084</div><p>Synthetic field_0085，Synthetic field_0086<b>「Synthetic field_0087」</b>。Synthetic field_0088 EXAMPLE Synthetic field_0089「Synthetic field_0090、Synthetic field_0091」Synthetic field_0092，Synthetic field_0093。</p></div>
    <div class="th"><div class="th-t">② Synthetic field_0094</div><p><b>Synthetic field_0095、Synthetic field_0404</b>Synthetic field_0405，Synthetic field_0097。Synthetic field_0098，Synthetic field_0099。</p></div>
    <div class="th"><div class="th-t">③ Synthetic field_0056</div><p>Synthetic field_0100，Synthetic field_0406<b>Synthetic field_0407</b>。Synthetic field_0102，Synthetic field_0103。EXAMPLE Synthetic field_0023 EXAMPLE Synthetic field_0104、Synthetic field_0105，Synthetic field_0106。</p></div>
  </div>
</section>`;


const advRows = R.adversarial.map((a) => [
  `<span class="lvl lvl-${a.level === "Synthetic field_0408" ? "f" : a.level === "Synthetic field_0409" ? "h" : "m"}">${a.level}</span>`,
  `<b>${a.no} ${a.title}</b>`,
  a.detail,
  a.fix
]);

const reviewHtml = `
${S("review", "Synthetic field_0108：Synthetic field_0109", "Synthetic field_0110、Synthetic field_0111、Synthetic field_0112、Synthetic field_0113，Synthetic field_0114")}

${card(`<div class="verdict">
  <div class="vd-score">${R.verdict.score}</div>
  <ul class="vd-list">${R.verdict.summary.map((s) => `<li>${s}</li>`).join("")}</ul>
</div>`)}

<h3 class="h3">Synthetic field_0048、Synthetic field_0116（Synthetic field_0117）：EXAMPLE Synthetic field_0118</h3>
<p class="lead">Synthetic field_0119，Synthetic field_0120、Synthetic field_0121、Synthetic field_0122、Synthetic field_0123——Synthetic field_0124？</p>
${table(["Synthetic field_0125", "Synthetic field_0126", "Synthetic field_0127", "Synthetic field_0128"], advRows, "tb-risk")}

<h3 class="h3">Synthetic field_0107、Synthetic field_0111：Synthetic field_0129</h3>
${card(`<div class="axiom"><b>Synthetic field_0130：</b>${R.firstPrinciples.axiom}</div>
${table(
  ["Synthetic field_0131", "Synthetic field_0132"],
  R.firstPrinciples.decomposition.map((d) => [`<b>${d.k}</b>`, d.v])
)}`)}

<h3 class="h3">Synthetic field_0147、Synthetic field_0112：Synthetic field_0133，Synthetic field_0134</h3>
<div class="sq">
${R.socratic
  .map(
    (s) => `<div class="sq-item">
    <div class="sq-q">${s.q}</div>
    <div class="sq-a">${s.a}</div>
  </div>`
  )
  .join("")}
</div>

<h3 class="h3">Synthetic field_0161、Synthetic field_0135：Synthetic field_0136，Synthetic field_0137</h3>
<p class="lead">EXAMPLE Synthetic field_0138、EXAMPLE Synthetic field_0139，Synthetic field_0140。Synthetic field_0410，Synthetic field_0411。</p>
<div class="occam">
  <div class="oc-col oc-cut">
    <div class="oc-h">✂ Synthetic field_0142 / Synthetic field_0143</div>
    ${R.occam.cuts
      .map(
        (c) => `<div class="oc-item"><div class="oc-t">${c.item}</div><div class="oc-w">${c.why}</div><div class="oc-i"><b>→</b> ${c.instead}</div></div>`
      )
      .join("")}
  </div>
  <div class="oc-col oc-keep">
    <div class="oc-h">🛡 Synthetic field_0412</div>
    ${R.occam.keeps
      .map((c) => `<div class="oc-item"><div class="oc-t">${c.item}</div><div class="oc-w">${c.why}</div></div>`)
      .join("")}
  </div>
</div>`;


const addedHtml = `
${S("added", "Synthetic field_0413", "Synthetic field_0414（★）、Synthetic field_0415（◆），Synthetic field_0416，Synthetic field_0417")}

<div class="note">
  <b>Synthetic field_0418：</b>Synthetic field_0419（Synthetic field_0150、Synthetic field_0151、Synthetic field_0152、Synthetic field_0153），Synthetic field_0154；Synthetic field_0420。Synthetic field_0421 <span class="tag-star">★Synthetic field_0156</span> Synthetic field_0422（Synthetic field_0158），<span class="tag-add">◆Synthetic field_0159</span> Synthetic field_0423。
</div>

<div class="add-grid">
${R.additions
  .map(
    (a) => `<div class="add-card">
    <div class="add-h">${a.area}</div>
    <ul>${a.items.map((i) => `<li>${i}</li>`).join("")}</ul>
  </div>`
  )
  .join("")}
</div>`;


const bgHtml = `
${S("bg", "Synthetic field_0162", "Synthetic field_0424、Synthetic field_0425、Synthetic field_0426、Synthetic field_0427")}

<div class="ident">${P.background.identity}</div>

<h3 class="h3">Synthetic field_0048、Synthetic field_0163（Synthetic field_0164）</h3>
<ul class="bullets">${P.background.policies.map((p) => `<li>${p}</li>`).join("")}</ul>

<h3 class="h3">Synthetic field_0107、Synthetic field_0165</h3>
<div class="biz">
${P.background.business
  .map(
    (b) => `<div class="biz-card">
    <div class="biz-tag">${b.tag}</div>
    <div class="biz-name">${b.name}</div>
    <div class="biz-desc">${b.desc}</div>
    <div class="biz-facts"><b>Synthetic field_0167：</b>${b.facts}</div>
  </div>`
  )
  .join("")}
</div>

<h3 class="h3">Synthetic field_0147、SWOT</h3>
${table(
  P.swot.map((s) => s.t),
  [P.swot.map((s) => `<ul class="mini">${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>`)],
  "tb-swot"
)}

<h3 class="h3">Synthetic field_0161、Synthetic field_0169：Synthetic field_0428</h3>
<p class="lead">${P.background.competitors.intro}</p>
${table(
  ["Synthetic field_0170", "Synthetic field_0171", "Synthetic field_0172"],
  P.background.competitors.list.map((c) => [`<b>${c.who}</b>`, c.adv, c.our])
)}`;


const objHtml = `
${S("obj", "Synthetic field_0174", "Synthetic field_0429「Synthetic field_0430」Synthetic field_0431，Synthetic field_0432、Synthetic field_0433")}

<div class="north"><b>Synthetic field_0175：</b>${P.objectives.north}</div>

<h3 class="h3">Synthetic field_0048、Synthetic field_0176（Synthetic field_0080）</h3>
${table(
  ["Synthetic field_0081", "Synthetic field_0082", "Synthetic field_0058", "Synthetic field_0059"],
  P.objectives.funnel.map((f) => [`<b>${f.k}</b>`, f.metric, `<span class="hl">${f.target}</span>`, f.note])
)}

<h3 class="h3">Synthetic field_0107、Synthetic field_0177 KPI Synthetic field_0178</h3>
${table(
  ["Synthetic field_0179", "KPI", "Synthetic field_0180"],
  P.objectives.channelKpi.map((c) => [`<b>${c.ch}</b>`, c.kpi, c.owner])
)}`;


const personaHtml = `
${S("persona", "Synthetic field_0182", "Synthetic field_0434，Synthetic field_0435；Synthetic field_0436，Synthetic field_0437")}

<div class="note"><b>Synthetic field_0183：</b>Synthetic field_0438「Synthetic field_0185 / Synthetic field_0186 / Synthetic field_0187」Synthetic field_0188、Synthetic field_0189，Synthetic field_0439。Synthetic field_0191：Synthetic field_0192 EXAMPLE Synthetic field_0440<b>Synthetic field_0441、Synthetic field_0194、Synthetic field_0442</b>Synthetic field_0443，Synthetic field_0196「Synthetic field_0197」Synthetic field_0198「Synthetic field_0199」——Synthetic field_0200，Synthetic field_0201。</div>

<h3 class="h3">Synthetic field_0048、Synthetic field_0202 EXAMPLE Synthetic field_0203</h3>
${table(
  ["Synthetic field_0075", "Synthetic field_0204", "Synthetic field_0205"],
  P.timeline60.map((t) => [`<b>${t.p}</b>`, t.c, t.a])
)}

<h3 class="h3">Synthetic field_0107、Synthetic field_0206</h3>
<div class="per-grid">
${P.personas
  .map(
    (p) => `<div class="per">
    <div class="per-h"><span class="per-n">${p.name}</span><span class="per-r">Synthetic field_0207 ${p.rate}</span></div>
    <div class="per-tr"><b>Synthetic field_0208：</b>${p.trait}</div>
    <div class="per-st"><b>Synthetic field_0209：</b>${p.strategy}</div>
    <div class="per-sc"><b>Synthetic field_0210：</b>${p.script}</div>
  </div>`
  )
  .join("")}
</div>`;


const msg = P.messageHouse;
const msgHtml = `
${S("msg", "Synthetic field_0212", "Synthetic field_0444、Synthetic field_0445、Synthetic field_0446")}

<h3 class="h3">Synthetic field_0048、Synthetic field_0213</h3>
<div class="core-msg">${msg.core}</div>

<h3 class="h3">Synthetic field_0107、Synthetic field_0214（Synthetic field_0215）</h3>
${table(
  ["Synthetic field_0081", "Synthetic field_0216", "Synthetic field_0217"],
  msg.threeLayer.map((t) => [`<b>${t.k}</b>`, t.v, t.why])
)}

<h3 class="h3">Synthetic field_0147、Synthetic field_0218</h3>
<div class="sl-main">${msg.slogans.main.map((s) => `<div class="sl-item">${s}</div>`).join("")}</div>
${table(
  ["Synthetic field_0221", "Synthetic field_0447"],
  msg.slogans.sub.map((s) => [`<b>${s.b}</b>`, s.s.map((x) => `· ${x}`).join("<br>")])
)}
<h4 class="h4">Synthetic field_0223</h4>
${table(
  ["Synthetic field_0224", "Synthetic field_0225"],
  msg.slogans.scene.map((s) => [`<b>${s.s}</b>`, s.t])
)}

<h3 class="h3">Synthetic field_0161、FAQ Synthetic field_0226（Synthetic field_0227）</h3>
<div class="faq">
${msg.faq
  .map(
    (f) => `<details><summary>${f.q}</summary><div class="faq-a">${f.a}</div></details>`
  )
  .join("")}
</div>

<h3 class="h3">Synthetic field_0173、Synthetic field_0230：Synthetic field_0088「Synthetic field_0231」Synthetic field_0232「Synthetic field_0233」</h3>
${card(`<div class="prin"><b>Synthetic field_0234：</b>${msg.noIrritate.principle}</div>
${table(
  ["Synthetic field_0235", "Synthetic field_0236"],
  msg.noIrritate.rules.map((r) => [`<b>${r.t}</b>`, r.d])
)}`)}`;


const orgHtml = `
${S("org", "Synthetic field_0238", "EXAMPLE Synthetic field_0448 + Synthetic field_0449 EXAMPLE Synthetic field_0450，Synthetic field_0451")}

<p class="lead">${P.org.intro}</p>

<h3 class="h3">Synthetic field_0048、Synthetic field_0239 KPI</h3>
${table(
  ["Synthetic field_0240", "Synthetic field_0241", "Synthetic field_0242", "Synthetic field_0243 KPI"],
  P.org.members.map((m) => [`<b>${m.name}</b>`, m.role, m.duty, m.kpi])
)}

<h3 class="h3">Synthetic field_0107、RACI Synthetic field_0244（A=Synthetic field_0245，R=Synthetic field_0246，C=Synthetic field_0247，I=Synthetic field_0248）</h3>
${table(["Synthetic field_0249", "A Synthetic field_0180", "R Synthetic field_0246", "C Synthetic field_0250", "I Synthetic field_0251"], P.org.raci.map((r) => [`<b>${r.task}</b>`, r.a, r.r, r.c, r.i]))}

<h3 class="h3">Synthetic field_0147、Synthetic field_0252</h3>
<div class="rit">
${P.org.rituals.map((r) => `<div class="rit-item"><div class="rit-t">${r.t}</div><div class="rit-d">${r.d}</div></div>`).join("")}
</div>`;


const phaseHtml =
  S("phase", "Synthetic field_0007", "Synthetic field_0254：Synthetic field_0255 / Synthetic field_0256 / Synthetic field_0257 / Synthetic field_0258 / Synthetic field_0210 / Synthetic field_0259 / Synthetic field_0260——Synthetic field_0261") +
  P.phases
    .map((p) => {
      const actions = p.actions
        .map(
          (a) => `<li><span class="tag ${a.tag && a.tag.indexOf("Synthetic field_0159") >= 0 ? "tag-add" : "tag-star"}">${a.tag}</span>${a.t}</li>`
        )
        .join("");
      return `<div class="phase" id="phase-${p.id}">
  <div class="ph-head">
    <div class="ph-id">${p.id}</div>
    <div class="ph-title">
      <div class="ph-name">${p.name} <span class="ph-tag">${p.tag}</span></div>
      <div class="ph-date">${p.date}</div>
    </div>
  </div>
  <div class="ph-body">
    <div class="ph-goal"><b>Synthetic field_0262：</b>${p.goal}</div>
    <div class="ph-kpi"><b>Synthetic field_0259 KPI：</b><ul>${p.kpi.map((k) => `<li>${k}</li>`).join("")}</ul></div>

    <div class="ph-grid">
      <div class="ph-box">
        <div class="ph-box-h">Synthetic field_0263</div>
        <ul class="ph-act">${actions}</ul>
      </div>
      <div class="ph-box">
        <div class="ph-box-h">Synthetic field_0264</div>
        <ul class="ph-list">${p.materials.map((m) => `<li>${m}</li>`).join("")}</ul>
        <div class="ph-box-h mt">Synthetic field_0152</div>
        <div class="ph-own">${p.owners}</div>
      </div>
    </div>

    <div class="ph-script"><div class="ph-box-h">Synthetic field_0265</div>${nl2br(p.script)}</div>

    <div class="ph-grid">
      <div class="ph-box ok">
        <div class="ph-box-h">✓ Synthetic field_0266</div>
        <ul class="ph-list">${p.acceptance.map((a) => `<li>${a}</li>`).join("")}</ul>
      </div>
      <div class="ph-box warn">
        <div class="ph-box-h">⚠ Synthetic field_0267</div>
        <ul class="ph-list">${p.risks.map((r) => `<li><b>${r.r}</b>：${r.p}</li>`).join("")}</ul>
      </div>
    </div>
  </div>
</div>`;
    })
    .join("");


const C = O.content;
const contentHtml = `
${S("content", "Synthetic field_0269", "Synthetic field_0452、Synthetic field_0453、Synthetic field_0454、Synthetic field_0455——Synthetic field_0456")}

<h3 class="h3">Synthetic field_0048、Synthetic field_0270：EXAMPLE Synthetic field_0271</h3>
<div class="note"><b>Synthetic field_0272：</b>${C.poster.principle}</div>
${table(
  ["Synthetic field_0273", "Synthetic field_0274"],
  C.poster.layers.map((l) => [`<b>${l.k}</b>`, l.v])
)}
<div class="note mt">${C.poster.specs}</div>

<h3 class="h3">Synthetic field_0107、Synthetic field_0457：Synthetic field_0276 EXAMPLE Synthetic field_0458，Synthetic field_0459</h3>
<div class="flyer-wrap">
  <div class="flyer">
    <div class="flyer-side">Synthetic field_0276 FRONT</div>
    <div class="fy-head">${C.flyer.front.head}</div>
    <div class="fy-sub">${C.flyer.front.sub}</div>
    <div class="fy-hook">${C.flyer.front.hook}</div>
    <div class="fy-bene">${C.flyer.front.benefits}</div>
    <div class="fy-qr">${C.flyer.front.qr}</div>
    <div class="fy-note">${C.flyer.front.note}</div>
  </div>
  <div class="flyer">
    <div class="flyer-side">Synthetic field_0277 BACK</div>
    <div class="fy-title">${C.flyer.back.title}</div>
    <ul class="fy-paths">${C.flyer.back.paths.map((p) => `<li><b>${p.n}</b><br>${p.d}</li>`).join("")}</ul>
    <div class="fy-data">${C.flyer.back.data}</div>
    <div class="fy-contact">${C.flyer.back.contact}</div>
  </div>
</div>

<h3 class="h3">Synthetic field_0147、Synthetic field_0280：EXAMPLE Synthetic field_0281（Synthetic field_0282，Synthetic field_0283）</h3>
<div class="wall">
${C.campusWall
  .map(
    (w) => `<div class="w-item">
    <div class="w-no">${w.no}</div>
    <div class="w-body">
      <div class="w-title">${w.title}</div>
      <div class="w-text">${w.body}</div>
      <div class="w-meta"><b>Synthetic field_0287：</b>${w.tag}</div>
      <div class="w-cta"><b>Synthetic field_0288：</b>${w.cta}</div>
    </div>
  </div>`
  )
  .join("")}
</div>

<h3 class="h3">Synthetic field_0161、Synthetic field_0290（EXAMPLE Synthetic field_0291）</h3>
${C.live
  .map(
    (l) => `<div class="live">
    <div class="live-h">${l.no}《${l.title}》<span class="live-when">${l.when}　Synthetic field_0292 ${l.dur}</span></div>
    <ol class="live-flow">${l.flow.map((f) => `<li>${f}</li>`).join("")}</ol>
    <div class="live-tip"><b>Synthetic field_0293：</b>${l.tips}</div>
  </div>`
  )
  .join("")}

<h3 class="h3">Synthetic field_0173、Synthetic field_0294（EXAMPLE Synthetic field_0460 EXAMPLE Synthetic field_0461）</h3>
<ul class="bullets">${C.shortVideo.map((v) => `<li>${v}</li>`).join("")}</ul>`;


const opsHtml = `
${S("ops", "Synthetic field_0298 SOP", "Synthetic field_0462，Synthetic field_0463")}

<h3 class="h3">Synthetic field_0048、Synthetic field_0464</h3>
<div class="note"><b>Synthetic field_0299：</b>${O.points.principle}</div>
${table(
  ["Synthetic field_0301", "Synthetic field_0302", "Synthetic field_0303"],
  O.points.earn.map((e) => [e.act, `<span class="pt">+${e.p}</span>`, e.cap])
)}
<h4 class="h4">Synthetic field_0304</h4>
${table(
  ["Synthetic field_0305", "Synthetic field_0306"],
  O.points.redeem.map((r) => [`<span class="pt">${r.p}</span>`, r.r])
)}
<h4 class="h4">Synthetic field_0307</h4>
<ul class="bullets">${O.points.rules.map((r) => `<li>${r}</li>`).join("")}</ul>

<h3 class="h3">Synthetic field_0107、Synthetic field_0308</h3>
${table(
  ["Synthetic field_0081", "Synthetic field_0078", "Synthetic field_0307"],
  O.community.layers.map((l) => [`<b>${l.n}</b>`, l.g, l.rule])
)}

<h3 class="h3">Synthetic field_0147、Synthetic field_0309（Synthetic field_0310）</h3>
<div class="welcome">${nl2br(O.community.welcome)}</div>

<h3 class="h3">Synthetic field_0161、Synthetic field_0311</h3>
${table(
  ["Synthetic field_0312", "Synthetic field_0313"],
  O.community.calendar.map((c) => [`<b>${c.d}</b>`, c.c])
)}

<h3 class="h3">Synthetic field_0173、Synthetic field_0314 SOP</h3>
${table(
  ["Synthetic field_0315", "Synthetic field_0256"],
  O.community.sop.map((s) => [`<b>${s.t}</b>`, s.d])
)}`;


const budgetHtml = `
${S("budget", "Synthetic field_0317", "Synthetic field_0465、Synthetic field_0320、Synthetic field_0321、Synthetic field_0466，Synthetic field_0467")}

<div class="note">${O.budget.note}</div>

${table(["Synthetic field_0318", "Synthetic field_0010", "Synthetic field_0319", "Synthetic field_0320", "Synthetic field_0321", "Synthetic field_0322", "Synthetic field_0323"], budgetRows, "tb-budget")}

<div class="bud-sum">
  <div class="bs-row"><span>Synthetic field_0325</span><b>¥ ${Math.round(subtotal).toLocaleString()}</b></div>
  ${Object.entries(grouped)
    .map(([k, v]) => `<div class="bs-sub"><span>${k}</span><b>¥ ${Math.round(v).toLocaleString()}</b></div>`)
    .join("")}
  <div class="bs-row"><span>Synthetic field_0035（EXAMPLE）</span><b>¥ ${Math.round(reserve).toLocaleString()}</b></div>
  <div class="bs-total"><span>Synthetic field_0326</span><b>¥ ${Math.round(total).toLocaleString()}</b></div>
</div>

<h3 class="h3">Synthetic field_0327</h3>
${table(
  ["Synthetic field_0328", "Synthetic field_0329", "Synthetic field_0330", "Synthetic field_0331"],
  O.budget.tiers.map((t) => [`<b>${t.n}</b>`, t.total, t.cut, t.fit])
)}

<div class="note mt"><b>Synthetic field_0332：</b>Synthetic field_0333 EXAMPLE Synthetic field_0334；Synthetic field_0335；Synthetic field_0336，Synthetic field_0337，Synthetic field_0338。Synthetic field_0339。</div>`;


const riskHtml = `
${S("risk", "Synthetic field_0341", "EXAMPLE Synthetic field_0468 + EXAMPLE Synthetic field_0469")}

<h3 class="h3">Synthetic field_0048、Synthetic field_0342（Synthetic field_0470）</h3>
${table(
  ["Synthetic field_0343", "Synthetic field_0344", "Synthetic field_0345", "Synthetic field_0346", "Synthetic field_0180"],
  O.risks.map((r) => [`<span class="rt">${r.t}</span>`, `<b>${r.s}</b>`, r.p, r.r, r.o]),
  "tb-risk2"
)}

<h3 class="h3">Synthetic field_0107、Synthetic field_0347（P0 Synthetic field_0348 EXAMPLE Synthetic field_0349）</h3>
${table(
  ["#", "Synthetic field_0350", "Synthetic field_0236", "Synthetic field_0351", "Synthetic field_0180"],
  O.compliance.map((c) => [c.i, `<b>${c.t}</b>`, c.d, c.when, c.o])
)}

<div class="alert"><b>Synthetic field_0352：</b>Synthetic field_0353 EXAMPLE—EXAMPLE Synthetic field_0354（Synthetic field_0355、Synthetic field_0356、Synthetic field_0357）Synthetic field_0358，P1—P5 Synthetic field_0359。Synthetic field_0360，Synthetic field_0361「Synthetic field_0362」Synthetic field_0363——Synthetic field_0364，Synthetic field_0365，Synthetic field_0366。</div>`;


const dataHtml = `
${S("data", "Synthetic field_0368", "Synthetic field_0471，Synthetic field_0472")}

<h3 class="h3">Synthetic field_0048、Synthetic field_0369</h3>
<div class="note">${O.measurement.channelCodes}</div>

<h3 class="h3">Synthetic field_0107、Synthetic field_0370</h3>
${table(
  ["Synthetic field_0371", "Synthetic field_0372"],
  O.measurement.dashboard.map((d) => [`<b>${d.k}</b>`, d.f])
)}

<h3 class="h3">Synthetic field_0147、Synthetic field_0373</h3>
<div class="note"><b>Synthetic field_0374：</b>${O.measurement.daily}</div>
<div class="note mt"><b>Synthetic field_0375：</b>${O.measurement.warning}</div>

<h3 class="h3">Synthetic field_0161、Synthetic field_0376</h3>
<ol class="bullets">${O.measurement.review.map((r) => `<li>${r}</li>`).join("")}</ol>`;


const appxHtml = `
${S("appx", "Synthetic field_0378", "Synthetic field_0473")}
${table(
  ["Synthetic field_0379", "Synthetic field_0011"],
  O.appendices.map((a) => [`<b>${a.t}</b>`, a.d])
)}
<div class="end">— Synthetic field_0380 · EXAMPLE Synthetic field_0022 EXAMPLE Synthetic field_0023 —</div>`;


const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Synthetic field_0004 · EXAMPLE Synthetic field_0005</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
--navy:#0B3C5D; --navy2:#134F76; --blue:#1B6CA8; --blue-l:#E8F2F9;
--orange:#E8730C; --orange-l:#FDF0E6;
--ink:#1A2530; --ink2:#42525F; --ink3:#6B7C8A;
--line:#DDE5EC; --bg:#F5F8FA; --white:#fff;
--green:#0E7A5F; --green-l:#E6F5F0;
--red:#C0392B; --red-l:#FDECEA; --amber:#B5710A; --amber-l:#FDF5E3;
}
body{font-family:"Microsoft YaHei","PingFang SC","Hiragino Sans GB","Source Han Sans SC",sans-serif;background:var(--bg);color:var(--ink);line-height:1.75;font-size:15px;-webkit-font-smoothing:antialiased}
/* ===== Synthetic field_0474 ===== */
.cover{background:linear-gradient(135deg,#0B3C5D 0%,#134F76 55%,#1B6CA8 100%);color:#fff;padding:54px 60px 46px;position:relative;overflow:hidden}
.cover::after{content:"";position:absolute;right:-60px;top:-60px;width:360px;height:360px;border:1px solid rgba(255,255,255,.13);border-radius:50%}
.cover::before{content:"";position:absolute;right:40px;bottom:-120px;width:280px;height:280px;border:1px solid rgba(255,255,255,.10);border-radius:50%}
.cv-eyebrow{font-size:13px;letter-spacing:3px;color:#9FC6E0;margin-bottom:14px}
.cv-h1{font-size:36px;font-weight:700;letter-spacing:1px;line-height:1.3}
.cv-h2{font-size:19px;color:#BBD9EE;margin-top:12px;font-weight:400}
.cv-meta{display:flex;flex-wrap:wrap;gap:28px;margin-top:30px;position:relative;z-index:2}
.cv-m div{font-size:13px;color:#9FC6E0}.cv-m b{display:block;font-size:15px;color:#fff;font-weight:600;margin-top:3px}
/* ===== Synthetic field_0475 ===== */
.wrap{display:flex;align-items:flex-start;max-width:1560px;margin:0 auto}
.side{width:236px;flex:0 0 236px;position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--white);border-right:1px solid var(--line);padding:22px 0}
.side-t{font-size:12px;color:var(--ink3);letter-spacing:1px;padding:0 22px 10px;font-weight:700}
.side a{display:block;padding:9px 22px;color:var(--ink2);text-decoration:none;font-size:14px;border-left:3px solid transparent;transition:.15s}
.side a:hover{background:var(--blue-l);color:var(--blue);border-left-color:var(--blue)}
.main{flex:1;min-width:0;padding:34px 46px 80px}
/* ===== Synthetic field_0476 ===== */
.sec{margin-bottom:52px;scroll-margin-top:16px}
.sec-head{display:flex;gap:16px;align-items:flex-start;padding-bottom:16px;border-bottom:2px solid var(--navy);margin-bottom:24px}
.sec-num{font-size:26px;font-weight:800;color:var(--orange);line-height:1;font-family:Georgia,serif}
.sec-head h2{font-size:24px;color:var(--navy);letter-spacing:.5px}
.sec-sub{font-size:14px;color:var(--ink3);margin-top:5px}
h3.h3{font-size:18px;color:var(--navy2);margin:30px 0 14px;padding-left:11px;border-left:4px solid var(--orange)}
h4.h4{font-size:15px;color:var(--navy2);margin:20px 0 10px}
.lead{color:var(--ink2);margin-bottom:14px;font-size:14px}
.note{background:var(--blue-l);border-left:4px solid var(--blue);padding:13px 16px;border-radius:0 6px 6px 0;font-size:14px;color:#1F4B68;margin:12px 0}
.note.mt{margin-top:16px}
.alert{background:var(--red-l);border-left:4px solid var(--red);padding:15px 18px;border-radius:0 6px 6px 0;font-size:14px;color:#7D2B22;margin-top:18px}
.card{background:var(--white);border:1px solid var(--line);border-radius:10px;padding:22px;margin:14px 0}
ul.bullets,ul.mini{margin:8px 0 8px 20px}
ul.bullets li{margin-bottom:7px;font-size:14px}
ul.mini li{margin-bottom:5px;font-size:13px;list-style:none;position:relative;padding-left:12px}
ul.mini li::before{content:"·";position:absolute;left:0;color:var(--blue);font-weight:700}
/* ===== Synthetic field_0477 ===== */
.tb{width:100%;border-collapse:collapse;background:var(--white);font-size:13.5px;margin:12px 0;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.tb th{background:var(--navy);color:#fff;padding:11px 12px;text-align:left;font-weight:600;font-size:13px}
.tb td{padding:11px 12px;border-top:1px solid var(--line);vertical-align:top;color:var(--ink2)}
.tb tbody tr:nth-child(even){background:#FAFCFD}
.tb tbody tr:hover{background:var(--blue-l)}
.tb-swot th{background:var(--navy2)}
.tb-budget td:nth-child(5),.tb-budget td:nth-child(6){text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.tb-budget td:nth-child(4){text-align:center}
/* ===== Synthetic field_0478 ===== */
.kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:6px 0 10px}
.kpi{background:linear-gradient(160deg,#134F76,#1B6CA8);color:#fff;border-radius:10px;padding:18px 20px}
.kpi-n{font-size:30px;font-weight:800;font-family:Georgia,serif;line-height:1.1}
.kpi-n span{font-size:15px;font-weight:600;margin-left:3px}
.kpi-l{font-size:12.5px;color:#BBD9EE;margin-top:6px}
.phase-strip{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 4px}
.ps{background:var(--white);border:1px solid var(--line);border-top:3px solid var(--orange);border-radius:8px;padding:11px 15px;min-width:150px}
.ps-id{font-family:Georgia,serif;font-weight:800;color:var(--orange);font-size:17px}
.ps-name{font-weight:700;color:var(--navy);font-size:14px;margin-top:2px}
.ps-date{font-size:12px;color:var(--ink3);margin-top:3px}
.funnel{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px}
.fn{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:15px 16px;position:relative}
.fn-k{display:inline-block;background:var(--navy);color:#fff;font-size:11.5px;padding:2px 9px;border-radius:4px;margin-bottom:9px}
.fn-m{font-size:13.5px;font-weight:600;color:var(--ink)}
.fn-t{font-size:17px;font-weight:800;color:var(--orange);margin:5px 0 6px;font-family:Georgia,serif}
.fn-n{font-size:12px;color:var(--ink3);line-height:1.6}
.three{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:8px}
.th{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:17px 19px}
.th-t{font-weight:700;color:var(--navy);font-size:15px;margin-bottom:7px}
.th p{font-size:13.5px;color:var(--ink2)}
/* ===== Synthetic field_0479 ===== */
.verdict{display:flex;gap:26px;flex-wrap:wrap;align-items:flex-start}
.vd-score{background:linear-gradient(160deg,#B5710A,#E8730C);color:#fff;padding:16px 20px;border-radius:9px;font-weight:700;font-size:15px;min-width:210px;line-height:1.8}
.vd-list{flex:1;min-width:320px;margin-left:18px}
.vd-list li{margin-bottom:9px;font-size:14px;color:var(--ink2)}
.lvl{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11.5px;font-weight:700;white-space:nowrap}
.lvl-f{background:var(--red-l);color:var(--red)}
.lvl-h{background:var(--amber-l);color:var(--amber)}
.lvl-m{background:var(--blue-l);color:var(--blue)}
.tb-risk td:nth-child(3),.tb-risk td:nth-child(4){font-size:13px}
.axiom{background:var(--orange-l);border-left:4px solid var(--orange);padding:13px 16px;border-radius:0 6px 6px 0;margin-bottom:14px;font-size:14.5px}
.sq{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:12px}
.sq-item{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:14px 17px}
.sq-q{font-weight:700;color:var(--navy);font-size:14.5px;margin-bottom:7px}
.sq-q::before{content:"Q  ";color:var(--orange);font-family:Georgia,serif}
.sq-a{font-size:13.5px;color:var(--ink2)}
.sq-a::before{content:"A  ";color:var(--blue);font-family:Georgia,serif;font-weight:700}
.occam{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.oc-col{background:var(--white);border:1px solid var(--line);border-radius:10px;padding:18px}
.oc-cut{border-top:3px solid var(--red)}
.oc-keep{border-top:3px solid var(--green)}
.oc-h{font-weight:800;color:var(--navy);font-size:15px;margin-bottom:12px;padding-bottom:9px;border-bottom:1px dashed var(--line)}
.oc-item{margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #F0F4F7}
.oc-item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.oc-t{font-weight:700;color:var(--ink);font-size:14px}
.oc-w{font-size:13px;color:var(--ink3);margin:4px 0 6px}
.oc-i{font-size:13px;color:var(--green);background:var(--green-l);padding:7px 10px;border-radius:5px}
/* ===== Synthetic field_0388 ===== */
.add-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.add-card{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:16px 18px}
.add-h{font-weight:800;color:var(--navy);font-size:15px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--blue-l)}
.add-card ul{margin-left:18px}
.add-card li{font-size:13.5px;color:var(--ink2);margin-bottom:7px}
.tag-star{display:inline-block;background:var(--green-l);color:var(--green);font-size:11px;padding:1px 7px;border-radius:4px;margin-right:6px;font-weight:700;white-space:nowrap}
.tag-add{display:inline-block;background:var(--orange-l);color:var(--orange);font-size:11px;padding:1px 7px;border-radius:4px;margin-right:6px;font-weight:700;white-space:nowrap}
/* ===== Synthetic field_0480 ===== */
.ident{background:linear-gradient(120deg,#0B3C5D,#1B6CA8);color:#fff;padding:18px 22px;border-radius:9px;font-size:14.5px;line-height:1.85}
.biz{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.biz-card{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:17px 19px;border-top:3px solid var(--blue)}
.biz-tag{display:inline-block;background:var(--blue-l);color:var(--blue);font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:4px}
.biz-name{font-size:16px;font-weight:700;color:var(--navy);margin:9px 0 8px}
.biz-desc{font-size:13.5px;color:var(--ink2);margin-bottom:10px}
.biz-facts{font-size:12.5px;color:var(--ink3);background:#FAFCFD;padding:9px 11px;border-radius:5px;border-left:3px solid var(--orange)}
.north{background:var(--orange-l);border-left:4px solid var(--orange);padding:14px 18px;border-radius:0 6px 6px 0;font-size:14.5px}
.hl{color:var(--orange);font-weight:700}
/* ===== Synthetic field_0481 ===== */
.per-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:13px}
.per{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:15px 18px}
.per-h{display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px dashed var(--line);margin-bottom:9px}
.per-n{font-weight:800;color:var(--navy);font-size:15px}
.per-r{font-size:12px;color:#fff;background:var(--blue);padding:2px 9px;border-radius:11px}
.per-tr,.per-st{font-size:13.5px;color:var(--ink2);margin-bottom:7px}
.per-sc{font-size:13px;color:var(--ink3);background:var(--blue-l);padding:9px 11px;border-radius:5px;font-style:italic}
/* ===== Synthetic field_0482 ===== */
.core-msg{background:linear-gradient(120deg,#134F76,#1B6CA8);color:#fff;font-size:21px;font-weight:700;text-align:center;padding:24px;border-radius:10px;letter-spacing:1px}
.sl-main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px;margin-bottom:14px}
.sl-item{background:var(--orange-l);border-left:4px solid var(--orange);padding:12px 16px;border-radius:0 6px 6px 0;font-weight:600;color:#8A4A08;font-size:14.5px}
.faq details{background:var(--white);border:1px solid var(--line);border-radius:8px;margin-bottom:8px}
.faq summary{padding:12px 17px;cursor:pointer;font-weight:600;color:var(--navy);font-size:14px;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::before{content:"＋";color:var(--orange);font-weight:800;margin-right:9px}
.faq details[open] summary::before{content:"－"}
.faq details[open] summary{border-bottom:1px solid var(--line);background:var(--blue-l)}
.faq-a{padding:13px 17px 15px 34px;font-size:13.5px;color:var(--ink2)}
.prin{background:var(--green-l);border-left:4px solid var(--green);padding:13px 16px;border-radius:0 6px 6px 0;margin-bottom:14px;font-size:14px}
/* ===== Synthetic field_0483 ===== */
.rit{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.rit-item{background:var(--white);border:1px solid var(--line);border-left:3px solid var(--navy);border-radius:0 8px 8px 0;padding:14px 17px}
.rit-t{font-weight:700;color:var(--navy);font-size:14px;margin-bottom:5px}
.rit-d{font-size:13px;color:var(--ink2)}
/* ===== Synthetic field_0075 ===== */
.phase{background:var(--white);border:1px solid var(--line);border-radius:11px;margin-bottom:20px;overflow:hidden}
.ph-head{display:flex;gap:16px;align-items:center;background:linear-gradient(120deg,#0B3C5D,#1B6CA8);color:#fff;padding:15px 22px}
.ph-id{font-family:Georgia,serif;font-size:24px;font-weight:800;background:rgba(255,255,255,.16);border-radius:7px;padding:5px 13px}
.ph-name{font-size:18px;font-weight:700}
.ph-tag{font-size:11.5px;background:rgba(255,255,255,.2);padding:2px 9px;border-radius:10px;margin-left:8px;font-weight:400}
.ph-date{font-size:12.5px;color:#BBD9EE;margin-top:3px}
.ph-body{padding:18px 22px 22px}
.ph-goal{background:var(--blue-l);padding:11px 15px;border-radius:6px;font-size:14px;color:#1F4B68;margin-bottom:10px}
.ph-kpi{background:var(--orange-l);padding:11px 15px;border-radius:6px;font-size:13.5px;color:#8A4A08;margin-bottom:16px}
.ph-kpi ul{margin:6px 0 0 20px}
.ph-kpi li{display:inline-block;margin-right:16px}
.ph-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:14px;margin-bottom:14px}
.ph-box{background:#FAFCFD;border:1px solid var(--line);border-radius:8px;padding:14px 16px}
.ph-box.ok{background:var(--green-l);border-color:#BFE3D6}
.ph-box.warn{background:#FFFBF0;border-color:#F0E0BE}
.ph-box-h{font-weight:800;color:var(--navy);font-size:13.5px;margin-bottom:9px;letter-spacing:.5px}
.ph-box-h.mt{margin-top:16px}
.ph-act{list-style:none}
.ph-act li{font-size:13.5px;color:var(--ink2);margin-bottom:9px;line-height:1.7;padding-left:2px}
.ph-list{margin-left:17px}
.ph-list li{font-size:13.5px;color:var(--ink2);margin-bottom:6px}
.ph-own{font-size:13.5px;color:var(--ink2)}
.ph-script{background:#FFFBF0;border:1px solid #F0E0BE;border-radius:8px;padding:14px 17px;font-size:13.5px;color:#6B4E10;margin-bottom:14px;line-height:1.85}
.ph-script .ph-box-h{color:#8A6A15}
/* ===== Synthetic field_0269 ===== */
.flyer-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.flyer{background:var(--white);border:2px dashed var(--blue);border-radius:10px;padding:20px 22px;position:relative;min-height:290px}
.flyer-side{position:absolute;top:-1px;right:-1px;background:var(--blue);color:#fff;font-size:11px;padding:3px 11px;border-radius:0 8px 0 8px;letter-spacing:1px}
.fy-head{font-size:20px;font-weight:800;color:var(--navy);line-height:1.5;margin-bottom:8px}
.fy-sub{font-size:12.5px;color:var(--ink3);margin-bottom:14px}
.fy-hook{font-size:16px;font-weight:700;color:var(--orange);background:var(--orange-l);padding:11px 14px;border-radius:6px;line-height:1.7}
.fy-bene{font-size:12.5px;color:var(--ink2);margin:12px 0;line-height:2}
.fy-qr{text-align:center;border:2px dashed var(--line);padding:18px;border-radius:8px;color:var(--ink3);font-size:13px;margin:12px 0}
.fy-note{font-size:12px;color:var(--ink3);text-align:center}
.fy-title{font-size:17px;font-weight:800;color:var(--navy);margin-bottom:12px;padding-bottom:9px;border-bottom:2px solid var(--blue-l)}
.fy-paths{list-style:none;margin-bottom:12px}
.fy-paths li{font-size:13px;color:var(--ink2);margin-bottom:10px;padding-left:12px;border-left:3px solid var(--orange);line-height:1.7}
.fy-paths b{color:var(--navy)}
.fy-data{background:var(--blue-l);padding:11px 13px;border-radius:6px;font-size:13px;color:#1F4B68;margin-bottom:10px}
.fy-contact{font-size:12.5px;color:var(--ink3)}
.wall{display:flex;flex-direction:column;gap:12px}
.w-item{display:flex;gap:14px;background:var(--white);border:1px solid var(--line);border-radius:9px;padding:15px 18px}
.w-no{font-family:Georgia,serif;font-weight:800;color:var(--orange);font-size:14px;white-space:nowrap}
.w-title{font-weight:700;color:var(--navy);font-size:15px;margin-bottom:7px}
.w-text{font-size:13.5px;color:var(--ink2);line-height:1.85;margin-bottom:9px}
.w-meta{font-size:12.5px;color:var(--ink3);background:#FAFCFD;padding:7px 11px;border-radius:5px;margin-bottom:6px}
.w-cta{font-size:12.5px;color:var(--green);background:var(--green-l);padding:7px 11px;border-radius:5px}
.live{background:var(--white);border:1px solid var(--line);border-radius:9px;padding:16px 19px;margin-bottom:13px}
.live-h{font-weight:700;color:var(--navy);font-size:15px;margin-bottom:11px;padding-bottom:9px;border-bottom:1px dashed var(--line)}
.live-when{font-size:12.5px;color:var(--ink3);font-weight:400;margin-left:10px}
.live-flow{margin-left:20px;margin-bottom:12px}
.live-flow li{font-size:13.5px;color:var(--ink2);margin-bottom:6px}
.live-tip{font-size:13px;color:#8A4A08;background:var(--orange-l);padding:10px 13px;border-radius:6px}
/* ===== Synthetic field_0302 ===== */
.pt{display:inline-block;background:var(--orange);color:#fff;font-weight:700;font-size:12.5px;padding:2px 10px;border-radius:11px}
.welcome{background:var(--white);border:1px solid var(--line);border-left:4px solid var(--green);border-radius:0 8px 8px 0;padding:16px 19px;font-size:13.5px;color:var(--ink2);white-space:pre-line;line-height:1.9}
/* ===== Synthetic field_0329 ===== */
.bud-sum{background:var(--white);border:2px solid var(--navy);border-radius:10px;padding:16px 22px;margin-top:16px;max-width:520px;margin-left:auto}
.bs-row{display:flex;justify-content:space-between;padding:7px 0;font-size:14px;border-bottom:1px solid var(--line)}
.bs-sub{display:flex;justify-content:space-between;padding:5px 0 5px 20px;font-size:13px;color:var(--ink3)}
.bs-total{display:flex;justify-content:space-between;padding:13px 0 2px;font-size:19px;font-weight:800;color:var(--navy);font-family:Georgia,serif}
/* ===== Synthetic field_0260 ===== */
.rt{display:inline-block;background:var(--navy);color:#fff;font-size:11.5px;padding:2px 9px;border-radius:4px;white-space:nowrap}
.tb-risk2 td:nth-child(4){font-size:13px}
/* ===== Synthetic field_0484 ===== */
.end{text-align:center;color:var(--ink3);font-size:13px;padding:34px 0 6px;letter-spacing:1px}
@media print{
  .side{display:none}
  .main{padding:0;max-width:none}
  body{background:#fff;font-size:11.5pt}
  .sec{page-break-inside:auto}
  .phase,.tb,.card,.w-item,.live,.per,.biz-card{page-break-inside:avoid}
  .cover{padding:30px}
  h3.h3{page-break-after:avoid}
}
@media (max-width:1180px){
  .side{display:none}
  .main{padding:24px 20px 60px}
  .ph-grid,.occam,.flyer-wrap{grid-template-columns:1fr}
  .cover{padding:36px 24px}
  .cv-h1{font-size:26px}
}
</style>
<style data-portable-demo="mobile-tables">@media(max-width:700px){.tb{width:100%;table-layout:fixed}.tb th,.tb td{overflow-wrap:anywhere}}</style></head>
<body><aside style="padding:16px 24px;background:#032b41;color:#fff;font:16px/1.5 system-ui;max-width:100%;box-sizing:border-box">SYNTHETIC DEMONSTRATION · Newly fabricated input. No original budget, personnel information or business copy is included.</aside>

<header class="cover">
  <div class="cv-eyebrow">Synthetic field_0002 · Synthetic field_0003</div>
  <h1 class="cv-h1">Synthetic field_0004 · EXAMPLE Synthetic field_0005</h1>
  <div class="cv-h2">Synthetic field_0006 · Synthetic field_0007 · Synthetic field_0008 · Synthetic field_0009</div>
  <div class="cv-meta">
    <div class="cv-m"><div>Synthetic field_0012</div><b>Synthetic field_0013</b></div>
    <div class="cv-m"><div>Synthetic field_0015</div><b>Synthetic field_0016 · Synthetic field_0017 · Synthetic field_0018 · Synthetic field_0019 · Synthetic field_0020</b></div>
    <div class="cv-m"><div>Synthetic field_0021</div><b>EXAMPLE — Synthetic field_0025</b></div>
    <div class="cv-m"><div>Synthetic field_0033</div><b>¥ ${Math.round(total).toLocaleString()}</b></div>
    <div class="cv-m"><div>Synthetic field_0038</div><b>V2.EXAMPLE（Synthetic field_0039）</b></div>
  </div>
</header>

<div class="wrap">
  <nav class="side">
    <div class="side-t">Synthetic field_0040 Synthetic field_0041</div>
    ${nav.map((n) => `<a href="#${n[0]}">${n[1]}</a>`).join("")}
  </nav>
  <main class="main">
    ${sumHtml}
    ${reviewHtml}</section>
    ${addedHtml}</section>
    ${bgHtml}</section>
    ${objHtml}</section>
    ${personaHtml}</section>
    ${msgHtml}</section>
    ${orgHtml}</section>
    ${phaseHtml}</section>
    ${contentHtml}</section>
    ${opsHtml}</section>
    ${budgetHtml}</section>
    ${riskHtml}</section>
    ${dataHtml}</section>
    ${appxHtml}</section>
  </main>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, "synthetic-plan.html"), html, "utf8");
console.log("HTML OK ->", path.join(OUT, "synthetic-plan.html"));
console.log("Synthetic field_0386(Synthetic field_0387):", Math.round(total));
console.log("Synthetic field_0485:", Math.round(subtotal), "Synthetic field_0402:", Math.round(reserve));
