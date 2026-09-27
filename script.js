/* ===========================================================
   SIMON SAFETY NETS — Interaction & Animation Script
   Uses: GSAP, ScrollTrigger, AOS, Swiper (loaded via CDN)
=========================================================== */

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hide'), 700);
  setTimeout(() => loader.remove(), 1600);
});

/* ---------- AOS init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      startEvent: 'DOMContentLoaded',
    });
    // Refresh AOS after images/fonts load to recalculate positions
    window.addEventListener('load', () => AOS.refreshHard());
    // Safety fallback — after 3.5s, force reveal any element that AOS missed
    setTimeout(() => {
      document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        el.classList.add('aos-animate');
      });
    }, 3500);
  }

  /* ---------- Swiper Hero ---------- */
//   if (window.Swiper) {
//     new Swiper('.hero-swiper', {
//       loop: true,
//       speed: 1400,
//       effect: 'fade',
//       fadeEffect: { crossFade: true },
//       autoplay: { delay: 5000, disableOnInteraction: false },
//       pagination: { el: '.hero-pagination', clickable: true },
//     });
//   }
/* ---------- Swiper Hero ---------- */
if (window.Swiper) {
  new Swiper('.hero-swiper', {
    loop: true,
    speed: 1400,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 3000, // 3 seconds
      disableOnInteraction: false
    },
    pagination: {
      el: '.hero-pagination',
      clickable: true
    },
  });
}

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    const fabTop = document.getElementById('fabTop');
    if (fabTop) fabTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }));
// navMenu.querySelectorAll('a').forEach(a => {

//     a.addEventListener('click', function(e){

//         // Don't close menu when Services is clicked
//         if(this.classList.contains("nav-link-drop") && window.innerWidth <= 768){
//             return;
//         }

//         hamburger.classList.remove("open");
//         navMenu.classList.remove("open");

//     });

// });
  /* ---------- Ripple pointer for buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const f = b.dataset.filter;
    items.forEach(it => {
      const match = (f === 'all' || it.dataset.cat === f);
      if (match) {
        it.classList.remove('hide');
        it.style.animation = 'none';
        // reflow
        void it.offsetWidth;
        it.style.animation = 'fadeInUp .6s ease-out both';
      } else {
        it.classList.add('hide');
      }
    });
  }));

  /* ---------- Accordion single-open ---------- */
  const details = document.querySelectorAll('.accordion .acc-item');
  details.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) details.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---------- Back to top ---------- */
  document.getElementById('fabTop').addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- Quote form → WhatsApp ---------- */
  const form = document.getElementById('quoteForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const phone = data.get('phone')?.trim();
    const service = data.get('service');
    const location = data.get('location')?.trim();
    const message = data.get('message')?.trim();

    if (!name || !phone || !service || !location) {
      alert('Please fill Name, Phone, Service and Location.');
      return;
    }

    const text = `*New Quote Request — Simon Safety Nets*%0A%0A`
      + `*Name:* ${encodeURIComponent(name)}%0A`
      + `*Phone:* ${encodeURIComponent(phone)}%0A`
      + `*Service:* ${encodeURIComponent(service)}%0A`
      + `*Location:* ${encodeURIComponent(location)}%0A`
      + `*Message:* ${encodeURIComponent(message || '—')}`;

    window.open(`https://wa.me/919701744317?text=${text}`, '_blank');
    form.reset();
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const dur = 1800;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        runCounter(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));

  /* ---------- GSAP scroll parallax ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Visual frames parallax
    gsap.utils.toArray('.visual-frame img').forEach(img => {
      gsap.to(img, {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Floating badge subtle motion
    gsap.to('.visual-badge', {
      y: -8, duration: 3, ease: 'sine.inOut',
      yoyo: true, repeat: -1
    });
  }
});

/* Small keyframe for filter fadeInUp used inline */
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(styleEl);





const serviceLink = document.querySelector(".nav-link-drop");
const dropdown = document.querySelector(".nav-item-dropdown");

serviceLink.addEventListener("click", function(e) {

    if (window.innerWidth <= 768) {
        e.preventDefault();   // Stop jumping to #services
        dropdown.classList.toggle("active");
    }

});

AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 40,
    startEvent: 'DOMContentLoaded'
});