# Web media and scientific sources

## Scene 0042

The public scene identifier `0042` maps to `Secondsyn/0030_seg02`, the 16.0–18.5 second segment of source recording `0030.mp4`. All sample views use the row-major camera mapping below:

| Row | Cameras | View indices |
|---|---|---|
| A | A1–A5 | v00–v04 |
| B | B1–B5 | v05–v09 |
| C | C1–C5 | v10–v14 |
| D | D1–D5 | v15–v19 |
| E | E1–E5 | v20–v24 |

The center camera is C3 / v12. Temporal alignment uses estimated audio-clap offsets and nearest-frame trimming.

| Files | Source and processing |
|---|---|
| `scene0042-center.mp4` | All 150 standardized center-view JPEG frames, originally 1920×1080. Lanczos resize to 1280×720, H.264 CRF 22, 60000/1001 fps, no audio, faststart. Duration 2.5025 s. |
| `scene0042-grid.mp4` | Existing `5x5_clipped_by_time/secondsyn/Grid_0030_seg02.mp4`. All 149 decodable frames re-encoded at the original 1920×1080 and 60000/1001 fps; H.264 CRF 22, no audio, faststart. Original labels, crop and color retained. Duration 2.485817 s. |
| `scene0042-view-00.webp` through `scene0042-view-24.webp` | Frame `000091.jpg` from each standardized view. 960×540, WebP quality 88, Lanczos resize. No added crop or color adjustment. |
| `scene0042-poster.webp` | Standardized center frame 91, 1280×720 WebP quality 90. |
| `scene0042-grid-poster.webp` | Decoded frame 91 of the existing grid preview, 1280×720 WebP quality 88. |

Frame 91 is at (91−1)/(60000/1001) = 1.5015 s from the beginning. The grid preview and standardized JPEG sequence depict the same scene segment at different processing stages. View selection compares a fixed JPEG frame index; video mode switching selects a presentation, without claiming pixel-identical or frame-exact synchronization between the two encodes.

## Paper figures

The current camera-ready source references these figures:

| Web file | Paper figure |
|---|---|
| `pipeline.webp` | `fig2.pdf` |
| `scene-diversity.webp` | `fig3b_scene_diversity_v3_3x3_widegap.pdf` |
| `benchmark-rd.webp` | `F_RD_all25_PSNR_SSIM.pdf` |

PDFs were rendered with Poppler at a 2000-pixel longest edge, then encoded as WebP quality 92. Content, aspect ratios and colors are preserved. The rate-distortion results compare RealDynLFV-matched training with Sintel zero-shot transfer in the existing framework of [Li et al.](https://doi.org/10.1109/TCSVT.2025.3598022).

## Institution marks

- `shu-emblem.png`: original official transparent PNG, 255×322, from the [Shanghai University emblem page](https://www.shu.edu.cn/xxgk/sdwh/xxxf.htm). [Image source](https://www.shu.edu.cn/__local/0/08/C6/1EABE492B0CF228A5564D6E6ABE_779D1EE3_5BF7.png).
- `scie-emblem.png`: 225×340 PNG extracted from the official explanatory sheet on the [School emblem page](https://scie.shu.edu.cn/info/1065/1790.htm). [Image source](https://scie.shu.edu.cn/Portals/264/scieyb.jpg). The box (490,75)–(715,415) contains the complete blue emblem and black SCIE wordmark. Pixels are retained without recoloring, redrawing or resizing.

Both marks appear once per page at their original aspect ratios on a white background.

## Publication metadata

Author order, affiliation, capture and evaluation descriptions, and reported gains follow the current camera-ready manuscript. Citation metadata records acceptance at VCIP 2026. No DOI or proceedings pages are assigned in the local source used for this preview. The site provides the selected sample; full dataset release is planned after journal-extension acceptance.
