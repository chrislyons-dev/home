#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIGHTHOUSECI_DIR = '.lighthouseci';
const PERFORMANCE_DOC = 'docs/features/performance.md';
const LINKS_FILE = path.join(LIGHTHOUSECI_DIR, 'links.json');

function calculateAverageScores() {
  const lhrFiles = fs
    .readdirSync(LIGHTHOUSECI_DIR)
    .filter((f) => f.startsWith('lhr-') && f.endsWith('.json'));

  if (lhrFiles.length === 0) {
    console.error('No Lighthouse results found');
    process.exit(1);
  }

  const scores = {
    performance: [],
    accessibility: [],
    'best-practices': [],
    seo: [],
  };

  lhrFiles.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(LIGHTHOUSECI_DIR, file)));
    if (data.categories) {
      Object.entries(data.categories).forEach(([key, value]) => {
        if (scores[key]) {
          scores[key].push(value.score * 100);
        }
      });
    }
  });

  const averages = {};
  Object.entries(scores).forEach(([key, values]) => {
    averages[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  });

  return averages;
}

function getPublicLinks() {
  if (fs.existsSync(LINKS_FILE)) {
    return JSON.parse(fs.readFileSync(LINKS_FILE, 'utf-8'));
  }
  return null;
}

function updatePerformanceDoc(scores, links) {
  const content = fs.readFileSync(PERFORMANCE_DOC, 'utf-8');

  const publicLink = links ? links['http://localhost:4321/'] : null;

  // Create the badge and link section
  const badgeSection = publicLink
    ? `> **Latest CI Results:** [View Lighthouse Report](${publicLink}) | Last Updated: ${new Date().toISOString().split('T')[0]}\n\n`
    : `> **Latest CI Results:** Last Updated: ${new Date().toISOString().split('T')[0]}\n\n`;

  // Update the scores table
  const scoresTable = `| Metric         | Score | Details                      |
| -------------- | ----- | ---------------------------- |
| Performance    | ${scores.performance}   | Optimized assets, minimal JS |
| Accessibility  | ${scores.accessibility}   | WCAG AA compliant            |
| Best Practices | ${scores['best-practices']}   | Modern standards             |
| SEO            | ${scores.seo}   | Complete meta tags           |`;

  // Replace the lighthouse scores section
  let updatedContent = content;

  // Add/update badge section after "## Lighthouse Scores"
  const badgeRegex = /(## Lighthouse Scores\n\n)(> \*\*Latest CI Results:\*\*.*?\n\n)?/s;
  if (content.match(badgeRegex)) {
    updatedContent = content.replace(badgeRegex, `$1${badgeSection}`);
  }

  // Update the scores table
  const tableRegex = /\| Metric\s+\| Score\s+\| Details\s+\|[\s\S]*?\| SEO\s+\|\s+\d+\s+\|.*?\|/;
  updatedContent = updatedContent.replace(tableRegex, scoresTable);

  fs.writeFileSync(PERFORMANCE_DOC, updatedContent);
  console.log('✅ Updated performance.md with latest Lighthouse scores');
  console.log(
    `   Performance: ${scores.performance}, Accessibility: ${scores.accessibility}, Best Practices: ${scores['best-practices']}, SEO: ${scores.seo}`
  );
  if (publicLink) {
    console.log(`   Public report: ${publicLink}`);
  }
}

// Main execution
try {
  const scores = calculateAverageScores();
  const links = getPublicLinks();
  updatePerformanceDoc(scores, links);
} catch (error) {
  console.error('Error updating performance.md:', error.message);
  process.exit(1);
}
