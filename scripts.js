// Kallpa Web - scripts agrupados
(function () {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  };

  onReady(() => {
    // 1) Filtro de categorías del portafolio
    try {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const projects = document.querySelectorAll('.project');
      if (filterButtons.length && projects.length) {
        filterButtons.forEach((button) => {
          button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            projects.forEach((project) => {
              project.style.display =
                category === 'all' || project.dataset.category === category
                  ? 'block'
                  : 'none';
            });
          });
        });
      }
    } catch {}

    // 2) Partículas (hero y contacto) si la librería está disponible
    try {
      if (typeof window.particlesJS === 'function') {
        const heroEl = document.getElementById('particles-hero');
        if (heroEl) {
          particlesJS('particles-hero', {
            particles: {
              number: { value: 80 },
              color: { value: '#b266ff' },
              shape: { type: 'circle' },
              opacity: { value: 0.4 },
              size: { value: 3 },
              move: { enable: true, speed: 1.5 }
            },
            interactivity: {
              events: { onhover: { enable: true, mode: 'repulse' } },
              modes: { repulse: { distance: 100 } }
            },
            retina_detect: true
          });
        }
        const contactEl = document.getElementById('particles-contact');
        if (contactEl) {
          particlesJS('particles-contact', {
            particles: {
              number: { value: 60 },
              color: { value: '#b266ff' },
              shape: { type: 'circle' },
              opacity: { value: 0.3 },
              size: { value: 2.5 },
              move: { enable: true, speed: 1.2 }
            },
            interactivity: {
              events: { onhover: { enable: true, mode: 'repulse' } },
              modes: { repulse: { distance: 120 } }
            },
            retina_detect: true
          });
        }
      }
    } catch {}

    // 3) Efecto nav al hacer scroll
    try {
      const nav = document.querySelector('nav');
      if (nav) {
        const toggle = () => {
          if (window.scrollY > 50) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', toggle);
        toggle();
      }
    } catch {}

    // 4) Formspree - envío del formulario
    try {
      const form = document.querySelector('.contact-form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const action = form.getAttribute('action');
          if (!action) {
            alert('Configura tu endpoint de Formspree en el atributo action.');
            return;
          }
          try {
            const resp = await fetch(action, {
              method: 'POST',
              body: new FormData(form),
              headers: { Accept: 'application/json' }
            });
            if (resp.ok) {
              alert('¡Mensaje enviado! Te responderé pronto.');
              form.reset();
            } else {
              const data = await resp.json().catch(() => null);
              const detail = data && data.errors ? data.errors.map((e) => e.message).join(', ') : resp.statusText;
              alert('Hubo un error al enviar. ' + (detail ? 'Detalle: ' + detail : ''));
            }
          } catch (err) {
            console.error('Formspree error:', err);
            alert('Hubo un error de red al enviar. Intenta nuevamente.');
          }
        });
      }
    } catch {}

    // 5) Animaciones de entrada
    try {
      const elementos = document.querySelectorAll('.animado');
      if (elementos.length) {
        const mostrar = () => {
          const triggerBottom = window.innerHeight * 0.85;
          elementos.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) el.classList.add('visible');
          });
        };
        window.addEventListener('scroll', mostrar);
        window.addEventListener('load', mostrar);
        mostrar();
      }
    } catch {}

    // 6) Menú hamburguesa y scroll suave
    try {
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('active');
          hamburger.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
        });

        const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
        navAnchors.forEach((a) => {
          a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id && id.startsWith('#')) {
              e.preventDefault();
              if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
              }
              const target = document.querySelector(id);
              if (target) {
                const navHeight = 70;
                const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          });
        });
      }
    } catch {}
  });
})();

