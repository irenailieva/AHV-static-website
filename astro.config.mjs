// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always',
  },
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en', 'de'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    domains: ['lh3.googleusercontent.com', 'drive.google.com', 'images.unsplash.com'],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});