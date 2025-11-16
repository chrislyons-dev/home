// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrislyons.dev',
  integrations: [react(), sitemap()],

  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  experimental: {
    clientPrerender: true,
  },

  vite: {
    plugins: [
      tailwindcss(),
      visualizer({
        filename: './docs/architecture/bundle-stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ],
    build: {
      cssMinify: 'lightningcss',
      assetsInlineLimit: 0,
    },
  },
});
