# LLM School

A two-week, plain-English course on how large language models work, train, are used, evaluated, and where the research is going (as of October 2026), plus a "Paper Bible" of 18 landmark papers explained three ways (one sentence, for a 10-year-old, step by step). One self-contained web page with 22 interactive widgets, quizzes, and source links on every claim.

| Where | URL | Notes |
|---|---|---|
| GitHub Pages | https://benmsk.github.io/llm-school/ | Public. Progress (days done) and theme are saved only in the browser. Add to the iPhone home screen for an app icon. |
| Local | double-click `index.html` | Works offline except Google Fonts. |

## Files

```
llm-school/                 ← git root (github.com/BenMSK/llm-school, branch main)
├─ index.html               ← the whole site: CSS + content + script. The only source.
├─ apple-touch-icon.png     ← iOS home-screen icon 180px (speech bubble + sparkle)
├─ icon-192.png, icon-512.png, manifest.webmanifest   ← Android / PWA icon and manifest
├─ .nojekyll                ← GitHub Pages serves files as-is
├─ tools/htmlcheck.js       ← tag-balance checker   node tools/htmlcheck.js index.html
├─ tools/makeicon.js        ← icon rasterizer       node tools/makeicon.js .
└─ README.md
```

## Inside index.html

- `<head>`: meta, icons, manifest, Google Fonts (Inter, Space Grotesk, JetBrains Mono), and one `<style>` block.
  Design tokens live in `:root` (light) and are redefined for dark mode twice: under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and under `:root[data-theme="dark"]` for the toggle.
  Chart colours `--c1`…`--c5` were validated for colour-blind separation in both modes.
- `<header class="top">`: brand, version `v1.x (date)`, theme button, two tabs.
- `<main>` → `.pane[data-pane=course]`: day chips (built by script), `#d0` overview (hero, how-to, syllabus table built from the day headers, box legend), then `section.day[data-day=1..14]`.
- `.pane[data-pane=papers]`: `#plist` (intro, tag filter, cards built by script), then `article.paper#p-…[data-year][data-tags]`.
- `<script id="data" type="application/json">`: data for the `bench` (benchmark scores over time) and `timeline` (model releases) widgets.
- `<script>`: routing (`#course`, `#d7`, `#papers`, `#p-lora`), theme, progress (localStorage key `llm-school`), quiz handling, phone table-to-card labels, the `VIZ` registry (one function per widget name, mounted on every `div.viz[data-viz=name]`).

### Content conventions

- Every claim worth checking carries a source chip `<a class="src" href="…">Author Year</a>` linking to the primary source (arXiv, official blogs, docs, course pages).
- Lesson structure: `header.day-h` → `.box.key` (big idea) → sections (`h3`) with widgets (`div.viz`) and figures (`figure.fig` with inline SVG using only CSS-variable colours) → `.box.tip` / `.box.kid` / `.box.note` / `.box.dont` → `.quiz` (`.q[data-a=index]` with four `.opt` buttons and a hidden `.exp`) → `.box.ok` recap → `.refs` → `p.next` (rewritten by script from the next day's title).
- Paper structure: `header.paper-h` → in one sentence → explain to a 10-year-old → problem → key idea → how it works → results → why it mattered → limitations → how to read the paper → quiz → references.
- Widget names (all in the `VIZ` object): ngram, history, bpe, embed, neuron, gd, attn, block, posenc, scaling, sampling, kvcache, rlhf, reasoning, lora, quant, moe, rag, agent, bench, timeline.
- Day ids `d1`…`d14` and paper ids `p-…` are link targets; do not rename them.

## Editing and publishing

1. Edit `index.html`.
2. `node tools/htmlcheck.js index.html` → must print `errors: 0`. If the script changed, open the page in a browser and check the console.
3. Bump the version in the header `.ver` span and in the footer, and add a line to the change log below.
4. `git add -A && git commit -m "…" && git push` → live in 1–2 minutes.
5. To change the icon: edit the `<svg class="logo">` in the header and the matching shapes in `tools/makeicon.js`, run `node tools/makeicon.js .`, then on the phone remove and re-add the home-screen icon.

## Change log

| Date | Version | Commit | What |
|---|---|---|---|
| 2026-10-19 | v1.0 | – | First release. 14 lessons (Week 1: language models, tokens and embeddings, neural nets, attention, the Transformer, pretraining and scaling, inference; Week 2: SFT and RLHF, reasoning models, fine-tuning and quantization, MoE/long context/SSM/multimodal, prompting/RAG/agents, evaluation and safety, the 2024–2026 frontier). 18 paper reviews. 22 widgets. Light/dark theme, phone layout, home-screen icon and manifest. |

## Known gaps and things to re-check later

- Fast-moving facts (frontier model names, benchmark scores, API prices, context lengths) are stated "as of October 2026" and will age. The `bench` and `timeline` data and Day 14 are the first places to refresh.
- Writers flagged a few claims they could verify only through secondary sources; they are phrased cautiously in the text. See the project memory notes or grep for "as of" to find the dated statements.
