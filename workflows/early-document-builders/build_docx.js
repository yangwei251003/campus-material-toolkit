// Early local layout program with newly fabricated synthetic content.
const EARLY=require('./early-runtime.cjs');
EARLY.configure();
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition
} = require("docx");

const R = require("./content/01-review.js");
const P = require("./content/02-plan.js");
const O = require("./content/03-ops.js");

const OUT = EARLY.output();
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const FONT = "Synthetic field_0001";
const NAVY = "0B3C5D";
const ORANGE = "C8640A";
const GREY = "5A6B78";


const strip = (s) =>
  String(s)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

function inline(s, base = {}) {
  const out = [];
  const re = /<b>([\s\S]*?)<\/b>|<u>([\s\S]*?)<\/u>/g;
  let last = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      const t = strip(s.slice(last, m.index));
      if (t) out.push(new TextRun({ text: t, font: FONT, ...base }));
    }
    if (m[1] !== undefined) {
      const t = strip(m[1]);
      if (t) out.push(new TextRun({ text: t, font: FONT, bold: true, ...base }));
    } else {
      const t = strip(m[2]);
      if (t) out.push(new TextRun({ text: t, font: FONT, underline: {}, ...base }));
    }
    last = m.index + m[0].length;
  }
  const t = strip(s.slice(last));
  if (t) out.push(new TextRun({ text: t, font: FONT, ...base }));
  if (!out.length) out.push(new TextRun({ text: "", font: FONT, ...base }));
  return out;
}


const paras = (s, opts = {}) =>
  String(s)
    .split(/<br\s*\/?>/gi)
    .map((x) => new Paragraph({ children: inline(x, opts.run || {}), ...opts.para }));

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: FONT })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: FONT })] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, font: FONT })] });
const p = (t, o = {}) => new Paragraph({ children: inline(t, o.run || {}), spacing: { after: 120, line: 320 }, ...(o.para || {}) });
const lead = (t) => new Paragraph({ children: inline(t), spacing: { after: 160 }, color: GREY, size: 20 });
const note = (t) =>
  new Paragraph({
    children: inline(t),
    spacing: { after: 160, before: 120 },
    shading: { fill: "EEF5FA", type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: "1B6CA8", space: 8 } },
    indent: { left: 120, right: 120 },
    size: 20
  });
const bullet = (t) => new Paragraph({ numbering: { reference: "bul", level: 0 }, children: inline(t), spacing: { after: 80, line: 300 }, size: 21 });
const bullet2 = (t) => new Paragraph({ numbering: { reference: "num", level: 0 }, children: inline(t), spacing: { after: 80, line: 300 }, size: 21 });
const blank = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [new TextRun({ text: "", font: FONT })], spacing: { after: 60 } }));

const BD = { style: BorderStyle.SINGLE, size: 2, color: "C9D6E0" };
const BORDERS = { top: BD, bottom: BD, left: BD, right: BD };
const CW = 9638; 

function mkCell(content, w, opt = {}) {
  const items = Array.isArray(content) ? content : [String(content)];
  const kids = [];
  items.forEach((it) => {
    String(it)
      .split(/<br\s*\/?>/gi)
      .forEach((seg) => {
        kids.push(
          new Paragraph({
            children: inline(seg, opt.head ? { bold: true, color: "FFFFFF", size: 19 } : { size: 19 }),
            spacing: { after: 40, before: 40, line: 280 }
          })
        );
      });
  });
  return new TableCell({
    borders: BORDERS,
    width: { size: w, type: WidthType.DXA },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: opt.head ? NAVY : opt.fill || "FFFFFF", type: ShadingType.CLEAR },
    children: kids
  });
}

function table(headers, rows, widths, opt = {}) {
  const ws = widths || headers.map(() => Math.floor(CW / headers.length));
  const trs = [];
  trs.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => mkCell(h, ws[i], { head: true }))
    })
  );
  rows.forEach((r, ri) => {
    trs.push(
      new TableRow({
        children: r.map((c, i) => mkCell(c, ws[i], { fill: ri % 2 === 1 ? "F6F9FB" : "FFFFFF" }))
      })
    );
  });
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: ws, rows: trs });
}


