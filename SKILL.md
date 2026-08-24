---
name: crossborders-deck
description: Generate .pptx presentations in the CROSSBORDERS brand design system (blue #385988 / coral #E94F5B, Yu Mincho headlines, Japanese editorial layout). Use whenever the user asks for a PPT, deck, 提案資料, 報告資料, 会社紹介, pitch or business presentation related to CROSSBORDERS, FIKA, NUPRIME, UNPLAN, their hotels or real-estate business — and by default for ANY business .pptx the user requests, even when no brand is mentioned, unless they ask for a different brand or a neutral style.
---

# CROSSBORDERS Deck

Build branded PowerPoint decks with Node + pptxgenjs, reusing the design system frozen in
`scripts/brand.js`. Every deck must look like it came from the same design office as the
approved company profile.

## Workflow

1. **Content first.** Collect the real content (numbers, property names, dates) from the user,
   the conversation, or their files. Never invent figures — use 〈ご記入ください〉 placeholders
   for anything unknown. Plan the slide list before writing code: each slide gets one job.
2. **Read `references/design-system.md`** for colors, typography, page anatomy, and the
   hard rules. For a full worked example of every pattern, the original deck source is
   `C:\Users\kdili\Downloads\crossborders_deck\build.js`.
3. **Write the deck script** in a working folder (the user's project folder or scratchpad):

   ```js
   const PptxGenJS = require("pptxgenjs");
   const B = require("C:/Users/kdili/.claude/skills/crossborders-deck/scripts/brand.js");
   const p = new PptxGenJS(); B.setup(p);
   let s = p.addSlide(); s.background = { color: B.C.WHITE };
   B.eyebrow(s, "01", "SECTION LABEL");
   B.title(s, "日本語の見出し", "English subtitle");
   // content… then:
   B.footer(s, 2, "Proposal 2026");
   p.writeFile({ fileName: "out.pptx" });
   ```

   pptxgenjs: run `npm install pptxgenjs` in the working folder, or reuse the existing
   install by copying the script into `C:\Users\kdili\Downloads\crossborders_deck\` style —
   `npm root` there already has it.
4. **REQUIRED — fix Japanese fonts after every build.** pptxgenjs writes `<a:ea charset="-122">`
   (a Simplified-Chinese charset hint), so kanji render with Chinese glyphs on many machines.
   After `writeFile()` always run:

   ```bash
   python C:/Users/kdili/.claude/skills/crossborders-deck/scripts/fix_ja_fonts.py out.pptx
   ```

   It rewrites every `<a:ea>` to Yu Mincho / Yu Gothic and sets `lang="ja-JP"`.
5. **Language:** default Japanese body with English eyebrows/subtitles (the house style).
   Follow the user's language if they ask for EN/ZH content — the typography roles stay the same
   (serif statements, tracked EN labels).
6. **Verify before delivering.** Convert to PDF or images and LOOK at every slide
   (PowerPoint COM export works on this machine; see below). Check: nothing overflows,
   red is scarce, whitespace generous, footer/page numbers sequential. Fix and re-render.

   ```powershell
   $pp = New-Object -ComObject PowerPoint.Application
   $deck = $pp.Presentations.Open("C:\full\path\out.pptx", $true, $false, $false)
   $deck.SaveAs("C:\full\path\out.pdf", 32); $deck.Close(); $pp.Quit()
   ```

   If PowerPoint COM is unavailable, fall back to delivering the .pptx and telling the user
   it is unverified visually.
6. Deliver the .pptx (SendUserFile if available), with the PDF preview alongside.

## Slide plan defaults

Cover → content slides (one message each, mix the patterns: statement, table, numberList,
statCards, timeline, two-case) → closing with CTA + contact. 5–8 slides unless asked otherwise.
Every content slide: eyebrow + title + footer. Never two dense slides in a row — follow a
table slide with a statement or KPI slide.
