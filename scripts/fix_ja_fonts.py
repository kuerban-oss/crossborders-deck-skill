# -*- coding: utf-8 -*-
"""Post-process a pptxgenjs deck so Japanese text renders with Japanese glyphs.

pptxgenjs only writes <a:latin> (Latin font slot). CJK characters use the
East-Asian slot <a:ea>, which stays empty, so PowerPoint falls back to the
viewer's default CJK font (often Simplified-Chinese DengXian/SimSun) and
kanji render with Chinese glyph variants. This script:
  1. adds <a:ea> (Yu Mincho / Yu Gothic) after every <a:latin> run property
  2. rewrites lang="en-US" -> lang="ja-JP" (glyph-variant selection)
  3. fills the theme's empty East-Asian font slots

Usage: python fix_ja_fonts.py deck.pptx
"""
import re
import shutil
import sys
import zipfile
from pathlib import Path


def ea_for(latin: str) -> str:
    return "Yu Mincho" if "Mincho" in latin or "明朝" in latin else "Yu Gothic"


def process(path: str) -> None:
    src = Path(path)
    workdir = src.with_suffix(".jafix")
    if workdir.exists():
        shutil.rmtree(workdir)
    with zipfile.ZipFile(src) as z:
        names = z.namelist()
        z.extractall(workdir)

    latin_re = re.compile(r'<a:latin typeface="([^"]+)"([^>]*)/>(?!<a:ea)')
    # pptxgenjs mirrors the latin face into <a:ea> with charset="-122" (GB2312!),
    # which makes PowerPoint substitute a Simplified-Chinese font for kanji.
    ea_re = re.compile(r'<a:ea typeface="([^"]+)"[^>]*/>')
    touched = 0
    for rel in names:
        if not rel.endswith(".xml"):
            continue
        f = workdir / rel
        text = f.read_text(encoding="utf-8")
        orig = text
        if "/theme/" in rel:
            text = text.replace('<a:ea typeface=""/>', '<a:ea typeface="Yu Gothic"/>')
        elif rel.startswith(("ppt/slides/", "ppt/slideMasters/", "ppt/slideLayouts/", "ppt/notesSlides/")):
            text = text.replace('lang="en-US"', 'lang="ja-JP"')
            text = ea_re.sub(lambda m: f'<a:ea typeface="{ea_for(m.group(1))}"/>', text)
            text = latin_re.sub(lambda m: f'<a:latin typeface="{m.group(1)}"{m.group(2)}/><a:ea typeface="{ea_for(m.group(1))}"/>', text)
        if text != orig:
            f.write_text(text, encoding="utf-8")
            touched += 1

    out = src.with_suffix(".tmp.pptx")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for rel in names:  # keep original member order
            z.write(workdir / rel, rel)
    shutil.rmtree(workdir)
    out.replace(src)
    print(f"fixed {touched} xml parts in {src.name}")


if __name__ == "__main__":
    process(sys.argv[1])
