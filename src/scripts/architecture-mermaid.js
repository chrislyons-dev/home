/* global document, IntersectionObserver, MutationObserver, setTimeout */

let mermaidLoaded = false;

const loadAndInitMermaid = async () => {
  if (mermaidLoaded) return;
  mermaidLoaded = true;

  const { default: mermaid } = await import('mermaid');
  const isDark = document.documentElement.classList.contains('dark');

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    themeVariables: {
      darkMode: isDark,
    },
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });

  await mermaid.run({
    querySelector: 'pre.mermaid',
  });
};

const initArchitectureMermaid = () => {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadAndInitMermaid();
          obs.disconnect();
        }
      });
    },
    { rootMargin: '50px' }
  );

  const firstDiagram = document.querySelector('pre.mermaid');
  if (firstDiagram) {
    observer.observe(firstDiagram);
  }

  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && mermaidLoaded) {
        document.querySelectorAll('.mermaid-container').forEach((el) => {
          const pre = document.createElement('pre');
          pre.className =
            'mermaid p-4 rounded overflow-x-auto bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)]';
          pre.textContent = el.dataset.mermaidCode || '';
          el.replaceWith(pre);
        });
        setTimeout(loadAndInitMermaid, 100);
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArchitectureMermaid, { once: true });
} else {
  initArchitectureMermaid();
}