const grouped = {};
O.budget.items.forEach((i) => (grouped[i.c] = (grouped[i.c] || 0) + i.q * i.u));
const subtotal = Object.values(grouped).reduce((a, b) => a + b, 0);
const reserve = subtotal * EARLY.syntheticReserveRate;
const total = subtotal + reserve;


const body = [];


body.push(
  new Paragraph({ children: [new TextRun({ text: "", font: FONT })], spacing: { before: 1600, after: 200 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Synthetic field_0002 · Synthetic field_0003", font: FONT, size: 22, color: "1B6CA8", characterSpacing: 40 })],
    spacing: { after: 300 }
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Synthetic field_0004", font: FONT, size: 52, bold: true, color: NAVY })],
    spacing: { after: 120 }
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "EXAMPLE Synthetic field_0005", font: FONT, size: 40, bold: true, color: NAVY })],
    spacing: { after: 260 }
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Synthetic field_0006 · Synthetic field_0007 · Synthetic field_0008 · Synthetic field_0009", font: FONT, size: 21, color: GREY })],
    spacing: { after: 700 }
  })
);
body.push(
  table(
    ["Synthetic field_0010", "Synthetic field_0011"],
    [
      ["Synthetic field_0012", "Synthetic field_0013（Synthetic field_0014）"],
      ["Synthetic field_0015", "Synthetic field_0016 · Synthetic field_0017 · Synthetic field_0018 · Synthetic field_0019 · Synthetic field_0020"],
      ["Synthetic field_0021", "EXAMPLE Synthetic field_0022 EXAMPLE Synthetic field_0023 EXAMPLE Synthetic field_0024 — Synthetic field_0025（Synthetic field_0026：EXAMPLE Synthetic field_0023 EXAMPLE Synthetic field_0024 — EXAMPLE Synthetic field_0023 EXAMPLE Synthetic field_0024）"],
      ["Synthetic field_0027", "Synthetic field_0028 EXAMPLE Synthetic field_0029 · Synthetic field_0030 EXAMPLE Synthetic field_0029 · Synthetic field_0031 EXAMPLE Synthetic field_0029 · Synthetic field_0032 EXAMPLE Synthetic field_0029"],
      ["Synthetic field_0033", "¥ " + Math.round(total).toLocaleString() + "（Synthetic field_0034 EXAMPLE Synthetic field_0035）"],
      ["Synthetic field_0036", "Synthetic field_0037"],
      ["Synthetic field_0038", "VEXAMPLE（Synthetic field_0039）· EXAMPLE Synthetic field_0022 EXAMPLE Synthetic field_0023"]
    ],
    [2400, 7238]
  )
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(
  new Paragraph({
    children: [new TextRun({ text: "Synthetic field_0040 Synthetic field_0041", font: FONT, size: 32, bold: true, color: NAVY })],
    spacing: { after: 240 }
  }),
  new Paragraph({
    children: [new TextRun({ text: "（Synthetic field_0042 Word Synthetic field_0043，Synthetic field_0044「Synthetic field_0045」Synthetic field_0046）", font: FONT, size: 19, color: GREY, italics: true })],
    spacing: { after: 200 }
  }),
  new TableOfContents("Synthetic field_0047", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] })
);


