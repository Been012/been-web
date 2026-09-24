const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.hidden = false;

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
}
navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    navToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const cards = [...document.querySelectorAll('.project-card')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
document.querySelector('.project-toolbar').hidden = false;
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visibleCount = 0;
    cards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter || (filter === 'ai' && card.dataset.category === 'games');
      card.hidden = !matches;
      if (matches) visibleCount++;
    });
    document.getElementById('project-count').textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
