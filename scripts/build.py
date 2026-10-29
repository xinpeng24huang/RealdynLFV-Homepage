"""Dependency-free, escaped static rendering; all URLs are explicit and reviewed."""
import json, html, pathlib, re
from urllib.parse import urlparse
ROOT = pathlib.Path(__file__).resolve().parents[1]
c = json.loads((ROOT/'content.json').read_text())
e = lambda s: html.escape(str(s), quote=True)
def link(url):
    if urlparse(url).scheme != 'https':
        raise ValueError('Resource links must use https')
    return e(url)
c['stats_html'] = ''.join(f'<div class="stat"><strong>{e(v)}</strong><span>{e(k)}</span></div>' for v,k in c['stats'])
c['resources_html'] = ''.join(f'<a class="resource" href="{link(r["url"])}">{e(r["label"])} <span>Available ↗</span></a>' if r['url'] else f'<div class="resource">{e(r["label"])}<span>{e(r["status"])}</span></div>' for r in c['resources'])
def local_asset(value):
    p = pathlib.Path(value)
    if p.is_absolute() or '..' in p.parts or not (ROOT/p).is_file():
        raise ValueError('Media must be an existing local asset')
    return e(value)

def media(g, i):
    if g['src']:
        if not g.get('approved') or not g['alt']:
            raise ValueError('Media requires publication approval and a text description')
        src = local_asset(g['src'])
        if g.get('kind') == 'video':
            poster = f' poster="{local_asset(g["poster"])}"' if g.get('poster') else ''
            visual = f'<video controls preload="none" playsinline{poster} aria-label="{e(g["alt"])}"><source src="{src}" type="video/mp4">{e(g["alt"])}</video>'
        else:
            visual = f'<a class="image-preview" href="{src}" data-image-preview><img src="{src}" alt="{e(g["alt"])}" loading="lazy"><span class="preview-hint">View image ↗</span></a>'
    else:
        visual = f'<div class="placeholder"><span class="frame-mark" aria-hidden="true">{i+1:02}</span></div>'
    return f'<figure>{visual}<figcaption><p class="media-type">{e(g["spec"])}</p><h3>{e(g["title"])}</h3><p>{e(g["description"])}</p></figcaption></figure>'
c['gallery_html'] = ''.join(media(g,i) for i,g in enumerate(c['gallery']))
c['views_html'] = ''.join(f'<span class="view {"center" if i==12 else ""}">{"C" if i==12 else ""}</span>' for i in range(25))
hero = c.get('hero_media')
if hero and hero.get('src'):
    c['hero_html'] = '<div class="hero-visual">' + media(hero, 0) + '</div>'
else:
    c['hero_html'] = '<figure class="hero-visual"><div class="view-array" aria-hidden="true">' + c['views_html'] + '</div><figcaption><strong>5 × 5 views</strong><span>Conceptual array layout · not a scene image</span></figcaption></figure>'
c['authors_html'] = f'<p>{e(c["authors"])}</p>' if c['authors'] else ''
c['citation_html'] = f'<pre>{e(c["citation"])}</pre>' if c['citation'] else '<h3>Citation coming soon</h3><p>Publication details are pending. Citation metadata will follow.</p>'
c['license_html'] = e(c['license'] or 'Dataset license to be confirmed.')
c['releases_html'] = ''.join(f'<li>{e(r["version"])} · <a href="{link(r["url"])}">{e(r["label"])}</a></li>' for r in c['releases'])
t = (ROOT/'template.html').read_text()
out = re.sub(r'{{(\w+)}}',lambda m: str(c[m[1]]) if m[1].endswith('_html') else e(c[m[1]]),t)
(ROOT/'index.html').write_text(out)
print('Built index.html')

# Both language pages are complete static documents; no client-side text replacement.
def translate_match(match):
    text = html.unescape(match.group(1))
    key = text.strip()
    return '>' + (html.escape(c['zh'][key]) if key in c['zh'] else match.group(1)) + '<'
zh = re.sub(r'>([^<>]+)<', translate_match, out)
zh = zh.replace('lang="en"', 'lang="zh-CN"', 1)
for key, value in c['zh'].items():
    zh = zh.replace('aria-label="' + e(key) + '"', 'aria-label="' + e(value) + '"')
    zh = zh.replace('alt="' + e(key) + '"', 'alt="' + e(value) + '"')
    zh = zh.replace('content="' + e(key) + '"', 'content="' + e(value) + '"')
zh = zh.replace('href="zh.html" lang="zh-CN" hreflang="zh-CN" data-language="zh">中文', 'href="index.html" lang="en" hreflang="en" data-language="en">EN')
(ROOT/'zh.html').write_text(zh)
print('Built zh.html')