body.push(h1("Synthetic field_0048、Synthetic field_0049（Synthetic field_0050 EXAMPLE Synthetic field_0051）"));
body.push(lead("Synthetic field_0052：Synthetic field_0053、Synthetic field_0054、Synthetic field_0055、Synthetic field_0056。"));
body.push(h2("EXAMPLE Synthetic field_0027"));
body.push(
  table(
    ["Synthetic field_0057", "Synthetic field_0058", "Synthetic field_0059"],
    [
      ["Synthetic field_0028", "EXAMPLE Synthetic field_0029", "Synthetic field_0060 EXAMPLE Synthetic field_0061，Synthetic field_0062，Synthetic field_0063"],
      ["Synthetic field_0030", "EXAMPLE Synthetic field_0029", "Synthetic field_0064/FPV/Synthetic field_0065，Synthetic field_0066"],
      ["Synthetic field_0031", "EXAMPLE Synthetic field_0029", "SYNTHETIC≥EXAMPLE、Synthetic field_0067≥EXAMPLE、Synthetic field_0068≥EXAMPLE；Synthetic field_0069 EXAMPLE Synthetic field_0029"],
      ["Synthetic field_0070", "KOC EXAMPLE Synthetic field_0029 / Synthetic field_0071 EXAMPLE Synthetic field_0029", "Synthetic field_0072"],
      ["Synthetic field_0033", "¥ " + Math.round(total).toLocaleString(), "Synthetic field_0034 EXAMPLE Synthetic field_0035"]
    ],
    [1800, 2200, 5638]
  )
);
body.push(h2("EXAMPLE Synthetic field_0073（Synthetic field_0074）"));
body.push(
  table(
    ["Synthetic field_0075", "Synthetic field_0076", "Synthetic field_0077", "Synthetic field_0078"],
    P.phases.map((ph) => [ph.id, ph.name, ph.date, ph.tag])
  , [900, 2400, 2600, 3738])
);
body.push(h2("EXAMPLE Synthetic field_0079（Synthetic field_0080）"));
body.push(
  table(
    ["Synthetic field_0081", "Synthetic field_0082", "Synthetic field_0058", "Synthetic field_0059"],
    P.objectives.funnel.map((f) => [f.k, f.metric, f.target, f.note]),
    [1400, 2900, 1800, 3538]
  )
);
body.push(h2("EXAMPLE Synthetic field_0083"));
body.push(p("<b>① Synthetic field_0084：</b>Synthetic field_0085，Synthetic field_0086「Synthetic field_0087」。Synthetic field_0088 70% Synthetic field_0089「Synthetic field_0090、Synthetic field_0091」Synthetic field_0092，Synthetic field_0093。"));
body.push(p("<b>② Synthetic field_0094：</b>Synthetic field_0095、Synthetic field_0096，Synthetic field_0097。Synthetic field_0098，Synthetic field_0099。"));
body.push(p("<b>③ Synthetic field_0056：</b>Synthetic field_0100，Synthetic field_0101。Synthetic field_0102，Synthetic field_0103。9 Synthetic field_0023 4 Synthetic field_0104、Synthetic field_0105，Synthetic field_0106。"));
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0107、Synthetic field_0108：Synthetic field_0109"));
body.push(lead("Synthetic field_0110、Synthetic field_0111、Synthetic field_0112、Synthetic field_0113，Synthetic field_0114。"));
body.push(h2("EXAMPLE Synthetic field_0115"));
body.push(note("<b>" + R.verdict.score + "</b>"));
R.verdict.summary.forEach((s) => body.push(bullet(s)));

body.push(h2("EXAMPLE Synthetic field_0116（Synthetic field_0117）：EXAMPLE Synthetic field_0118"));
body.push(lead("Synthetic field_0119，Synthetic field_0120、Synthetic field_0121、Synthetic field_0122、Synthetic field_0123——Synthetic field_0124？"));
body.push(
  table(
    ["Synthetic field_0125", "Synthetic field_0126", "Synthetic field_0127", "Synthetic field_0128"],
    R.adversarial.map((a) => [a.level, "<b>" + a.no + " " + a.title + "</b>", a.detail, a.fix]),
    [800, 2400, 3200, 3238]
  )
);

body.push(h2("EXAMPLE Synthetic field_0111：Synthetic field_0129"));
body.push(note("<b>Synthetic field_0130：</b>" + R.firstPrinciples.axiom));
body.push(
  table(
    ["Synthetic field_0131", "Synthetic field_0132"],
    R.firstPrinciples.decomposition.map((d) => ["<b>" + d.k + "</b>", d.v]),
    [2200, 7438]
  )
);

body.push(h2("EXAMPLE Synthetic field_0112：Synthetic field_0133，Synthetic field_0134"));
R.socratic.forEach((s) => {
  body.push(p("<b>Q：" + s.q + "</b>", { para: { spacing: { before: 140, after: 60 } } }));
  body.push(p("　　A：" + s.a, { para: { spacing: { after: 140 } } }));
});

