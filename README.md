# RealDynLFV project homepage

Project page for **RealDynLFV: A Large-Parallax Benchmark for Real-World Dynamic Light Field Video**, accepted at IEEE VCIP 2026 (paper 152).

- Official site: https://xinpeng24huang.github.io/RealdynLFV-Homepage/
- Official repository: https://github.com/xinpeng24huang/RealdynLFV-Homepage
- Full dataset release is planned after acceptance of the journal extension. This website contains a selected sample and paper figures.

## Build and preview

Python 3 is the only build dependency. No front-end packages, external fonts or application server are required.

```sh
python scripts/build.py
python scripts/check.py
python -m http.server 8793 --bind 127.0.0.1
```

Open http://127.0.0.1:8793/ or http://127.0.0.1:8793/zh.html. Keep the server running while reviewing video and clipboard features.

## Source files

- `content.json`: explicit English and Chinese strings, confirmed authors, statistics, scene samples and citation. Both languages have the same keys.
- `template.html`: shared semantic layout, local media references and section anchors.
- `scripts/build.py`: escaped UTF-8 renderer. Produces both `index.html` and `zh.html`.
- `scripts/check.py`: checks build freshness, local resources, anchors, bilingual sections, 25 camera controls and asset sizes.
- `assets/style.css`: responsive layout. No external font requests.
- `assets/media.js`: bounded image decode queues and preparation near the viewport.
- `assets/demo.js`: view selection with adjacent-view prefetch, keyboard navigation, six-scene selection, view sweep, video switching, exclusive playback and replay, and citation copy.
- `assets/temporal.js`: exact-index browsing and bounded prefetch of 30 consecutive center-view frames (76–105).
- `assets/explorers.css`: styles for temporal sampling, scene selection and the diversity gallery.
- `assets/gallery.js`: native image dialog; larger images load only when opened. Escape closes the dialog and returns focus.
- `assets/language.js`: explicit language links preserving the current section; no automatic redirects.
- `assets/media/` and `assets/identity/`: web derivatives and official institution marks. See `docs/MEDIA.md` for provenance.

Edit sources, rebuild, and commit generated HTML with the sources. GitHub Pages serves committed files and does not run the Python build.

## Review

Run the static checks, then inspect both languages at desktop and mobile sizes, with cold and warm caches under a documented mobile-network profile. Measure initial resource transfer, click-to-first-frame, scene/view changes and continuous switching. Verify all 25 views in each of six scenes, frames 76–105, keyboard navigation, sweep/stop/reset, larger-image loading, language links and sample download. Videos must start only on request, stop at the end, replay and pause other videos. Check subdirectory hosting as well as root hosting. Keep temporary screenshots, browser dependencies and internal research records outside this repository.

Publishing requires author review of the complete preview. See `docs/DEPLOYMENT.md`.
