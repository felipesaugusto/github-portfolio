document.addEventListener('DOMContentLoaded', () => {
  const viewedEl = document.getElementById('viewed');
  const barFill = document.querySelector('.counter__bar span');
  const cards = document.querySelectorAll('#projects .card');
  const total = cards.length;
  const clicked = new Set();

  const modal = document.getElementById('projectModal');
  const mTitle = modal?.querySelector('.modal__title');
  const mDesc  = modal?.querySelector('.modal__desc');
  const mOpenDeploy = modal?.querySelector('.btn--deploy');
  const mClose = modal?.querySelector('.modal__close');

  function openModalFromCard(card) {
    if (!modal) return;
    const t = card.dataset.title || card.querySelector('.card__title')?.textContent?.trim() || 'Projeto';
    const d = card.dataset.desc || '';
    const deploy = card.dataset.deploy || card.querySelector('.ribbon--deploy')?.getAttribute('href') || '#';
    if (mTitle) mTitle.textContent = t;
    if (mDesc)  mDesc.textContent  = d;
    if (mOpenDeploy) mOpenDeploy.href = deploy;

    const cardEl = modal.querySelector('.modal__card');
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const viewCenterX = window.innerWidth / 2;
    const viewCenterY = window.innerHeight / 2;
    const offsetX = cardCenterX - viewCenterX;
    const offsetY = cardCenterY - viewCenterY;

    cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.86)`;
    cardEl.style.opacity = '0';
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    void cardEl.offsetWidth;
    cardEl.style.transition = 'transform .45s cubic-bezier(.25,.8,.25,1), opacity .45s ease';
    cardEl.style.transform = 'translate(-50%, -50%) scale(1)';
    cardEl.style.opacity = '1';
  }

  function closeModal() {
    if (!modal) return;
    const cardEl = modal.querySelector('.modal__card');
    cardEl.style.transform = 'translate(-50%, -50%) scale(0.94)';
    cardEl.style.opacity = '0';
    setTimeout(() => {
      if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
      cardEl.style.transition = '';
      cardEl.style.transform = '';
      cardEl.style.opacity = '';
    }, 450);
  }

  mClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (!clicked.has(card)) {
        clicked.add(card);
        if (viewedEl) viewedEl.textContent = String(clicked.size);
        if (barFill) {
          const pct = total > 0 ? (clicked.size / total) * 100 : 0;
          barFill.style.width = Math.min(100, pct) + '%';
        }
      }
      openModalFromCard(card);
    }, { passive: true });
  });

  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');
  themeBtn?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  }, { passive: true });

  const onScroll = () => {};
  window.addEventListener('scroll', onScroll, { passive: true });
});
