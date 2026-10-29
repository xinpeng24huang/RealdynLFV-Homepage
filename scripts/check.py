"""Check generated pages, relative assets, bilingual structure, and sample integrity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re
from build import render

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.images, self.buttons = [], [], [], []
        self.h1 = 0
        self.lang = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'h1':
            self.h1 += 1
        for key in ['href', 'src', 'poster']:
            if a.get(key):
                self.refs.append(a[key])
        if tag == 'img':
            self.images.append(a)
        if 'data-view' in a:
            self.buttons.append(a)


def main():
    c = json.loads((ROOT/'content.json').read_text(encoding='utf-8'))
    assert c['locales']['en'].keys() == c['locales']['zh'].keys(), 'Missing translation'
    pages = []
    for locale, filename in [('en', 'index.html'), ('zh', 'zh.html')]:
        text = (ROOT/filename).read_text(encoding='utf-8')
        assert text == render(c, locale), f'{filename} is stale; run build.py'
        p = Page()
        p.feed(text)
        assert p.h1 == 1 and len(p.ids) == len(set(p.ids))
        assert p.lang == ('en' if locale == 'en' else 'zh-CN')
        for ref in p.refs:
            u = urlsplit(ref)
            if u.scheme:
                assert u.scheme in ('https', 'mailto'), f'Unexpected URL: {ref}'
                continue
            assert not u.netloc and not u.path.startswith('/'), f'Nonportable asset: {ref}'
            assert '..' not in Path(u.path).parts
            if u.path:
                assert (ROOT/u.path).is_file(), f'Missing local file: {ref}'
            elif u.fragment:
                assert u.fragment in p.ids, f'Broken anchor: {ref}'
        assert all('alt' in a for a in p.images), 'Missing image alternative'
        assert len(p.buttons) == 25
        assert [a['data-view'] for a in p.buttons] == [f'{i:02}' for i in range(25)]
        assert sum(a.get('aria-pressed') == 'true' for a in p.buttons) == 1
        for logo in ['shu-emblem.png', 'scie-emblem.png']:
            assert sum(a.get('src', '').endswith(logo) for a in p.images) == 2
        assert '{{' not in text and 'WaterPig02' not in text and 'placeholder' not in text
        pages.append(p)
        assert len(re.findall(r'data-scene="', text)) == 6
        assert text.count('class="motion-clip"') == 2
        assert '<div class="gains">' not in text and 'benchmark-rd.webp' not in text
        assert 'audio-clap' not in text and 'clap signal' not in text and '拍手' not in text
        print(f'{filename}: current build, resources, 6 scenes, 25 views, temporal browser, logos and language PASS')
    assert pages[0].ids == pages[1].ids, 'Languages have different sections'
    for i in range(25):
        assert (ROOT/f'assets/media/scene0042-view-{i:02}.webp').is_file()
    for scene in c['scenes']:
        for i in range(25):
            assert (ROOT/f'{scene["prefix"]}{i:02}.webp').is_file()
    for i in range(1,151):
        assert (ROOT/f'assets/media/time0042/frame-{i:03}.webp').is_file()
    assert len(c['diversity']) == 15
    for filename in ['scene0042-center.mp4', 'scene0042-grid.mp4', 'scene0042-grid-poster.webp']:
        assert (ROOT/'assets/media'/filename).is_file()
    for path in (ROOT/'assets').rglob('*'):
        if path.is_file():
            assert path.stat().st_size < 15_000_000, f'Oversized web asset: {path.name}'
    print('Bilingual sections, on-demand sample assets and per-file size budget: PASS')
    print('Static checks complete. Browser playback and visual review are separate checks.')


if __name__ == '__main__':
    main()
