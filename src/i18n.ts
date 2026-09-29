/* ==========================================================================
   Languages. English is at /, Spanish at /es/ (see astro.config.mjs).
   ========================================================================== */

import { site } from './content/site';
import { legal } from './content/legal';

export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];

/** Every page, by its address without the language prefix. The sitemap lists these. */
export const pages = ['', 'terms/', 'privacy/'] as const;

const copy: Record<Lang, Record<string, string>> = {
  en: { ...site.en, ...legal.en },
  es: { ...site.es, ...legal.es },
};

/** Returns t('some.key') for one language. A missing key fails the build. */
export function useT(lang: Lang) {
  return (key: string): string => {
    const value = copy[lang][key];
    if (value === undefined) throw new Error(`No ${lang} copy for "${key}"`);
    return value;
  };
}

/** The address of a page in a language: localePath('es', 'terms/') → '/es/terms/'. */
export function localePath(lang: Lang, page = ''): string {
  return (lang === 'en' ? '/' : `/${lang}/`) + page;
}
