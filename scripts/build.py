"""Build complete static pages from explicit translations."""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
e = lambda value: html.escape(str(value), quote=True)


def render(c, locale):
    text = c['locales'][locale]
    values = dict(text)
    values.update(c['shared'])
    values['lang'] = 'en' if locale == 'en' else 'zh-CN'
    values['switch_href'] = 'zh.html' if locale == 'en' else 'index.html'
    values['switch_lang'] = 'zh-CN' if locale == 'en' else 'en'
    values['switch_text'] = '中文' if locale == 'en' else 'EN'
    values['page_file'] = 'index.html' if locale == 'en' else 'zh.html'
    values['authors_html'] = ', '.join(e(a['name']) + ('<sup>*</sup>' if a.get('corresponding') else '') for a in c['authors'])
    values['stats_html'] = ''.join(f'<div><dt>{e(label)}</dt><dd>{e(value)}</dd></div>' for value, label in zip(c['stats'], text['stat_labels']))
    values['view_buttons_html'] = ''.join(
        f'<button type="button" class="view-button" data-view="{i:02}" data-camera="{chr(65+i//5)}{i%5+1}" '
        f'aria-pressed="{str(i==12).lower()}" aria-label="{e(text["camera"])} {chr(65+i//5)}{i%5+1}, {e(text["view"])} {i:02}" '
        f'title="{chr(65+i//5)}{i%5+1} / v{i:02}">{chr(65+i//5)}{i%5+1}</button>' for i in range(25))
    values['steps_html'] = ''.join(f'<li><h3>{e(s[0])}</h3><p>{e(s[1])}</p></li>' for s in text['steps'])
    values['scene_selector_html'] = ''.join(
        f'<button type="button" class="scene-option" data-scene="{e(s["id"])}" '
        f'data-prefix="{e(s["prefix"])}" data-hd-prefix="{e(s["hd_prefix"])}" data-name="{e(s["name"][locale])}" '
        f'data-hint="{e(s["hint"][locale])}" data-frame="{s["frame"]}" '
        f'data-time="{(s["frame"]-1)/s["fps"]:.3f}" '
        f'aria-pressed="{str(i==0).lower()}"><img data-src="{e(s["thumb"])}" '
        f'width="320" height="180" alt="" decoding="async"><span>{e(s["name"][locale])}</span><small>{e(s["id"])}</small></button>'
        for i,s in enumerate(c['scenes']))
    values['diversity_html'] = ''.join(
        f'<figure><a href="{e(s["hd"])}" class="image-preview" data-image-preview>'
        f'<img data-src="{e(s["src"])}" width="480" height="270" alt="{e(s["name"][locale]+". "+s["caption"][locale])}" decoding="async">'
        f'<span class="expand-hint">{e(text["enlarge"])}</span></a><figcaption>{e(s["name"][locale])}<span>{e(s["id"])}</span></figcaption></figure>'
        for s in c['diversity'])
    frame_caption = lambda n: f'第 {n} 帧' if locale == 'zh' else f'Frame {n}'
    temporal = c['temporal']
    fps = temporal['fps_numerator'] / temporal['fps_denominator']
    values.update(time_start=temporal['start'], time_end=temporal['end'], time_initial=temporal['initial'], time_fps=fps)
    values['temporal_html'] = ''.join(
        f'<figure class="time-frame" data-time-card="{i}" data-selected="{str(n==temporal["initial"]).lower()}"><a class="image-preview" href="assets/media/time0042/hd/frame-{n:03}.webp" data-image-preview>'
        f'<img data-src="assets/media/time0042/frame-{n:03}.webp" alt="{e(text["time_alt"])} {n}" width="640" height="360" decoding="async"><span class="expand-hint">{e(text["enlarge"])}</span></a>'
        f'<figcaption><span>{e(frame_caption(n))}</span><span>{(n-1)/fps:.6f} s</span></figcaption></figure>'
        for i,n in enumerate(range(temporal['initial']-1, temporal['initial']+2)))
    values['comparison_html'] = ''.join(
        f'<figure><a class="image-preview" data-image-preview href="assets/media/scenes/0042/hd/view-{n:02}.webp">'
        f'<img data-src="assets/media/scenes/0042/view-{n:02}.webp" width="640" height="360" alt="0042, {e(frame_caption(91))}, C{n-9}" decoding="async"><span class="expand-hint">{e(text["enlarge"])}</span></a>'
        f'<figcaption>0042 · {e(frame_caption(91))} · <strong>C{n-9}</strong></figcaption></figure>' for n in (10,14))
    values['motion_clips_html'] = ''.join(
        f'<article class="motion-clip"><h4>{e(s["name"][locale])}<span>{e(s["id"])}</span></h4>'
        f'<div class="video-stage"><video controls playsinline muted preload="none" data-poster="{e(s["poster"])}" width="960" height="540" aria-label="{e(s["name"][locale])}"><source data-src="{e(s["src"])}" type="video/mp4"></video>'
        f'<button class="play-video" type="button" data-play-video data-play="{e(text["play_video"])}" data-replay="{e(text["replay"])}" data-loading="{e(text["video_loading"])}" hidden>{e(text["play_video"])}</button></div>'
        f'<p class="caption">{e(s["caption"][locale])}</p><div class="speed-control"><label for="clip-speed-{e(s["id"])}">{e(text["speed_label"])}</label>'
        f'<select id="clip-speed-{e(s["id"])}" class="clip-speed"><option value="1">{e(text["normal_speed"])}</option><option value="0.25">{e(text["slow_speed"])}</option></select></div></article>'
        for s in c['motions'])
    values['citation'] = c['citation']
    template = (ROOT / 'template.html').read_text(encoding='utf-8')
    def replace(m):
        key = m[1]
        if key not in values:
            raise ValueError(f'Missing {locale} field: {key}')
        return str(values[key]) if key.endswith('_html') else e(values[key])
    return re.sub(r'{{(\w+)}}', replace, template)


def main():
    c = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
    if c['locales']['en'].keys() != c['locales']['zh'].keys():
        raise ValueError('English and Chinese content keys differ')
    for locale, filename in [('en', 'index.html'), ('zh', 'zh.html')]:
        (ROOT / filename).write_text(render(c, locale), encoding='utf-8', newline='\n')
        print(f'Built {filename}')


if __name__ == '__main__':
    main()
