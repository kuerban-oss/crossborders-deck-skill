# crossborders-deck — Claude Code Skill

CROSSBORDERS ブランドの .pptx 資料を生成する Claude Code 用スキル。

- **ブランド**: 青 `#385988` × 赤 `#E94F5B`、游明朝見出し＋游ゴシック本文
- `SKILL.md` — トリガー条件とワークフロー
- `scripts/brand.js` — 凍結されたデザインシステム（ヘルパー関数）
- `references/design-system.md` — 配色・タイポグラフィ・レイアウト規範
- `assets/` — ロゴ（カラー／白）

## 使い方

このフォルダを `C:\Users\<you>\.claude\skills\crossborders-deck\` に置くと、
Claude Code が CROSSBORDERS 関連の PPT 依頼で自動的にこのデザインシステムを使う。
