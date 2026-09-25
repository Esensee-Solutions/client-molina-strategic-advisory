#!/usr/bin/env python3
"""Check the site against the content rules in CLAUDE.md.

    python3 check.py

Checks that English and Spanish have the same keys, every t('key') in a
component exists, nothing claims ADP certification or publishes a price, every page
keeps the no-legal-or-tax-advice disclaimer, and nothing adds tracking the
Privacy Policy doesn't cover. Exits 1 on any failure. Layout, contrast and
reduced motion still need a look in a browser at phone width.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
COPY = ['src/content/site.ts', 'src/content/legal.ts']
SOURCE = sorted(p for p in (ROOT / 'src').rglob('*') if p.suffix in ('.astro', '.ts'))

failures = []


def fail(msg):
    failures.append(msg)


def keys_by_language(path):
    """Return {'en': {key: text}, 'es': {...}} from a copy file."""
    text = (ROOT / path).read_text(encoding='utf-8')
    out = {}
    for lang in ('en', 'es'):
        m = re.search(r'\b' + lang + r':\s*\{(.*?)\n\s*\}', text, re.S)
        block = m.group(1) if m else ''
        out[lang] = dict(re.findall(r"'([\w.-]+)':\s*'((?:[^'\\]|\\.)*)'", block))
    return out


copy = {'en': {}, 'es': {}}
for path in COPY:
    found = keys_by_language(path)
    for lang in copy:
        copy[lang].update(found[lang])
    only_en = sorted(set(found['en']) - set(found['es']))
    only_es = sorted(set(found['es']) - set(found['en']))
    if only_en:
        fail(f'{path}: English only, no Spanish: {", ".join(only_en)}')
    if only_es:
        fail(f'{path}: Spanish only, no English: {", ".join(only_es)}')

for path in (p for p in SOURCE if p.suffix == '.astro'):
    name = path.relative_to(ROOT)
    code = path.read_text(encoding='utf-8')
    for key in re.findall(r"\bt\('([\w.-]+)'\)", code):
        if key not in copy['en']:
            fail(f"{name}: t('{key}') has no copy")

footer = (ROOT / 'src/components/Footer.astro').read_text(encoding='utf-8')
layout = (ROOT / 'src/layouts/Layout.astro').read_text(encoding='utf-8')
if "t('footer.disclaimer')" not in footer or '<Footer' not in layout:
    fail('the footer disclaimer is no longer on every page')

for path in SOURCE + sorted((ROOT / 'public').rglob('*.html')):
    if re.search(r'googletagmanager|google-analytics|gtag\(|fbq\(|plausible|hotjar|clarity\.ms',
                 path.read_text(encoding='utf-8'), re.I):
        fail(f'{path.relative_to(ROOT)}: tracking script found; the Privacy Policy must change with it')

for lang in ('en', 'es'):
    disclaimer = copy[lang].get('footer.disclaimer', '')
    if not re.search(r'legal (or|ni) (tax|fiscal)', disclaimer):
        fail(f'footer.disclaimer ({lang}) no longer says MSA gives no legal or tax advice')

site_text = '\n'.join(p.read_text(encoding='utf-8') for p in SOURCE)
banned = {
    r'ADP[\s-]+(Certified|Partner)|(Certified|Partner)[\s-]+(by\s+)?ADP|certificad[oa]s?\s+(de|por|en)\s+ADP|socio\s+de\s+ADP':
        'ADP certification or partnership claim (say "extensive hands-on ADP experience")',
    r'[$€]\s?\d|\d\s?(USD|dólares|dollars)\b|\bprecios?\b|\bpricing\b|\bprice[sd]?\b':
        'a price',
}
for pattern, what in banned.items():
    for m in re.finditer(pattern, site_text, re.I):
        fail(f'site copy mentions {what}: "{m.group(0)}"')

if failures:
    print('\n'.join('FAIL  ' + f for f in failures))
    sys.exit(1)
print(f'OK  {len(copy["en"])} keys in both languages, {len(SOURCE)} source files checked')
