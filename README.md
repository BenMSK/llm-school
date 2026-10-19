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
├─ img/papers/*.png         ← 33 figures reproduced from the reviewed papers (max 1400px wide)
├─ .nojekyll                ← GitHub Pages serves files as-is
├─ tools/htmlcheck.js       ← tag-balance checker   node tools/htmlcheck.js index.html
├─ tools/makeicon.js        ← icon rasterizer       node tools/makeicon.js .
├─ tools/figcrop.py         ← crops "Figure N" out of a paper PDF (needs pymupdf)   python tools/figcrop.py paper.pdf 2 out.png
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
- Paper figures: `<figure class="fig pimg"><a href="img/papers/x.png" target="_blank"><img src="img/papers/x.png" width=… height=… alt="…" loading="lazy"></a><figcaption><a class="src" href="arXiv URL">Figure N, Author Year</a> plain-English caption</figcaption></figure>`, placed right after the `h3` of the section it illustrates. Images come from the arXiv HTML rendering when it has them, otherwise `tools/figcrop.py` on the PDF; they are reproduced for study with the source linked, copyright stays with the authors. Keep width ≤ 1400px and the file under ~200 KB.
- Widget names (all in the `VIZ` object): ngram, history, bpe, embed, neuron, gd, attn, block, posenc, scaling, sampling, kvcache, rlhf, reasoning, lora, quant, moe, rag, agent, bench, timeline.
- Day ids `d1`…`d14` and paper ids `p-…` are link targets; do not rename them.

## Editing and publishing

1. Edit `index.html`.
2. `node tools/htmlcheck.js index.html` → must print `errors: 0`. If the script changed, open the page in a browser and check the console.
3. Bump the version in the header `.ver` span and in the footer, and add a line to the change log below.
4. `git add -A && git commit -m "…" && git push` → live in 1–2 minutes.
5. To change the icon: edit the `<svg class="logo">` in the header and the matching shapes in `tools/makeicon.js`, run `node tools/makeicon.js .`, then on the phone remove and re-add the home-screen icon.

## Change log

| Date | Version | Git tag | What |
|---|---|---|---|
| 2026-10-19 | v1.1 | `v1.1` | 33 figures from the papers added to the 18 reviews (architecture diagrams, key plots), each with a plain-English caption and source link; tap to open full size. Benchmark and timeline data filled in. |
| 2026-10-19 | v1.0 | `v1.0` | First release. 14 lessons (Week 1: language models, tokens and embeddings, neural nets, attention, the Transformer, pretraining and scaling, inference; Week 2: SFT and RLHF, reasoning models, fine-tuning and quantization, MoE/long context/SSM/multimodal, prompting/RAG/agents, evaluation and safety, the 2024–2026 frontier). 18 paper reviews. 22 widgets. Light/dark theme, phone layout, home-screen icon and manifest. |

## Known gaps and things to re-check later

- Fast-moving facts (frontier model names, benchmark scores, API prices, context lengths) are stated "as of October 2026" and will age. The `bench` and `timeline` data and Day 14 are the first places to refresh.
- Writers flagged a few claims they could verify only through secondary sources; they are phrased cautiously in the text. Grep for "as of" to find the dated statements. Specifically: some author affiliations and paper section numbers were written from memory; a few GPT-3 numbers came via secondary sources; the DeepSeek-R1 RL cost and DeepSeek-V3 GPU-hours come from press and memory of the paper; the o3 PersonQA hallucination rate, GSM1k drop size, exact GPT-5.x release dates, the Stanford AI Index "280×" price-decline figure and the IEA 2026 electricity figures were taken from search snippets rather than the primary documents; the current LMArena leader is deliberately not named.
- Figure numbering follows the arXiv version linked in each caption (the latest one at build time); if a paper is revised, re-check the numbers.
