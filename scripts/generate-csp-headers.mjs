import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DIST_DIR = new URL('../dist', import.meta.url);
const SCRIPT_SRC_ALLOWLIST = ["'self'", 'https://static.cloudflareinsights.com'];
const MANUAL_INLINE_SCRIPT_HASHES = [
  // Cloudflare Pages injects a small inline bootstrap for analytics beacon configuration.
  'sha256-f+ciQ0o9AmBT/+Kq9n40UrnVTNGWwuRSvlqcFtx3UAA=',
];
const OTHER_DIRECTIVES = [
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.plantuml.com",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
];

const STATIC_HEADERS = [
  'Cross-Origin-Opener-Policy: same-origin',
  'Cross-Origin-Resource-Policy: same-origin',
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
  'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
  'X-Permitted-Cross-Domain-Policies: none',
];

const walkHtmlFiles = async (dir, files = []) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkHtmlFiles(resolved, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(resolved);
    }
  }
  return files;
};

const extractInlineScripts = (html) => {
  const inlineScripts = [];
  const scriptRegex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html))) {
    const body = match[1];
    if (body.trim()) {
      inlineScripts.push(body);
    }
  }
  return inlineScripts;
};

const hashScript = (content) =>
  `sha256-${crypto.createHash('sha256').update(content, 'utf8').digest('base64')}`;

const main = async () => {
  const distPath = fileURLToPath(DIST_DIR);
  const outputFilePath = path.join(distPath, '_headers');
  const htmlFiles = await walkHtmlFiles(distPath);
  if (htmlFiles.length === 0) {
    throw new Error('No HTML files found in dist/. Run the Astro build before this script.');
  }

  const hashes = new Set();

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, 'utf8');
    const inlineScripts = extractInlineScripts(html);
    inlineScripts.forEach((script) => hashes.add(hashScript(script)));
  }

  if (hashes.size === 0) {
    throw new Error('No inline scripts detected. Did the Astro build change?');
  }

  const sortedHashes = Array.from(hashes).sort();
  const scriptSrcParts = [
    ...SCRIPT_SRC_ALLOWLIST,
    ...MANUAL_INLINE_SCRIPT_HASHES.map((hash) => `'${hash}'`),
    ...sortedHashes.map((hash) => `'${hash}'`),
  ];
  const cspDirectives = [
    `Content-Security-Policy: default-src 'self'; script-src ${scriptSrcParts.join(' ')};`,
    ...OTHER_DIRECTIVES.map((directive) => `${directive};`),
  ];

  const headerLines = [
    '/*',
    ...cspDirectives.map((line) => `  ${line}`),
    ...STATIC_HEADERS.map((line) => `  ${line}`),
    '*/',
    '',
  ];

  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  await fs.writeFile(outputFilePath, headerLines.join('\n'));

  console.log(
    `Generated CSP header with ${sortedHashes.length} inline script hashes -> ${outputFilePath}`
  );
};

await main();
