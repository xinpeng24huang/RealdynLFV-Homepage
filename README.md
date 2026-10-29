# RealDynLFV

Static project homepage for **RealDynLFV: A Large-Parallax Benchmark for Real-World Dynamic Light Field Video**, accepted at IEEE VCIP 2026.

The benchmark dataset and accompanying resources are being prepared for release. Availability updates will be provided on the project page. No dataset license or release date has been announced.

## Preview and build

Python 3 is sufficient; no framework, external fonts or package installation is needed. A small optional script remembers the selected language.

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ on the same computer. Stop the server with Ctrl+C.

## Files

- `content.json`: project description, statistics, resource states and URLs, media slots, authors, citation, license and versioned releases.
- `template.html`: semantic page layout and section copy.
- `assets/`: responsive CSS, favicon and future approved media.
- `scripts/build.py`: escaped, dependency-free static renderer.
- `scripts/check.py`: baseline checks for the current unreleased state.
- `index.html` / `zh.html`: complete generated English/Chinese pages; rebuild after source changes.
- `assets/language.js`: language switch and local preference, preserving the current section.
- `.nojekyll`: serve generated static files directly on GitHub Pages.
- `docs/DEPLOYMENT.md`: hosting and maintenance notes.

## Update content

A resource with a null `url` renders an availability label. Set a verified HTTPS URL only when that resource is publicly available. Update the accompanying availability text at the same time. Add version-specific records to `releases` using `version`, `label` and `url` keys; retain older versions when adding a new one. DOI records, Hugging Face downloads, GitHub code and regional mirrors can each have separate entries.

Set `authors`, `citation` and `license` only from confirmed metadata and permissions. The current overview is not the formal paper abstract. Do not invent publication details or results.

For approved still images, place web-sized derivatives under `assets/`, set the gallery item's relative `src` path and provide meaningful `alt` text. Keep master data outside this repository. Set `approved` to true only after publication permission is confirmed. Use `kind: "image"` for stills or `kind: "video"` for an MP4 clip, with an optional local `poster`. Videos use native controls, no autoplay and no preload. The required `alt` field supplies the image alternative or video description; add captions in the template if speech is present. Leave unapproved or missing assets unset. Gallery captions are configured through `title`, `spec` and `description`.

All assets use relative paths, supporting both root and project subdirectory hosting without a hardcoded account name. After editing, rebuild, run checks and inspect desktop/mobile layouts. The static checker deliberately rejects external resource links in the current unreleased preview; update that assertion when approved resources become available.

## Languages

English is the default. The header links switch between English and Chinese. Manual choices are stored in localStorage when available. Without JavaScript or storage access, both static pages and their language links remain usable. Translations live in the `zh` mapping in content.json, keyed by English text; keep new or edited content in sync and verify both generated pages. The formal English paper title is intentionally retained in Chinese.

### Hero and image previews

The hero displays a labeled conceptual 5 × 5 array by default. To replace it with an approved equipment photograph, set `hero_media` in `content.json` to an object with `src`, `alt`, `approved: true`, `kind: "image"`, `spec`, `title`, and `description`, following a gallery entry. Add Chinese translations of these strings to `zh`. Keep `hero_media: null` until an approved photograph is available.

Approved images use uncropped `object-fit: contain` previews. Hover or keyboard focus gently enlarges the preview; activation opens a native modal with a close button, Escape handling and focus restoration. Touch users tap to view. Reduced-motion users get no scaling animation. Empty slots remain non-interactive. Without JavaScript, image links open the original local image. Videos retain native controls.
