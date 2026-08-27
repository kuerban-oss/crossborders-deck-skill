// CROSSBORDERS brand system for pptxgenjs decks.
// Usage: const B = require("<skill>/scripts/brand.js");
// The caller creates the PptxGenJS instance; every helper takes a slide `s`.
const path = require("path");

// ---- palette (hex without #) ----
const C = {
  BLUE: "385988", BLUE_LT: "6E8FBE", RED: "E94F5B",
  INK: "3E3A39", DARK: "2B2829", WHITE: "FFFFFF",
  PANEL: "F4F5F3", PANEL_B: "EEF1F6", LINE: "DCDFE5",
  MUTE: "8C8A88", MUTE_D: "9C9A99",
  HILITE: "FBEAEC", ZEBRA: "FAFAF9",
};

// ---- fonts: JP serif for headings/statements, JP sans for body, Arial for EN labels ----
const F = { SER: "Yu Mincho", SAN: "Yu Gothic", EN: "Arial" };

// ---- geometry (16:9, inches) ----
const W = 13.333, H = 7.5, MX = 0.85, LOGO_AR = 913 / 946;

const LOGO_COLOR = path.join(__dirname, "..", "assets", "logo_color.png");
const LOGO_WHITE = path.join(__dirname, "..", "assets", "logo_white.png");

function setup(p) { p.defineLayout({ name: "W", width: W, height: H }); p.layout = "W"; }

// Centered logo. cx = horizontal center. dark=true → white logo for dark slides.
// Brand guideline: minimum logo width 25mm ≈ 0.98in (enforced here); keep clear space
// ≥ 0.25 × logo width on all sides; never place a white backing plate behind it on photos.
function logo(s, cx, y, h, dark) {
  const minW = 0.98;
  if (h * LOGO_AR < minW) h = minW / LOGO_AR;
  const w = h * LOGO_AR;
  s.addImage({ path: dark ? LOGO_WHITE : LOGO_COLOR, x: cx - w / 2, y, w, h });
}

// Page eyebrow: red number + blue tracked label, e.g. eyebrow(s, "01", "WHO WE ARE")
function eyebrow(s, num, label, onDark) {
  s.addText([{ text: num + "  ", options: { color: C.RED } }, { text: "— " + label, options: { color: onDark ? C.BLUE_LT : C.BLUE } }],
    { x: MX, y: 0.62, w: 11.5, h: 0.4, fontFace: F.EN, fontSize: 12.5, bold: true, charSpacing: 2.4, align: "left", margin: 0 });
}

// Footer wordmark + page number. docLabel e.g. "Company Profile 2026", "Proposal 2026".
function footer(s, n, docLabel, onDark) {
  s.addText([{ text: "CROSS", options: { color: onDark ? C.MUTE_D : C.RED } }, { text: "BORDERS", options: { color: onDark ? C.MUTE_D : C.BLUE } },
    { text: "   |   " + (docLabel || "CROSSBORDERS"), options: { color: onDark ? C.MUTE_D : C.MUTE } }],
    { x: MX, y: H - 0.5, w: 7, h: 0.3, fontFace: F.EN, fontSize: 8, bold: true, charSpacing: 1.2, align: "left", margin: 0 });
  if (n) s.addText(String(n).padStart(2, "0"), { x: W - 1.6, y: H - 0.5, w: 0.75, h: 0.3, fontFace: F.EN, fontSize: 8, color: onDark ? C.MUTE_D : C.MUTE, align: "right", margin: 0 });
}

// Slide title: JP serif headline + optional EN tracked subtitle.
function title(s, jp, en, sz) {
  s.addText(jp, { x: MX, y: 1.1, w: W - 2 * MX, h: 0.8, fontFace: F.SER, fontSize: sz || 27, bold: true, color: C.INK, align: "left", margin: 0 });
  if (en) s.addText(en, { x: MX, y: 1.9, w: W - 2 * MX, h: 0.35, fontFace: F.EN, fontSize: 12, color: C.MUTE, charSpacing: 1.3, align: "left", margin: 0 });
}

// Short red accent rule (used above a key statement).
function accentRule(s, x, y, w) {
  s.addShape("line", { x, y, w: w || 0.7, h: 0, line: { color: C.RED, width: 2 } });
}

function symC(v) { return v === "◎" ? C.RED : v === "○" ? C.BLUE : v === "△" ? "AAA8A6" : "CFCFCF"; }

