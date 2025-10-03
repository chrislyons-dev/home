#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const docsDir = join(rootDir, 'docs', 'architecture', 'generated');

// Ensure generated docs directory exists
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
}

// Disable Jekyll for GitHub Pages
writeFileSync(join(docsDir, '.nojekyll'), '');

console.log('🏗️  Generating architecture documentation...\n');

// 1. Module Dependency Graph with circular dependency detection
console.log('📊 Generating module dependency graph...');
try {
  // Check for circular dependencies - madge returns paths if circular deps exist
  const circularCheck = execSync('npx madge --circular --extensions ts,tsx,astro,jsx,js --exclude "node_modules|.astro" --json src/', {
    cwd: rootDir,
    encoding: 'utf-8'
  });

  const circularDeps = JSON.parse(circularCheck);
  if (Object.keys(circularDeps).length > 0) {
    console.log('  ⚠️  Warning: Circular dependencies detected!');
    writeFileSync(join(docsDir, 'circular-dependencies.json'), JSON.stringify(circularDeps, null, 2));
  }

  // Generate Graphviz DOT file and Mermaid diagram
  try {
    const dotOutput = execSync('npx madge --extensions ts,tsx,astro,jsx,js --exclude "node_modules|.astro" --dot src/', {
      cwd: rootDir,
      encoding: 'utf-8'
    });
    writeFileSync(join(docsDir, 'dependencies.dot'), dotOutput);

    // Convert to Mermaid format
    const mermaidGraph = convertDotToMermaid(dotOutput);
    writeFileSync(join(docsDir, 'module-dependencies.mmd'), mermaidGraph);

    console.log('  ✓ Module dependency graph generated');
  } catch (dotError) {
    console.log('  ⚠️  Skipping DOT graph generation (graphviz may not be available)');
  }
} catch (error) {
  console.error('  ✗ Failed to generate dependency graph:', error.message);
}

// 2. Bundle Analysis (will be generated during build)
console.log('📦 Setting up bundle analysis...');
try {
  // Create a build config that includes the visualizer
  const visualizerConfig = `
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: './docs/architecture/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ]
};
`;
  writeFileSync(join(rootDir, 'rollup.config.js'), visualizerConfig);
  console.log('  ✓ Bundle analysis configured (run npm build to generate)');
} catch (error) {
  console.error('  ✗ Failed to setup bundle analysis:', error.message);
}

// 3. Routes Map
console.log('🗺️  Generating routes map...');
try {
  const routesOutput = execSync('find src/pages -type f \\( -name "*.astro" -o -name "*.md" \\) 2>/dev/null || true', {
    cwd: rootDir,
    encoding: 'utf-8',
    shell: true
  });

  const routes = routesOutput
    .split('\n')
    .filter(Boolean)
    .map(route => {
      const path = route
        .replace('src/pages/', '/')
        .replace('/index.astro', '/')
        .replace('.astro', '')
        .replace('.md', '');
      return { file: route, path };
    });

  const routesMermaid = generateRoutesMermaid(routes);
  writeFileSync(join(docsDir, 'routes-map.mmd'), routesMermaid);

  const routesJson = JSON.stringify(routes, null, 2);
  writeFileSync(join(docsDir, 'routes.json'), routesJson);

  console.log(`  ✓ Routes map generated (${routes.length} routes)`);
} catch (error) {
  console.error('  ✗ Failed to generate routes map:', error.message);
}

// 4. C4 System Diagrams
console.log('🏛️  Generating C4 system diagrams...');
try {
  const c4Diagram = generateC4SystemDiagram();
  writeFileSync(join(docsDir, 'c4-system-context.puml'), c4Diagram);

  const c4Container = generateC4ContainerDiagram();
  writeFileSync(join(docsDir, 'c4-container.puml'), c4Container);

  console.log('  ✓ C4 diagrams generated');
} catch (error) {
  console.error('  ✗ Failed to generate C4 diagrams:', error.message);
}

console.log('\n✨ Architecture documentation generated successfully!');
console.log(`📁 Output directory: ${docsDir}\n`);

// Helper functions

function convertDotToMermaid(dotOutput) {
  // Basic DOT to Mermaid conversion
  return `graph LR
  %% Module Dependencies
  %% Generated from madge analysis

  ${dotOutput
    .split('\n')
    .filter(line => line.includes('->'))
    .map(line => {
      const match = line.match(/"([^"]+)"\s*->\s*"([^"]+)"/);
      if (match) {
        const from = match[1].replace(/[\/\.\-]/g, '_');
        const to = match[2].replace(/[\/\.\-]/g, '_');
        return `  ${from}[${match[1]}] --> ${to}[${match[2]}]`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n')}
`;
}

function generateRoutesMermaid(routes) {
  return `graph TD
  %% Application Routes
  Root[/] --> Pages

  ${routes
    .map(route => {
      const id = route.path.replace(/[\/\-]/g, '_').replace(/^_/, 'route_');
      return `  Pages --> ${id}["${route.path}"]`;
    })
    .join('\n')}

  style Root fill:#2563EB,color:#fff
  style Pages fill:#7C3AED,color:#fff
`;
}

function generateC4SystemDiagram() {
  return `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context diagram for ChrisLyons.dev

Person(user, "Visitor", "A person visiting the portfolio website")

System(website, "ChrisLyons.dev", "Static portfolio website showcasing projects, architecture examples, and professional experience")

System_Ext(github, "GitHub Pages", "Hosts the static website")
System_Ext(analytics, "Analytics Service", "Tracks website usage")

Rel(user, website, "Views content", "HTTPS")
Rel(website, github, "Deployed to", "Git/HTTPS")
Rel(website, analytics, "Sends events", "HTTPS")

@enduml`;
}

function generateC4ContainerDiagram() {
  return `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Container diagram for ChrisLyons.dev

Person(user, "Visitor", "A person visiting the portfolio website")

System_Boundary(website, "ChrisLyons.dev") {
    Container(pages, "Astro Pages", "Astro", "Server-side rendered pages and static content")
    Container(components, "React Components", "React/TypeScript", "Interactive UI components")
    Container(diagrams, "Architecture Diagrams", "Mermaid/PlantUML", "Technical documentation and visualizations")
    Container(assets, "Static Assets", "CSS/Images", "Styling and media files")
}

System_Ext(github, "GitHub Pages", "Static hosting")
System_Ext(cdn, "CDN", "Content delivery network")

Rel(user, pages, "Requests pages", "HTTPS")
Rel(pages, components, "Renders", "JavaScript")
Rel(pages, diagrams, "Includes", "SVG/PNG")
Rel(pages, assets, "Uses", "")
Rel(pages, github, "Served from", "HTTPS")
Rel(github, cdn, "Cached by", "HTTPS")

@enduml`;
}
