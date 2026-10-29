# Web media and scientific sources

## Standardized scene 0042

The public scene identifier `0042` maps to `Secondsyn/0030_seg02`, the 16.0–18.5 second segment of source recording `0030.mp4`. All web exports use its existing standardized JPEGs. Geometry correction, shared crop, 1080p resize and the fixed LUT are already present in these images; web generation only resizes, arranges or encodes them.

Camera order is row-major: A1–A5 correspond to v00–v04, B1–B5 to v05–v09, C1–C5 to v10–v14, D1–D5 to v15–v19, and E1–E5 to v20–v24. C3/v12 is the center camera. Each camera has frames 1–150. All 25 source videos record 60000/1001 fps; timestamps are `(frame_index - 1) * 1001 / 60000` seconds from the clip start.

| File | Content |
|---|---|
| `scene0042-grid.mp4` | Default inline 1280×720 array video. Each of the 25 tiles uses the same standardized frame index, with row-major camera labels. |
| `scene0042-grid-hd.mp4` | Independent 1920×1080 array download from the same frames. |
| `scene0042-center.mp4` | Inline 960×540 video of C3 frames 1–150. |
| `scene0042-grid-poster.webp` | Array frame 91 from the standardized JPEGs. |
| `scene0042-poster.webp` | C3 poster. |

The new array video replaces the earlier preview made from `Grid_0030_seg02.mp4`. Both current array and center videos contain the same 150 frame indices. H.264 encodes retain 60000/1001 fps, use 8-bit 4:2:0, contain no audio and place MP4 metadata before the media payload for fast start.

## Viewpoints, comparisons and scene coverage

The six interactive scenes are 0042, 0001, 0021, 0025, 0030 and 0044. They all use frame 91 and the camera mapping above. The same-frame comparison shows C1 and C5 of scene 0042.

- `scenes/{id}/view-{00..24}.webp`: lightweight 640×360 images.
- `scenes/{id}/hd/view-{00..24}.webp`: 960×540 versions, requested only when enlarged.
- `scenes/{id}/thumb.webp`: 320×180 scene choices.
- `diversity/{id}.webp`: 480×270 inline gallery images.
- `diversity/hd/{id}.webp`: 1280×720 gallery images loaded only on opening.

The 15 gallery scenes are 0001, 0003, 0004, 0009, 0016, 0019, 0021, 0023, 0024, 0025, 0028, 0030, 0034, 0042 and 0045. Frame indices and bilingual descriptions are kept in `content.json`.

## Temporal detail and additional motion

The frame browser contains only 30 consecutive C3 frames, 76–105. A fixed rectangle `(x=200, y=180, width=1280, height=720)` from each 1920×1080 source highlights leg and foot movement while retaining background context. No interpolation or composition is used. The inline versions are 640×360; `time0042/hd/` contains the 1280×720 crop. Frame 91 is the initial selection. Its timestamp is 1.501500 s; the selected range runs from 1.251250 to 1.735067 s.

`scene0009-center.mp4` shows a person moving through a glass door; `scene0044-center.mp4` shows walking behind a foreground fence. Each uses C3 frames 1–150, at 960×540 and the source rate of 60000/1001 fps. Posters use frame 75. All inline videos support original speed and 0.25× playback, end without looping, and provide replay. Starting a video pauses the others.

## Acquisition photograph and paper figures

`camera-array.webp` (960×1008) and `camera-array-hd.webp` (1059×1112) come from the original `Fig1_left.png`, the photographic panel of paper Figure 1(a). The source pixels match the photograph embedded in the camera-ready figure. Only proportional resizing and WebP encoding were applied. The manuscript describes 25 action cameras, nominal 80 mm spacing and original 4K/60 fps capture.

`pipeline.webp` is rendered from paper `fig2.pdf`, with the original aspect ratio and colors. Temporal alignment uses the center camera's clapperboard sound as reference, cross-correlation offset estimation and nearest-frame trimming.

The page briefly describes use of the existing framework of [Li et al.](https://doi.org/10.1109/TCSVT.2025.3598022). The older rate-distortion and nine-scene figure assets are retained in source history but are not requested by the page.

## Loading policy

The default array video preloads metadata and never autoplays. Other videos prepare metadata and posters within 240 px of the viewport. On an explicit play request, auxiliary clips prepare a short 0.4-second media buffer before starting, with a bounded wait. Their H.264 encodes use a 2.4 Mbps VBV rate limit and 1.2 Mbit buffer. Gallery images use the same proximity threshold.

The viewpoint decode pool retains at most 18 completed/pending image entries once jobs settle, with two concurrent decodes. It warms adjacent cameras near the explorer, a small set for the scene a visitor points to or focuses, and the five-camera scan row. It does not preload all six scenes. The temporal pool retains 12 images with three concurrent decodes and pre-reads at most three frames on each side. Each pool reserves a slot for direct user requests and removes superseded queued demands. Browser HTTP caching is reused. Larger images and the HD array download are never prefetched.

## Institution marks and publication metadata

- `shu-emblem.png`: original transparent PNG from the [Shanghai University emblem page](https://www.shu.edu.cn/xxgk/sdwh/xxxf.htm). Clicking the mark opens the [university homepage](https://www.shu.edu.cn/).
- `scie-emblem.png`: complete emblem and wordmark extracted from the [official school emblem sheet](https://scie.shu.edu.cn/info/1065/1790.htm), without recoloring or redrawing. Clicking it opens [Xinpeng Huang's official faculty profile](https://scie-ie.shu.edu.cn/info/1078/1184.htm).

Both marks appear in the masthead and footer at their original aspect ratios. Authors and publication information follow the current camera-ready manuscript. Citation is retained pending formal proceedings metadata. The site offers selected samples; full dataset publication is planned after acceptance of the journal extension.
