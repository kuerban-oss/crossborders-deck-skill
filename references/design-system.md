# CROSSBORDERS deck design system

The look was established in the approved company profile
(`C:\Users\kdili\Downloads\crossborders_deck\CROSSBORDERS_会社紹介.pptx`, source `build.js`
in the same folder — read it when you need a full worked example of every pattern).
The feel is a restrained Japanese editorial style: generous whitespace, thin rules,
serif statements, tiny tracked English labels. The elegance comes from what is left out.

## Official brand identity (from the CROSSBORDERS logo guideline)

**Colors (official, with print equivalents):**
- Red `#E94F5B` — DIC 157 / Pantone 185M / CMYK 0,100,85,0
- Blue `#385988` — DIC 641 / Pantone 294M / CMYK 95,68,13,0
- Charcoal `#3E3A39` — DIC 556 / Pantone BLACK M / CMYK 0,0,0,90

**Typography (official):** English = Museo Slab (300/500/700), Japanese = 小塚明朝 (Kozuka Mincho) L/M.
Neither is installed on this machine, so decks use the approved substitutes below (Yu Mincho ≈
Kozuka Mincho). If Museo Slab / Kozuka Mincho ever get installed, prefer them for EN labels /
JP headlines respectively — check the installed-font list before assuming.

**Logo rules:**
- The primary mark is the arc CROSS(red)BORDERS(blue) + red sun + JAPAN + blue wave stripes.
  Never alter its colors, proportions, or shape; never recolor to match a slide.
- Clear space: keep at least the guideline's "x" module empty on all sides — in practice
  ≥ 0.25 × logo width of clean margin, nothing crowding the mark.
- Minimum size: 25 mm print width ≈ **0.98 in on a slide**. `brand.js logo()` enforces this.
- The horizontal wordmark (CROSS red + BORDERS blue on one line) is for very small spaces
  only — that is exactly the footer treatment; don't use it as a primary logo.
- On photos: place the logo directly on the image with NO white backing plate, box, or
  halo — keep its original colors and shape. Choose a photo area calm enough for legibility
  (or use `logo_white.png` on genuinely dark areas); never add a background shape behind it.

## Color roles (never invent new colors)

| Role | Hex | Use |
|---|---|---|
| BLUE `385988` | brand primary | numbered circles, key phrases inside statements, table highlight header, timeline dots |
| RED `E94F5B` | accent, scarce | eyebrow number, accent rules, ◎ symbol, "hot" milestones, one emphasized word — never large fills |
| INK `3E3A39` | text primary | headlines, body emphasis |
| MUTE `8C8A88` | text secondary | body, captions, EN subtitles |
| PANEL `F4F5F3` / PANEL_B `EEF1F6` | card fills | KPI cards, info strips (roundRect, no border) |
| LINE `DCDFE5` | hairlines | dividers 0.75–2 pt |
| HILITE `FBEAEC` | table column wash | the "us" column in comparisons |
| DARK `2B2829` | dark slide bg | optional section breaks; use logo_white + BLUE_LT/MUTE_D text |

Red-to-blue ratio on any slide should feel like 1:10. If a slide has more than
three red elements, remove some.

## Typography (three faces, fixed roles)

- **Yu Mincho (SER)** — headlines, key statements, JP leads. Bold. 23–27 pt titles, 13–15 pt leads.
- **Yu Gothic (SAN)** — all body text, captions, tables. 8.5–13 pt.
- **Arial (EN)** — English labels ONLY, always with charSpacing 1–2.4: eyebrows, subtitles, numbers, footer. 8–12.5 pt (numbers up to 34 pt in KPI cards).

Mixed runs inside one text box are the house move: serif JP lead + `　` + small sans detail;
red number + ink text; blue keyword inside an ink sentence.

## Page anatomy (16:9, inches; MX = 0.85 side margin)

- `y 0.62` eyebrow `01  — SECTION LABEL` (red number, blue tracked label)
- `y 1.1` JP serif title; `y 1.9` EN subtitle (optional); small logo top-right on content pages: `logo(s, W-1.45, 0.7, 1.05)`
- `y 2.2 – 6.4` content zone
- `y H-0.5` footer: CROSS(red)BORDERS(blue) wordmark + doc label + page number

Cover: centered logo (h 1.8) → thin blue rule → serif tagline 26 pt → italic EN 13 pt →
tracked meta line → optional full-width photo strip at the bottom (the only large photo use).
Closing: centered logo, serif "Thank you", tagline in blue, PANEL_B CTA strip,
right-aligned contact block + QR (`qr_contact.png` in the deck folder), license line at bottom.

## Content patterns (helpers in scripts/brand.js)

- `drawTable` — comparisons with ◎(red) ○(blue) △ × symbols; highlight the CROSSBORDERS column.
- `numberList` — numbered blue circles with serif-lead lines (capabilities, process elements).
- `statCards` — KPI row: big Arial number + unit + caption on PANEL cards; make one card RED for the hero metric.
- `timeline` — history or 5-step process (DISCOVER→ACQUIRE→ELEVATE→OPERATE→EXIT); mark milestones/final step hot (red).
- Multi-column features: equal columns, `01` red number + serif label, hairline under, muted sans description.
- Two-case comparison: side-by-side halves split by a vertical hairline, CASE 01/02 in red Arial.

## Hard rules

- No shadows, no gradients, no 3D, no clip-art, no rounded corners beyond rectRadius ≈ 0.05–0.1.
- No full-bleed background photos on content slides; photos live in defined rectangles with `sizing: cover`.
- Photo placeholders when assets are missing: PANEL roundRect + dashed LINE border + muted label — never stock photos the user didn't supply.
- Numbers and dates are content: never invent figures; use 〈ご記入ください〉-style placeholders if unknown.
- Body text lineSpacingMultiple 1.2–1.45; never cram — cut content before shrinking below 9.5 pt.
- Tagline when needed: 境界を越え、価値を創る。/ Cross Borders, Create Value.
- Seigaiha (青海波) wave motif is part of the brand but used only as a subtle decorative field on covers if at all — omit unless asked.