body.push(h2("EXAMPLE Synthetic field_0135：Synthetic field_0136，Synthetic field_0137"));
body.push(lead("EXAMPLE Synthetic field_0138、EXAMPLE Synthetic field_0139，Synthetic field_0140。Synthetic field_0141。"));
body.push(
  table(
    ["Synthetic field_0142 / Synthetic field_0143", "Synthetic field_0144", "Synthetic field_0145"],
    R.occam.cuts.map((c) => ["<b>" + c.item + "</b>", c.why, c.instead]),
    [2200, 3400, 4038]
  )
);
body.push(p("<b>Synthetic field_0146：</b>", { para: { spacing: { before: 200 } } }));
R.occam.keeps.forEach((c) => body.push(bullet("<b>" + c.item + "</b> —— " + c.why)));
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0147、Synthetic field_0148"));
body.push(note("Synthetic field_0149（Synthetic field_0150、Synthetic field_0151、Synthetic field_0152、Synthetic field_0153），Synthetic field_0154；Synthetic field_0155。<b>★Synthetic field_0156</b>Synthetic field_0157（Synthetic field_0158），<b>◆Synthetic field_0159</b>Synthetic field_0160。"));
R.additions.forEach((a) => {
  body.push(h2(a.area));
  a.items.forEach((i) => body.push(bullet(i)));
});
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0161、Synthetic field_0162"));
body.push(note(P.background.identity));
body.push(h2("EXAMPLE Synthetic field_0163（Synthetic field_0164）"));
P.background.policies.forEach((x) => body.push(bullet(x)));
body.push(h2("EXAMPLE Synthetic field_0165"));
body.push(
  table(
    ["Synthetic field_0166", "Synthetic field_0078", "Synthetic field_0059", "Synthetic field_0167"],
    P.background.business.map((b) => ["<b>" + b.name + "</b>", b.tag, b.desc, b.facts]),
    [1900, 1100, 3300, 3338]
  )
);
body.push(h2("EXAMPLE SWOT Synthetic field_0168"));
body.push(table(P.swot.map((s) => s.t), [P.swot.map((s) => s.items.map((i) => "· " + i).join("<br>"))], [2400, 2400, 2400, 2438]));
body.push(h2("EXAMPLE Synthetic field_0169"));
body.push(lead(P.background.competitors.intro));
body.push(
  table(
    ["Synthetic field_0170", "Synthetic field_0171", "Synthetic field_0172"],
    P.background.competitors.list.map((c) => ["<b>" + c.who + "</b>", c.adv, c.our]),
    [2200, 2800, 4638]
  )
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0173、Synthetic field_0174"));
body.push(note("<b>Synthetic field_0175：</b>" + P.objectives.north));
body.push(h2("EXAMPLE Synthetic field_0176（Synthetic field_0080）"));
body.push(
  table(
    ["Synthetic field_0081", "Synthetic field_0082", "Synthetic field_0058", "Synthetic field_0059"],
    P.objectives.funnel.map((f) => [f.k, f.metric, "<b>" + f.target + "</b>", f.note]),
    [1400, 2900, 1800, 3538]
  )
);
body.push(h2("EXAMPLE Synthetic field_0177 KPI Synthetic field_0178"));
body.push(
  table(
    ["Synthetic field_0179", "KPI", "Synthetic field_0180"],
    P.objectives.channelKpi.map((c) => ["<b>" + c.ch + "</b>", c.kpi, c.owner]),
    [2600, 5038, 2000]
  )
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0181、Synthetic field_0182"));
body.push(note("<b>Synthetic field_0183：</b>Synthetic field_0184「Synthetic field_0185 / Synthetic field_0186 / Synthetic field_0187」Synthetic field_0188、Synthetic field_0189，Synthetic field_0190。Synthetic field_0191：Synthetic field_0192 2 Synthetic field_0193、Synthetic field_0194、Synthetic field_0195，Synthetic field_0196「Synthetic field_0197」Synthetic field_0198「Synthetic field_0199」——Synthetic field_0200，Synthetic field_0201。"));
body.push(h2("EXAMPLE Synthetic field_0202 EXAMPLE Synthetic field_0203"));
body.push(
  table(
    ["Synthetic field_0075", "Synthetic field_0204", "Synthetic field_0205"],
    P.timeline60.map((t) => ["<b>" + t.p + "</b>", t.c, t.a]),
    [2600, 3200, 3838]
  )
);
body.push(h2("EXAMPLE Synthetic field_0206"));
P.personas.forEach((pe) => {
  body.push(h3(pe.name + "（Synthetic field_0207 " + pe.rate + "）"));
  body.push(p("<b>Synthetic field_0208：</b>" + pe.trait));
  body.push(p("<b>Synthetic field_0209：</b>" + pe.strategy));
  body.push(p("<b>Synthetic field_0210：</b>" + pe.script));
});
body.push(new Paragraph({ children: [new PageBreak()] }));


const M = P.messageHouse;
body.push(h1("Synthetic field_0211、Synthetic field_0212"));
body.push(h2("EXAMPLE Synthetic field_0213"));
body.push(note("<b>" + M.core + "</b>"));
body.push(h2("EXAMPLE Synthetic field_0214（Synthetic field_0215）"));
body.push(
  table(
    ["Synthetic field_0081", "Synthetic field_0216", "Synthetic field_0217"],
    M.threeLayer.map((t) => ["<b>" + t.k + "</b>", t.v, t.why]),
    [2000, 4200, 3438]
  )
);
body.push(h2("EXAMPLE Synthetic field_0218"));
body.push(p("<b>Synthetic field_0219：</b>", { para: { spacing: { before: 120 } } }));
M.slogans.main.forEach((s) => body.push(bullet(s)));
body.push(p("<b>Synthetic field_0220：</b>", { para: { spacing: { before: 160 } } }));
body.push(
  table(
    ["Synthetic field_0221", "Synthetic field_0222"],
    M.slogans.sub.map((s) => ["<b>" + s.b + "</b>", s.s.map((x) => "· " + x).join("<br>")]),
    [2200, 7438]
  )
);
body.push(p("<b>Synthetic field_0223：</b>", { para: { spacing: { before: 160 } } }));
body.push(
  table(
    ["Synthetic field_0224", "Synthetic field_0225"],
    M.slogans.scene.map((s) => ["<b>" + s.s + "</b>", s.t]),
    [1600, 8038]
  )
);
body.push(h2("EXAMPLE FAQ Synthetic field_0226（Synthetic field_0227）"));
M.faq.forEach((f) => {
  body.push(p("<b>Synthetic field_0228：" + f.q + "</b>", { para: { spacing: { before: 120, after: 50 } } }));
  body.push(p("　Synthetic field_0229：" + f.a, { para: { spacing: { after: 120 } } }));
});
body.push(h2("EXAMPLE Synthetic field_0230：Synthetic field_0088「Synthetic field_0231」Synthetic field_0232「Synthetic field_0233」"));
body.push(note("<b>Synthetic field_0234：</b>" + M.noIrritate.principle));
body.push(
  table(
    ["Synthetic field_0235", "Synthetic field_0236"],
    M.noIrritate.rules.map((r) => ["<b>" + r.t + "</b>", r.d]),
    [2000, 7638]
  )
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0237、Synthetic field_0238"));
body.push(lead(P.org.intro));
body.push(h2("EXAMPLE Synthetic field_0239 KPI"));
body.push(
  table(
    ["Synthetic field_0240", "Synthetic field_0241", "Synthetic field_0242", "Synthetic field_0243 KPI"],
    P.org.members.map((m) => ["<b>" + m.name + "</b>", m.role, m.duty, m.kpi]),
    [1300, 1800, 4538, 2000]
  )
);
body.push(h2("EXAMPLE RACI Synthetic field_0244（A=Synthetic field_0245，R=Synthetic field_0246，C=Synthetic field_0247，I=Synthetic field_0248）"));
body.push(
  table(
    ["Synthetic field_0249", "A Synthetic field_0180", "R Synthetic field_0246", "C Synthetic field_0250", "I Synthetic field_0251"],
    P.org.raci.map((r) => [r.task, r.a, r.r, r.c, r.i]),
    [2600, 1800, 2400, 1500, 1338]
  )
);
body.push(h2("EXAMPLE Synthetic field_0252"));
P.org.rituals.forEach((r) => {
  body.push(p("<b>" + r.t + "</b>", { para: { spacing: { before: 120, after: 50 } } }));
  body.push(p("　　" + r.d, { para: { spacing: { after: 120 } } }));
});
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0253、Synthetic field_0007"));
body.push(lead("Synthetic field_0254：Synthetic field_0255 / Synthetic field_0256 / Synthetic field_0257 / Synthetic field_0258 / Synthetic field_0210 / Synthetic field_0259 / Synthetic field_0260——Synthetic field_0261。"));
P.phases.forEach((ph) => {
  body.push(h2(ph.id + " " + ph.name + "（" + ph.date + "）｜ " + ph.tag));
  body.push(p("<b>Synthetic field_0262：</b>" + ph.goal));
  body.push(p("<b>Synthetic field_0259 KPI：</b>", { para: { spacing: { before: 120, after: 60 } } }));
  ph.kpi.forEach((k) => body.push(bullet(k)));
  body.push(h3("Synthetic field_0263"));
  ph.actions.forEach((a) => body.push(bullet("<b>[" + a.tag + "]</b> " + a.t)));
  body.push(h3("Synthetic field_0264"));
  ph.materials.forEach((m) => body.push(bullet(m)));
  body.push(h3("Synthetic field_0152"));
  body.push(p(ph.owners));
  body.push(h3("Synthetic field_0265"));
  body.push(...paras(ph.script, { run: { color: "6B4E10" }, para: { spacing: { after: 100 } } }));
  body.push(h3("Synthetic field_0266"));
  ph.acceptance.forEach((a) => body.push(bullet("□ " + a)));
  body.push(h3("Synthetic field_0267"));
  ph.risks.forEach((r) => body.push(bullet("<b>" + r.r + "</b>：" + r.p)));
});
body.push(new Paragraph({ children: [new PageBreak()] }));


const C = O.content;
body.push(h1("Synthetic field_0268、Synthetic field_0269"));
body.push(h2("EXAMPLE Synthetic field_0270：EXAMPLE Synthetic field_0271"));
body.push(note("<b>Synthetic field_0272：</b>" + C.poster.principle));
body.push(
  table(
    ["Synthetic field_0273", "Synthetic field_0274"],
    C.poster.layers.map((l) => ["<b>" + l.k + "</b>", l.v]),
    [2400, 7238]
  )
);
body.push(note(C.poster.specs));
body.push(h2("EXAMPLE Synthetic field_0275"));
body.push(h3("【Synthetic field_0276】"));
body.push(
  ...paras(
    "<b>" + strip(C.flyer.front.head) + "</b><br>" + C.flyer.front.sub + "<br><br><b>" + C.flyer.front.hook + "</b><br>" +
      C.flyer.front.benefits + "<br><br>［" + strip(C.flyer.front.qr) + "］<br>" + C.flyer.front.note
  )
);
body.push(h3("【Synthetic field_0277】"));
body.push(p("<b>" + C.flyer.back.title + "</b>"));
C.flyer.back.paths.forEach((x) => body.push(bullet("<b>" + x.n + "</b>：" + x.d)));
body.push(p("<b>Synthetic field_0278：</b>" + C.flyer.back.data));
body.push(p("<b>Synthetic field_0279：</b>" + C.flyer.back.contact));
body.push(h2("EXAMPLE Synthetic field_0280：EXAMPLE Synthetic field_0281（Synthetic field_0282，Synthetic field_0283）"));
body.push(
  table(
    ["Synthetic field_0284", "Synthetic field_0285", "Synthetic field_0286", "Synthetic field_0287 / Synthetic field_0288"],
    C.campusWall.map((w) => [
      w.no,
      "<b>" + w.title + "</b>",
      w.body,
      "<b>Synthetic field_0289：</b>" + w.tag + "<br><b>CTA：</b>" + w.cta
    ]),
    [800, 2200, 4400, 2238]
  )
);
body.push(h2("EXAMPLE Synthetic field_0290（EXAMPLE Synthetic field_0291）"));
C.live.forEach((l) => {
  body.push(h3(l.no + " 《" + l.title + "》 ｜ " + l.when + " ｜ Synthetic field_0292 " + l.dur));
  l.flow.forEach((f) => body.push(bullet2(f)));
  body.push(p("<b>Synthetic field_0293：</b>" + l.tips));
});
body.push(h2("EXAMPLE Synthetic field_0294（Synthetic field_0295 EXAMPLE Synthetic field_0296）"));
C.shortVideo.forEach((v) => body.push(bullet(v)));
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0297、Synthetic field_0298 SOP"));
body.push(note("<b>Synthetic field_0299：</b>" + O.points.principle));
body.push(h2("EXAMPLE Synthetic field_0300"));
body.push(
  table(
    ["Synthetic field_0301", "Synthetic field_0302", "Synthetic field_0303"],
    O.points.earn.map((e) => [e.act, "<b>+" + e.p + "</b>", e.cap]),
    [4000, 1200, 4438]
  )
);
body.push(h2("EXAMPLE Synthetic field_0304"));
body.push(
  table(
    ["Synthetic field_0305", "Synthetic field_0306"],
    O.points.redeem.map((r) => ["<b>" + r.p + "</b>", r.r]),
    [1800, 7838]
  )
);
body.push(h2("EXAMPLE Synthetic field_0307"));
O.points.rules.forEach((r) => body.push(bullet(r)));
body.push(h2("EXAMPLE Synthetic field_0308"));
body.push(
  table(
    ["Synthetic field_0081", "Synthetic field_0078", "Synthetic field_0307"],
    O.community.layers.map((l) => ["<b>" + l.n + "</b>", l.g, l.rule]),
    [2600, 2400, 4638]
  )
);
body.push(h2("EXAMPLE Synthetic field_0309（Synthetic field_0310）"));
body.push(...paras(O.community.welcome, { para: { spacing: { after: 40 } } }));
body.push(h2("EXAMPLE Synthetic field_0311"));
body.push(
  table(
    ["Synthetic field_0312", "Synthetic field_0313"],
    O.community.calendar.map((c) => ["<b>" + c.d + "</b>", c.c]),
    [1600, 8038]
  )
);
body.push(h2("EXAMPLE Synthetic field_0314 SOP"));
body.push(
  table(
    ["Synthetic field_0315", "Synthetic field_0256"],
    O.community.sop.map((s) => ["<b>" + s.t + "</b>", s.d]),
    [2000, 7638]
  )
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0316、Synthetic field_0317"));
body.push(note(O.budget.note));
body.push(
  table(
    ["Synthetic field_0318", "Synthetic field_0010", "Synthetic field_0319", "Synthetic field_0320", "Synthetic field_0321", "Synthetic field_0322", "Synthetic field_0323"],
    O.budget.items.map((i) => [i.c, i.n, i.s, String(i.q), "¥" + i.u.toFixed(2), "¥" + (i.q * i.u).toFixed(0), i.ph]),
    [1500, 2600, 1700, 700, 900, 1000, 1238]
  )
);
body.push(h2("EXAMPLE Synthetic field_0324"));
const sumRows = Object.entries(grouped).map(([k, v]) => [k, "¥ " + Math.round(v).toLocaleString()]);
sumRows.push(["<b>Synthetic field_0325</b>", "<b>¥ " + Math.round(subtotal).toLocaleString() + "</b>"]);
sumRows.push(["Synthetic field_0035（EXAMPLE）", "¥ " + Math.round(reserve).toLocaleString()]);
sumRows.push(["<b>Synthetic field_0326</b>", "<b>¥ " + Math.round(total).toLocaleString() + "</b>"]);
body.push(table(["Synthetic field_0010", "Synthetic field_0322"], sumRows, [6000, 3638]));
body.push(h2("EXAMPLE Synthetic field_0327"));
body.push(
  table(
    ["Synthetic field_0328", "Synthetic field_0329", "Synthetic field_0330", "Synthetic field_0331"],
    O.budget.tiers.map((t) => ["<b>" + t.n + "</b>", t.total, t.cut, t.fit]),
    [1500, 1500, 3700, 2938]
  )
);
body.push(note("<b>Synthetic field_0332：</b>Synthetic field_0333 500 Synthetic field_0334；Synthetic field_0335；Synthetic field_0336，Synthetic field_0337，Synthetic field_0338。Synthetic field_0339。"));
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0340、Synthetic field_0341"));
body.push(h2("EXAMPLE Synthetic field_0342"));
body.push(
  table(
    ["Synthetic field_0343", "Synthetic field_0344", "Synthetic field_0345", "Synthetic field_0346", "Synthetic field_0180"],
    O.risks.map((r) => [r.t, "<b>" + r.s + "</b>", r.p, r.r, r.o]),
    [800, 2200, 600, 5238, 800]
  )
);
body.push(h2("EXAMPLE Synthetic field_0347（PEXAMPLE Synthetic field_0348 EXAMPLE Synthetic field_0349）"));
body.push(
  table(
    ["#", "Synthetic field_0350", "Synthetic field_0236", "Synthetic field_0351", "Synthetic field_0180"],
    O.compliance.map((c) => [c.i, "<b>" + c.t + "</b>", c.d, c.when, c.o]),
    [500, 1900, 4400, 1300, 1538]
  )
);
body.push(
  new Paragraph({
    children: inline("<b>Synthetic field_0352：</b>Synthetic field_0353 1—3 Synthetic field_0354（Synthetic field_0355、Synthetic field_0356、Synthetic field_0357）Synthetic field_0358，P1—P5 Synthetic field_0359。Synthetic field_0360，Synthetic field_0361「Synthetic field_0362」Synthetic field_0363——Synthetic field_0364，Synthetic field_0365，Synthetic field_0366。"),
    spacing: { before: 200, after: 160 },
    shading: { fill: "FDECEA", type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: "C0392B", space: 8 } },
    indent: { left: 120, right: 120 },
    size: 20
  })
);
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0367、Synthetic field_0368"));
body.push(h2("EXAMPLE Synthetic field_0369"));
body.push(note(O.measurement.channelCodes));
body.push(h2("EXAMPLE Synthetic field_0370"));
body.push(
  table(
    ["Synthetic field_0371", "Synthetic field_0372"],
    O.measurement.dashboard.map((d) => ["<b>" + d.k + "</b>", d.f]),
    [2000, 7638]
  )
);
body.push(h2("EXAMPLE Synthetic field_0373"));
body.push(p("<b>Synthetic field_0374：</b>" + O.measurement.daily));
body.push(p("<b>Synthetic field_0375：</b>" + O.measurement.warning));
body.push(h2("EXAMPLE Synthetic field_0376"));
O.measurement.review.forEach((r, i) => body.push(bullet2(r)));
body.push(new Paragraph({ children: [new PageBreak()] }));


body.push(h1("Synthetic field_0377、Synthetic field_0378"));
body.push(
  table(
    ["Synthetic field_0379", "Synthetic field_0011"],
    O.appendices.map((a) => ["<b>" + a.t + "</b>", a.d]),
    [3000, 6638]
  )
);
body.push(...blank(2));
body.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "— Synthetic field_0380 · EXAMPLE Synthetic field_0022 EXAMPLE Synthetic field_0023 —", font: FONT, size: 19, color: GREY })],
    spacing: { before: 400 }
  })
);


