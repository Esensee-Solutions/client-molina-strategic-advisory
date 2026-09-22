#!/usr/bin/env python3
"""
Flatten a page into one self-contained .html file for previewing or emailing.

    python3 build-single-file.py [source.html] [output.html]

Defaults to index.html. Note that a flattened page is standalone: links to the
other pages (Terms, Privacy) will not resolve from it, because those files are
not alongside it.

CSS, JavaScript, the logo and the photograph are all embedded, so the result
opens from a hard drive with no server and no folder alongside it. Google Fonts
still loads over the network; offline it falls back to system fonts.

This output is a SNAPSHOT, not the source. Edit the real files and re-run.
"""

import base64
import mimetypes
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUT = os.path.join(HERE, "molina-strategic-advisory.html")


def read(*parts):
    with open(os.path.join(HERE, *parts), encoding="utf-8") as fh:
        return fh.read()


def data_uri(relpath):
    mime = mimetypes.guess_type(relpath)[0] or "application/octet-stream"
    with open(os.path.join(HERE, relpath), "rb") as fh:
        return "data:%s;base64,%s" % (mime, base64.b64encode(fh.read()).decode())


def main():
    args = list(sys.argv[1:])

    # A bare filename that exists in this folder is the page to flatten;
    # anything else is where to write the result.
    source = "index.html"
    if args and not os.path.isabs(args[0]) and os.path.exists(os.path.join(HERE, args[0])):
        source = args.pop(0)
    out_path = args[0] if args else DEFAULT_OUT

    html = read(source)

    # Inline every stylesheet and script the page actually references, in place,
    # so page-specific bundles (the legal pages load an extra one) are picked up.
    for href in re.findall(r'<link rel="stylesheet" href="(assets/[^"]+)">', html):
        html = html.replace(
            '<link rel="stylesheet" href="%s">' % href,
            "<style>\n%s\n</style>" % read(*href.split("/")),
        )

    for src in re.findall(r'<script src="(assets/[^"]+)"></script>', html):
        body = read(*src.split("/"))
        if "</script" in body.lower():
            sys.exit("error: %s contains a literal </script> and cannot be inlined" % src)
        html = html.replace(
            '<script src="%s"></script>' % src, "<script>\n%s\n</script>" % body
        )

    # Every remaining local asset, whether referenced by src= or href=.
    for attr, path in set(re.findall(r'(src|href)="(assets/img/[^"]+)"', html)):
        html = html.replace('%s="%s"' % (attr, path), '%s="%s"' % (attr, data_uri(path)))

    leftover = re.findall(r'(?:src|href)="(assets/[^"]+)"', html)
    if leftover:
        sys.exit("error: these local files were not inlined: %s" % ", ".join(leftover))

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(html)

    print("wrote %s from %s (%.0f KB)" % (out_path, source, os.path.getsize(out_path) / 1024))


if __name__ == "__main__":
    main()
