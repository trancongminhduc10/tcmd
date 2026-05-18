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

const phrases = ['Nhà thiết kế UI/UX', 'Người tạo website', 'Designer poster', 'Tư duy sáng tạo'];
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
    alert('Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.');
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
  initLightbox();
  filterProjects('all');
  setActiveNav();
});

window.addEventListener('scroll', () => {
  setActiveNav();
});

themeToggle.addEventListener('click', toggleTheme);

function initLightbox() {
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxWrapper = document.querySelector('.lightbox-image-wrapper');

  document.querySelectorAll('.project-media').forEach((media) => {
    media.addEventListener('click', () => {
      const card = media.closest('.project-card');
      if (!card) return;
      const category = card.querySelector('.project-meta p')?.textContent || '';
      const title = card.querySelector('.project-meta h3')?.textContent || '';
      const desc = card.querySelector('.project-meta p:last-child')?.textContent || '';
      const img = media.querySelector('img');
      const computedStyle = window.getComputedStyle(media);
      const bgImage = computedStyle.backgroundImage;

      if (img && img.src) {
        lightboxImage.src = img.src;
        lightboxImage.alt = title;
        lightboxImage.style.display = 'block';
        lightboxWrapper.classList.remove('no-image');
        lightboxWrapper.style.backgroundImage = '';
      } else if (bgImage && bgImage !== 'none') {
        lightboxImage.style.display = 'none';
        lightboxWrapper.classList.add('no-image');
        lightboxWrapper.style.backgroundImage = bgImage;
      } else {
        lightboxImage.style.display = 'none';
        lightboxWrapper.classList.add('no-image');
        lightboxWrapper.style.backgroundImage = 'linear-gradient(135deg, rgba(47,125,255,0.35), rgba(111,148,255,0.12))';
      }

      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxDesc.textContent = desc;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxWrapper.style.backgroundImage = '';
    lightboxWrapper.classList.remove('no-image');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}
