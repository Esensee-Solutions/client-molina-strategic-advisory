/* /llms.txt (llmstxt.org): a plain summary of the site for AI assistants,
   built from the English copy in src/content/ so it never drifts from the
   pages. Spanish readers are pointed to /es/. */
import type { APIRoute } from 'astro';
import { localePath, useT } from '../i18n';
import { CALENDLY_URL, EMAIL, LINKEDIN } from '../settings';

export const GET: APIRoute = ({ site }) => {
  const t = useT('en');
  const url = (page: string, lang: 'en' | 'es' = 'en') => site!.origin + localePath(lang, page);
  const list = (prefix: string, n: number) =>
    Array.from({ length: n }, (_, i) => `- ${t(`${prefix}${i + 1}`)}`).join('\n');
  const service = (key: string) =>
    `### ${t(`svc.${key}.title`)}\n\n${t(`svc.${key}.desc`)}\n\n${list(`svc.${key}.i`, 6)}`;
  const areas = Array.from({ length: 6 }, (_, i) => `- ${t(`diag.a${i + 1}.t`)}: ${t(`diag.a${i + 1}.d`)}`).join('\n');
  const ways = Array.from({ length: 4 }, (_, i) => `- ${t(`ways.w${i + 1}.t`)}: ${t(`ways.w${i + 1}.d`)}`).join('\n');

  const text = `# Molina Strategic Advisory

> ${t('meta.desc')} ${t('hero.support')} Based in Naranjito, Puerto Rico. English and Spanish.

${t('challenge.body2')}

## ${t('services.eyebrow')}

${['people', 'payroll', 'ops', 'sales'].map(service).join('\n\n')}

## ${t('diag.title')}

${t('diag.intro')}

${t('diag.areasTitle')}:

${areas}

${t('diag.delivTitle')}:

${list('diag.d', 5)}

## ${t('ways.title')}

${ways}

## ${t('fit.title')}

${list('fit.i', 10)}

## ${t('about.name')}

${t('about.bio1')}

${t('about.bio2')}

## ${t('ref.title')}

${t('ref.lede')} ${t('ref.body')}

${t('ref.signalsTitle')}

${list('ref.s', 8)}

## ${t('nav.contact')}

- [${t('cta.consult')}](${CALENDLY_URL})
- Email: ${EMAIL}
- [LinkedIn](${LINKEDIN})

## Pages

- [Home (English)](${url('')})
- [Inicio (Español)](${url('', 'es')})
- [${t('nav.terms')}](${url('terms/')})
- [${t('nav.privacy')}](${url('privacy/')})

## Note

${t('footer.disclaimer')} ${t('footer.dba')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
