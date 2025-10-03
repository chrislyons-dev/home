import mermaid from 'mermaid';

/**
 * Initialize mermaid with configuration for light/dark themes
 */
export function initMermaid() {
  const isDark = document.documentElement.classList.contains('dark');

  mermaid.initialize({
    startOnLoad: true,
    theme: isDark ? 'dark' : 'default',
    themeVariables: {
      darkMode: isDark,
    },
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });
}

/**
 * Re-render all mermaid diagrams (useful after theme change)
 */
export async function refreshMermaid() {
  const isDark = document.documentElement.classList.contains('dark');

  // Update theme
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    themeVariables: {
      darkMode: isDark,
    },
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });

  // Find all mermaid code blocks (both formats)
  const mermaidCodeBlocks = document.querySelectorAll('pre code.language-mermaid');
  const mermaidPreBlocks = document.querySelectorAll('pre.mermaid');

  // Handle markdown code blocks: <pre><code class="language-mermaid">
  for (const block of mermaidCodeBlocks) {
    const pre = block.parentElement;
    if (!pre) continue;

    const code = block.textContent || '';

    // Replace the pre block with the rendered diagram
    const { svg } = await mermaid.render(`mermaid-${Date.now()}-${Math.random()}`, code);
    const container = document.createElement('div');
    container.className = 'mermaid-container';
    container.innerHTML = svg;

    pre.replaceWith(container);
  }

  // Handle direct pre.mermaid blocks: <pre class="mermaid">
  for (const pre of mermaidPreBlocks) {
    // Skip if already rendered
    if (pre.classList.contains('mermaid-rendered')) continue;

    const code = pre.textContent || '';

    // Replace the pre block with the rendered diagram
    const { svg } = await mermaid.render(`mermaid-${Date.now()}-${Math.random()}`, code);
    const container = document.createElement('div');
    container.className = 'mermaid-container';
    container.innerHTML = svg;

    pre.replaceWith(container);
  }
}
