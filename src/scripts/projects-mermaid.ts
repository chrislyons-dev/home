let mermaidLoaded = false;

const loadMermaid = async () => {
  if (mermaidLoaded) return;
  mermaidLoaded = true;

  const { initMermaid, refreshMermaid } = await import('../utils/mermaid');
  await initMermaid();
  await refreshMermaid();

  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        refreshMermaid();
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
};

const initProjectMermaid = () => {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMermaid();
          obs.disconnect();
        }
      });
    },
    { rootMargin: '100px' }
  );

  const firstDiagram = document.querySelector('.mermaid');
  if (firstDiagram) {
    observer.observe(firstDiagram);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectMermaid, { once: true });
} else {
  initProjectMermaid();
}

export {};
