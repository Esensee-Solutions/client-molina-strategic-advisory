// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://molinastrategicadvisory.com',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    // English at /, Spanish at /es/.
    routing: { prefixDefaultLocale: false },
  },
});
