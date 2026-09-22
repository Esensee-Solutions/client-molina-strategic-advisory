#!/usr/bin/env python3
"""
Flatten the site into one self-contained .html file for previewing or emailing.

    python3 build-single-file.py [output.html]

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
    out_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT

    html = read("index.html")
    css = read("assets", "css", "styles.css")
    content = read("assets", "js", "content.js")
    main_js = read("assets", "js", "main.js")

    # A literal </script> inside embedded JS would end the tag early.
    for name, body in (("styles.css", css), ("content.js", content), ("main.js", main_js)):
        if "</script" in body.lower():
            sys.exit("error: %s contains a literal </script> and cannot be inlined" % name)

    html = html.replace(
        '<link rel="stylesheet" href="assets/css/styles.css">',
        "<style>\n%s\n</style>" % css,
    )
    html = html.replace(
        '<script src="assets/js/content.js"></script>', "<script>\n%s\n</script>" % content
    )
    html = html.replace(
        '<script src="assets/js/main.js"></script>', "<script>\n%s\n</script>" % main_js
    )

    # Every remaining local asset, whether referenced by src= or href=.
    for attr, path in set(re.findall(r'(src|href)="(assets/img/[^"]+)"', html)):
        html = html.replace('%s="%s"' % (attr, path), '%s="%s"' % (attr, data_uri(path)))

    leftover = re.findall(r'(?:src|href)="(assets/[^"]+)"', html)
    if leftover:
        sys.exit("error: these local files were not inlined: %s" % ", ".join(leftover))

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(html)

    print("wrote %s (%.0f KB)" % (out_path, os.path.getsize(out_path) / 1024))


if __name__ == "__main__":
    main()
