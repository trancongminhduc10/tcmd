const pageLoader = document.getElementById('pageLoader');
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[data-section]');
const animatedText = document.getElementById('animatedText');
const filterButtons = document.querySelectorAll('.filter-button');
const projectsGrid = document.getElementById('projectsGrid');
const chartElements = document.querySelectorAll('.chart');
const contactForm = document.getElementById('contactForm');

const phrases = ['UI/UX Designer', 'Website Creator', 'Poster Artist', 'Creative Thinker'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function updateText() {
  const current = phrases[phraseIndex];
  let displayText = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);
  animatedText.textContent = displayText;

  if (!deleting && charIndex > current.length) {
    deleting = true;
    setTimeout(updateText, 1500);
    return;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(updateText, 500);
    return;
  }

  setTimeout(updateText, deleting ? 70 : 90);
}

function applyChartProgress() {
  chartElements.forEach((chart) => {
    const value = Number(chart.dataset.value || 0);
    chart.style.background = `conic-gradient(var(--accent) 0deg ${value * 3.6}deg, rgba(47,125,255,0.15) ${value * 3.6}deg 360deg)`;
    chart.innerHTML = `<span class="chart-center">${value}%</span>`;
  });
}

function setActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight / 3;
  let activeLink = null;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      activeLink = document.querySelector(`.nav-link[href='#${section.id}']`);
    }
  });

  navLinks.forEach((item) => {
    item.classList.toggle('active', item === activeLink);
  });
}

function setTheme(theme) {
  body.classList.toggle('theme-dark', theme === 'dark');
  body.classList.toggle('theme-light', theme !== 'dark');
  localStorage.setItem('portfolioTheme', theme);
}

function toggleTheme() {
  const current = body.classList.contains('theme-dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function filterProjects(filter) {
  const cards = projectsGrid.querySelectorAll('.project-card');
  cards.forEach((card) => {
    const category = card.dataset.category;
    card.style.display = filter === 'all' || category === filter ? 'grid' : 'none';
  });
}

function initFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProjects(button.dataset.filter);
    });
  });
}

function initNavSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      if (anchor.getAttribute('href') === '#') return;
      event.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initContactForm() {
  if (!contactForm) return;
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Cảm ơn bạn! Tin nhắn của bạn đã được gửi.');
    contactForm.reset();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    pageLoader.classList.add('hidden');
  }, 700);
  const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
  setTheme(savedTheme);
  updateText();
  applyChartProgress();
  initFilters();
  initNavSmooth();
  initContactForm();
  filterProjects('all');
  setActiveNav();
});

window.addEventListener('scroll', () => {
  setActiveNav();
});

themeToggle.addEventListener('click', toggleTheme);
