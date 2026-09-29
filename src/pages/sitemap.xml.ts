/* /sitemap.xml: every page in both languages, each with its other-language
   version, so search engines pair English and Spanish. */
import type { APIRoute } from 'astro';
import { languages, localePath, pages } from '../i18n';

export const GET: APIRoute = ({ site }) => {
  const url = (lang: (typeof languages)[number], page: string) => site!.origin + localePath(lang, page);
  const entries = pages.flatMap((page) =>
    languages.map((lang) => {
      const alternates = [
        ...languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, page)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en', page)}"/>`,
      ];
      return `  <url>\n    <loc>${url(lang, page)}</loc>\n${alternates.join('\n')}\n  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
