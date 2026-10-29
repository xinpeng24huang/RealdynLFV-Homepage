import pathlib,json,re
from html.parser import HTMLParser
root=pathlib.Path(__file__).resolve().parents[1]
class Check(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  if tag=='a':self.links.append(d.get('href',''))
  if tag in ('link','img','script'):self.assets.append(d.get('href',d.get('src','')))
p=Check();text=(root/'index.html').read_text();p.feed(text)
assert len(p.ids)==len(set(p.ids))
assert all((a.startswith('#') and a[1:] in p.ids) or a == 'zh.html' for a in p.links), 'Current preview must have only valid section links'
assert all((root/a).is_file() for a in p.assets if a)
assert '{{' not in text
for t in ['225,775','165.9','1920 × 1080','60 FPS','Accepted','not publicly available','Citation coming soon']:assert t in text
for t in ['Published','CC BY-NC','Paper ID','doi.org']:assert t not in text
assert '<script src="assets/language.js" defer></script>' in text
for t in ['audio signals', 'rather than hardware synchronization', 'Reconstruction &amp; coding', 'POTENTIAL APPLICATION', 'Publication details are pending']: assert t in text
assert '5 × 5 synchronized' not in text
def lum(h):
 c=[int(h[i:i+2],16)/255 for i in (0,2,4)];return sum((v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4)*w for v,w in zip(c,[.2126,.7152,.0722]))
ratios={}
for fg,bg in [('142c32','f9faf6'),('4d6369','f9faf6'),('17655f','f9faf6'),('ffffff','142c32'),('516c62','edf1ed'),('3b5750','eaf0eb'),('435d54','e8efea')]:
 a,b=sorted([lum(fg),lum(bg)]);ratio=(b+.05)/(a+.05);assert ratio>=4.5;ratios[fg+'/'+bg]=round(ratio,2)
r={'html_links_assets':'pass','unique_ids':'pass','factual_guardrails':'pass','runtime_javascript':'language preference and approved-image viewer','contrast_ratios':ratios,'runtime_bytes':sum((root/f).stat().st_size for f in ['index.html','assets/style.css','assets/favicon.svg','assets/language.js','assets/gallery.js'])}
(root/'evidence').mkdir(exist_ok=True)
(root/'evidence/static-results.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))

zh=(root/'zh.html').read_text()
assert 'lang="zh-CN"' in zh
for phrase in ['音频信号','而非采用硬件同步','已评估任务','潜在应用','完整数据集与代码暂未公开','href="index.html"']: assert phrase in zh
for phrase in ['Under preparation','Real-world scenes','Publication pending','Back to top']: assert phrase not in zh
print('Chinese static content and language metadata: PASS')
