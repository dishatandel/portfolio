/* =========================================================
   DISHA LAB — script.js
   Modular vanilla JS + Lenis smooth scrolling.
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* =========================================================
     LENIS — SMOOTH SCROLL
     ========================================================= */

  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false
    });
  }


  /* =========================================================
     TOAST HELPER
     ========================================================= */

  const toastEl = document.getElementById('toast');

  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;

    toastEl.textContent = msg;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }


  /* =========================================================
     NAV
     Scroll state + active link highlighting
     ========================================================= */

  const nav = document.getElementById('siteNav');

  const navLinks = Array.from(
    document.querySelectorAll('[data-nav]')
  );

  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute('href');

      if (!href || !href.startsWith('#')) {
        return null;
      }

      return document.querySelector(href);
    })
    .filter(Boolean);


  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  const scrollBar = document.getElementById('scrollBar');

  function updateScrollProgress() {
    const doc = document.documentElement;

    const max =
      doc.scrollHeight - doc.clientHeight;

    const pct =
      max > 0
        ? (window.scrollY / max) * 100
        : 0;

    if (scrollBar) {
      scrollBar.style.width = pct + '%';
    }
  }


  /* =========================================================
     NAV SCROLL STATE
     ========================================================= */

  function onScroll() {
    if (nav) {
      nav.classList.toggle(
        'scrolled',
        window.scrollY > 20
      );
    }

    updateScrollProgress();
  }


  /* =========================================================
     ACTIVE NAV LINK
     ========================================================= */

  function updateActiveNav() {
    let currentId = '';

    const scrollPos =
      window.scrollY +
      window.innerHeight * 0.3;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentId
      );
    });
  }


  /* =========================================================
     NATIVE SCROLL EVENT
     ========================================================= */

  window.addEventListener(
    'scroll',
    () => {
      onScroll();
      updateActiveNav();
    },
    {
      passive: true
    }
  );


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const burger =
    document.getElementById('burger');

  const mobileMenu =
    document.getElementById('mobileMenu');

  if (burger && mobileMenu) {

    burger.addEventListener('click', () => {

      const open =
        mobileMenu.classList.toggle('open');

      burger.setAttribute(
        'aria-expanded',
        String(open)
      );
    });


    mobileMenu
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener('click', () => {

          mobileMenu.classList.remove('open');

          burger.setAttribute(
            'aria-expanded',
            'false'
          );

        });

      });

  }


  /* =========================================================
     REVEAL ON SCROLL
     IntersectionObserver
     ========================================================= */

  const revealEls =
    document.querySelectorAll('.reveal');

  if (
    'IntersectionObserver' in window &&
    !prefersReducedMotion
  ) {

    const io =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'in-view'
              );

              io.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );


    revealEls.forEach((element) => {
      io.observe(element);
    });

  } else {

    revealEls.forEach((element) => {
      element.classList.add('in-view');
    });

  }


  /* =========================================================
     CURSOR GLOW
     Desktop / fine pointer only
     ========================================================= */

  const glow =
    document.querySelector('.cursor-glow');

  const finePointer =
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;


  if (finePointer && glow) {

    window.addEventListener(
      'mousemove',
      (event) => {

        glow.style.left =
          event.clientX + 'px';

        glow.style.top =
          event.clientY + 'px';

        glow.classList.add('active');

      }
    );


    document.addEventListener(
      'mouseleave',
      () => {
        glow.classList.remove('active');
      }
    );

  }


  /* =========================================================
     MAGNETIC BUTTONS
     ========================================================= */

  if (
    finePointer &&
    !prefersReducedMotion
  ) {

    document
      .querySelectorAll('.magnetic')
      .forEach((button) => {

        button.addEventListener(
          'mousemove',
          (event) => {

            const rect =
              button.getBoundingClientRect();

            const x =
              event.clientX -
              rect.left -
              rect.width / 2;

            const y =
              event.clientY -
              rect.top -
              rect.height / 2;

            button.style.transform =
              `translate(${x * 0.15}px, ${y * 0.3}px)`;

          }
        );


        button.addEventListener(
          'mouseleave',
          () => {
            button.style.transform = '';
          }
        );

      });

  }


  /* =========================================================
     STATUS TICKER ROTATION
     ========================================================= */

  const statuses = [
    'OPEN TO INTERNSHIPS',
    'OPEN TO COLLABORATIONS',
    'OPEN TO HACKATHONS',
    'OPEN TO INTERESTING IDEAS'
  ];

  let statusIdx = 0;

  const tickerText =
    document.getElementById('statusTicker');


  if (tickerText) {

    setInterval(() => {

      statusIdx =
        (statusIdx + 1) %
        statuses.length;

      tickerText.textContent =
        statuses[statusIdx];

    }, 3500);

  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  onScroll();
  updateActiveNav();

})();