// Comparison/spec table. o = { x, y, cols:[widths], headers:[], rows:[[]], highlight:colIndex,
//   headH, rowH, valSize, headSize, valAlign }. Cells may start with ◎ ○ △ × for colored symbols.
// Highlighted column gets pink field + blue header (use for "our offer" column). Returns total height.
function drawTable(s, o) {
  const cols = o.cols, headers = o.headers, rows = o.rows, hi = o.highlight ?? -1;
  const headH = o.headH || 0.62, rowH = o.rowH || 0.44, valSize = o.valSize || 11, headSize = o.headSize || 11;
  const valAlign = o.valAlign || "center";
  const totalW = cols.reduce((a, b) => a + b, 0), totalH = headH + rows.length * rowH;
  let acc = o.x; const colX = cols.map(w => { const px = acc; acc += w; return px; });
  if (hi >= 0) s.addShape("rect", { x: colX[hi], y: o.y, w: cols[hi], h: totalH, fill: { color: C.HILITE }, line: { type: "none" } });
  headers.forEach((h, i) => {
    const isHi = i === hi;
    s.addShape("rect", { x: colX[i], y: o.y, w: cols[i], h: headH, fill: { color: isHi ? C.BLUE : C.PANEL }, line: { type: "none" } });
    s.addText(h, { x: colX[i] + (i === 0 ? 0.16 : 0), y: o.y, w: cols[i] - (i === 0 ? 0.22 : 0), h: headH, fontFace: F.SAN, fontSize: headSize, bold: true, color: isHi ? C.WHITE : C.INK, align: i === 0 ? "left" : "center", valign: "middle", lineSpacingMultiple: 1.0, margin: 0 });
  });
  rows.forEach((r, ri) => {
    const ry = o.y + headH + ri * rowH;
    if (ri % 2 === 1) s.addShape("rect", { x: o.x, y: ry, w: totalW, h: rowH, fill: { color: C.ZEBRA }, line: { type: "none" } });
    r.forEach((cell, ci) => {
      if (ci === 0) { s.addText(cell, { x: colX[0] + 0.16, y: ry, w: cols[0] - 0.22, h: rowH, fontFace: F.SAN, fontSize: valSize, bold: true, color: C.INK, align: "left", valign: "middle", lineSpacingMultiple: 1.05, margin: 0 }); return; }
      const m = String(cell).match(/^([◎○△×])\s?(.*)$/);
      if (m) {
        const runs = [{ text: m[1] + (m[2] ? "  " : ""), options: { color: symC(m[1]), bold: true, fontSize: m[2] ? valSize : 15, fontFace: F.EN } }];
        if (m[2]) runs.push({ text: m[2], options: { color: ci === hi ? C.INK : C.MUTE, bold: false, fontSize: valSize - 1, fontFace: F.SAN } });
        s.addText(runs, { x: colX[ci] + (m[2] ? 0.14 : 0), y: ry, w: cols[ci] - (m[2] ? 0.24 : 0), h: rowH, align: m[2] ? "left" : "center", valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
      } else {
        s.addText(cell, { x: colX[ci], y: ry, w: cols[ci], h: rowH, fontFace: F.SAN, fontSize: valSize, bold: ci === hi, color: ci === hi ? C.INK : C.MUTE, align: valAlign, valign: "middle", lineSpacingMultiple: 1.05, margin: valAlign === "left" ? [0, 0, 0, 8] : 0 });
      }
    });
  });
  for (let i = 1; i < rows.length; i++) s.addShape("line", { x: o.x, y: o.y + headH + i * rowH, w: totalW, h: 0, line: { color: C.LINE, width: 0.75 } });
  s.addShape("line", { x: o.x, y: o.y + headH, w: totalW, h: 0, line: { color: "BFC3CB", width: 1 } });
  s.addShape("line", { x: colX[0] + cols[0], y: o.y, w: 0, h: totalH, line: { color: C.LINE, width: 0.75 } });
  return totalH;
}

// Vertical list of numbered blue circles + "serif lead　sans detail" lines.
// items = [[lead, detail], ...]; o = { x, y, w, step } (step = vertical pitch, default 0.55)
function numberList(s, items, o) {
  const step = o.step || 0.55;
  items.forEach((e, i) => {
    const y = o.y + i * step;
    s.addShape("ellipse", { x: o.x, y, w: 0.44, h: 0.44, fill: { color: C.BLUE }, line: { type: "none" } });
    s.addText(String(i + 1).padStart(2, "0"), { x: o.x, y, w: 0.44, h: 0.44, fontFace: F.EN, fontSize: 12, bold: true, color: C.WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText([{ text: e[0] + "　", options: { fontFace: F.SER, fontSize: 13, bold: true, color: C.INK } }, { text: e[1], options: { fontFace: F.SAN, fontSize: 10, color: C.MUTE } }],
      { x: o.x + 0.6, y: y - 0.02, w: o.w - 0.6, h: 0.48, valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
  });
}

// Row of KPI cards: big number + unit + caption on a panel.
// items = [[value, unit, caption, colorHex], ...]; o = { y, gap } — spans full content width.
function statCards(s, items, o) {
  const gap = (o && o.gap) || 0.35, y = o.y;
  const nW = (W - 2 * MX - (items.length - 1) * gap) / items.length;
  items.forEach((m, i) => {
    const x = MX + i * (nW + gap), col = m[3] || C.BLUE;
    // scale the number down and its box up for long values (e.g. ¥17,200) so they never wrap
    const vlen = String(m[0]).length;
    const vSize = vlen >= 6 ? 26 : vlen >= 4 ? 30 : 34;
    const numW = Math.min(nW - 1.0, Math.max(1.55, 0.20 * vlen + 0.5));
    s.addShape("roundRect", { x, y, w: nW, h: 0.92, fill: { color: C.PANEL }, line: { type: "none" }, rectRadius: 0.08 });
    s.addText([{ text: m[0], options: { fontSize: vSize, color: col } }, { text: m[1], options: { fontSize: 14, color: col } }],
      { x: x + 0.28, y: y + 0.06, w: numW, h: 0.8, fontFace: F.EN, bold: true, align: "left", valign: "middle", margin: 0 });
    s.addText(m[2], { x: x + 0.28 + numW + 0.13, y: y + 0.06, w: nW - numW - 0.57, h: 0.8, fontFace: F.SAN, fontSize: 9.5, bold: true, color: C.INK, valign: "middle", lineSpacingMultiple: 1.12, margin: 0 });
  });
}

// Horizontal timeline / process flow: dots on a line, label above or below.
// items = [[topLabel, caption, hot?], ...]; o = { y }. hot=true → red dot (milestones, final step).
function timeline(s, items, o) {
  const hw = (W - 2 * MX) / items.length, y = o.y;
  s.addShape("line", { x: MX + hw / 2, y, w: (W - 2 * MX) - hw, h: 0, line: { color: C.LINE, width: 2 } });
  items.forEach((m, i) => {
    const x = MX + i * hw, cx = x + hw / 2, hot = !!m[2];
    s.addText(m[0], { x, y: y - 0.58, w: hw, h: 0.32, fontFace: F.EN, fontSize: 15, bold: true, color: hot ? C.RED : C.BLUE, align: "center", margin: 0 });
    s.addShape("ellipse", { x: cx - 0.1, y: y - 0.1, w: 0.2, h: 0.2, fill: { color: hot ? C.RED : C.BLUE }, line: { color: C.WHITE, width: 2.5 } });
    s.addText(m[1], { x: x + 0.03, y: y + 0.18, w: hw - 0.06, h: 0.9, fontFace: F.SAN, fontSize: 8.5, color: C.INK, align: "center", valign: "top", lineSpacingMultiple: 1.14, margin: 0 });
  });
}

// Company licenses (public credentials). Put on the closing/contact slide of every deck.
const LICENSE = "宅地建物取引業 東京都知事(1)第111770号　／　住宅宿泊管理業者 国土交通大臣(01)第F04198号";
function license(s, o = {}) {
  const y = o.y ?? 6.62;
  s.addText(LICENSE + (o.suffix ? "　　" + o.suffix : "　　©2026 CROSSBORDERS CO., LTD."),
    { x: 0, y, w: W, h: 0.28, fontFace: F.SAN, fontSize: 8.5, color: C.MUTE, align: o.align || "center", margin: 0 });
}

module.exports = { C, F, W, H, MX, LOGO_AR, LOGO_COLOR, LOGO_WHITE, LICENSE, setup, logo, eyebrow, footer, title, accentRule, symC, drawTable, numberList, statCards, timeline, license };
