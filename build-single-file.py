#!/usr/bin/env python3
"""
Flatten a built page into one self-contained .html file for previewing or emailing.

    npm run build
    python3 build-single-file.py [page] [output.html]

The page is its address on the site: "/" (the default), "es/", "terms/",
"es/privacy/" and so on. It is read from dist/, so run `npm run build` first.
A flattened page is standalone: links to the other pages will not resolve from it.

CSS, JavaScript, the logo and the photograph are all embedded, so the result
opens from a hard drive with no server and no folder alongside it. Google Fonts
still loads over the network; offline it falls back to system fonts.

This output is a SNAPSHOT, not the source. Edit the real files, rebuild and re-run.
"""

import base64
import mimetypes
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")
DEFAULT_OUT = os.path.join(HERE, "molina-strategic-advisory.html")


def read(path):
    with open(os.path.join(DIST, path.lstrip("/")), encoding="utf-8") as fh:
        return fh.read()


def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    with open(os.path.join(DIST, path.lstrip("/")), "rb") as fh:
        return "data:%s;base64,%s" % (mime, base64.b64encode(fh.read()).decode())


def main():
    args = list(sys.argv[1:])

    # Anything that isn't an .html filename is the page to flatten.
    page = "/"
    if args and not args[0].endswith(".html"):
        page = args.pop(0)
    out_path = args[0] if args else DEFAULT_OUT

    source = os.path.join(page.strip("/"), "index.html")
    if not os.path.exists(os.path.join(DIST, source)):
        sys.exit("error: dist/%s not found. Run `npm run build` first." % source)
    html = read(source)

    # The Spanish-browser redirect would send a local file to /es/, which
    # doesn't exist next to it.
    html = re.sub(r"<script data-lang-redirect>.*?</script>", "", html, flags=re.S)

    for href in re.findall(r'<link rel="stylesheet" href="(/_astro/[^"]+)">', html):
        html = html.replace(
            '<link rel="stylesheet" href="%s">' % href, "<style>\n%s\n</style>" % read(href)
        )

    for src in re.findall(r'<script type="module" src="(/_astro/[^"]+)"></script>', html):
        body = read(src)
        if "</script" in body.lower():
            sys.exit("error: %s contains a literal </script> and cannot be inlined" % src)
        html = html.replace(
            '<script type="module" src="%s"></script>' % src,
            '<script type="module">\n%s\n</script>' % body,
        )

    # Every remaining local image, whether referenced by src= or href=.
    for attr, path in set(re.findall(r'(src|href)="(/assets/img/[^"]+)"', html)):
        html = html.replace('%s="%s"' % (attr, path), '%s="%s"' % (attr, data_uri(path)))

    leftover = re.findall(r'(?:src|href)="(/(?:_astro|assets)/[^"]+)"', html)
    if leftover:
        sys.exit("error: these local files were not inlined: %s" % ", ".join(leftover))

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(html)

    print("wrote %s from dist/%s (%.0f KB)" % (out_path, source, os.path.getsize(out_path) / 1024))


if __name__ == "__main__":
    main()