const doc = new Document({
  creator: "Synthetic field_0381",
  title: "Synthetic field_0004EXAMPLESynthetic field_0005",
  description: "Synthetic field_0006、Synthetic field_0007、Synthetic field_0008、Synthetic field_0009",
  styles: {
    default: { document: { run: { font: FONT, size: 21, color: "1A2530" }, paragraph: { spacing: { line: 320 } } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: NAVY },
        paragraph: { spacing: { before: 320, after: 220 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 6 } } }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: "134F76" },
        paragraph: { spacing: { before: 260, after: 140 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONT, color: ORANGE },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }] },
      { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }] }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134, header: 620, footer: 620 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Synthetic field_0004 · EXAMPLE Synthetic field_0005", font: FONT, size: 17, color: GREY }),
                new TextRun({ text: "\tSynthetic field_0002 · Synthetic field_0003", font: FONT, size: 17, color: GREY })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: 9638 }],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9D6E0", space: 4 } }
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Synthetic field_0382 ", font: FONT, size: 17, color: GREY }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 17, color: GREY }),
                new TextRun({ text: " Synthetic field_0383 / Synthetic field_0384 ", font: FONT, size: 17, color: GREY }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 17, color: GREY }),
                new TextRun({ text: " Synthetic field_0383", font: FONT, size: 17, color: GREY })
              ]
            })
          ]
        })
      },
      children: body
    }
  ]
});

Packer.toBuffer(doc).then((buf) => {
  const f = path.join(OUT, "synthetic-report.docx");
  fs.writeFileSync(f, buf);
  console.log("DOCX OK ->", f);
  console.log("Synthetic field_0386(Synthetic field_0387):", Math.round(total));
});
