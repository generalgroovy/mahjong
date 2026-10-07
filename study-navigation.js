(() => {
  'use strict';
  const reference = document.getElementById('reference');
  function reveal(hash, focus = false) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target || !(target === reference || reference.contains(target))) return;
    reference.open = true;
    // Existing deep links also reach material inside closed topic disclosures.
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    if (focus) {
      const heading = target === reference ? reference.querySelector('summary') : target.querySelector('h2, h3') || target;
      if (!heading.matches('summary, button, input, a')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start' });
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    reveal(link.hash, true);
  });
  window.addEventListener('hashchange', () => reveal(location.hash, true));
  reveal(location.hash, Boolean(location.hash));
  let wasOpen;
  window.addEventListener('beforeprint', () => { wasOpen = reference.open; reference.open = true; });
  window.addEventListener('afterprint', () => { if (wasOpen !== undefined) reference.open = wasOpen; });
})();
