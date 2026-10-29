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
    values['results_html'] = ''.join('<tr>' + ''.join(f'<td>{e(v)}</td>' for v in row) + '</tr>' for row in c['results'])
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
