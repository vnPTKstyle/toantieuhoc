(function () {
  if (!window.SUBJECT_ACCORDION) return;

  function openSubject(article, open) {
    const btn = article.querySelector('.subject-toggle');
    const body = article.querySelector('.subject-body');
    if (!btn || !body) return;
    body.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    article.classList.toggle('is-open', open);
  }

  document.querySelectorAll('.subject-accordion').forEach((article) => {
    const btn = article.querySelector('.subject-toggle');
    btn?.addEventListener('click', () => {
      const isOpen = article.classList.contains('is-open');
      document.querySelectorAll('.subject-accordion.is-open').forEach((other) => {
        if (other !== article) openSubject(other, false);
      });
      openSubject(article, !isOpen);
    });
  });

  const hash = window.location.hash.replace('#', '');
  const defaultId = window.DEFAULT_OPEN_SUBJECT;
  const openId = hash || defaultId;
  if (openId) {
    const target = document.getElementById(`subject-${openId}`);
    if (target) {
      openSubject(target, true);
      if (hash) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
})();
