/**
 * AUBERGE CÉLESTE — Luxury Hotel Landing Page
 * JavaScript — Interactions, Animations & Functional Logic
 * @version 1.0.0
 */
(function () {
  'use strict';

  /* ============================================================
     DOM REFERENCES
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const allSections = document.querySelectorAll('section[id]');
  const bookingForm = document.getElementById('booking-form');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const testimonialPrev = document.getElementById('testimonial-prev');
  const testimonialNext = document.getElementById('testimonial-next');
  const testimonialTrack = document.getElementById('testimonials-track');
  const testimonialDots = document.querySelectorAll('.testimonials__dot');
  const galleryFilters = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const heroParallax = document.querySelector('.hero__parallax');
  let lenis = null;

  /* ============================================================
     PREFERS REDUCED MOTION CHECK
     ============================================================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  /* ============================================================
     2. ACTIVE NAV LINK (SPY SCROLL)
     ============================================================ */
  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollY = window.scrollY + 100;

    allSections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('navbar__link--active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId) {
        link.classList.add('navbar__link--active');
      }
    });

    // Handle "Home" for hero section
    if (scrollY < 200) {
      navLinks.forEach(function (link) {
        link.classList.remove('navbar__link--active');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('navbar__link--active');
        }
      });
    }
  }

  /* ============================================================
     3. MOBILE NAVIGATION TOGGLE
     ============================================================ */
  let isMenuOpen = false;
  let overlayEl = null;

  function createOverlay() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'navbar__overlay';
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlayEl);

    overlayEl.addEventListener('click', closeMobileMenu);
  }

  function openMobileMenu() {
    isMenuOpen = true;
    navMenu.classList.add('navbar__nav--open');
    hamburgerBtn.classList.add('navbar__hamburger--active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    overlayEl.classList.add('navbar__overlay--active');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus the first nav link
    const firstLink = navMenu.querySelector('.navbar__link');
    if (firstLink) {
      setTimeout(function () { firstLink.focus(); }, 100);
    }
  }

  function closeMobileMenu() {
    isMenuOpen = false;
    navMenu.classList.remove('navbar__nav--open');
    hamburgerBtn.classList.remove('navbar__hamburger--active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    overlayEl.classList.remove('navbar__overlay--active');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburgerBtn.focus();
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isMenuOpen) {
        closeMobileMenu();
      }
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Trap focus inside mobile menu
  navMenu.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && isMenuOpen) {
      const focusable = navMenu.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ============================================================
     4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ============================================================ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     5. PARALLAX HERO EFFECT
     ============================================================ */
  function initParallax() {
    if (!heroParallax || prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrollY <= heroHeight) {
        const offset = scrollY * 0.35;
        heroParallax.style.transform = 'translateY(' + offset + 'px)';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     6. TESTIMONIALS CAROUSEL
     ============================================================ */
  let currentTestimonial = 0;
  let testimonialCount = 0;

  function initTestimonials() {
    if (!testimonialTrack) return;

    const cards = testimonialTrack.querySelectorAll('.testimonial-card');
    testimonialCount = cards.length;

    if (testimonialCount <= 1) return;

    function goToTestimonial(index, animate) {
      if (animate === undefined) animate = true;

      // Wrap around
      if (index < 0) index = testimonialCount - 1;
      if (index >= testimonialCount) index = 0;

      currentTestimonial = index;

      if (!prefersReducedMotion && animate) {
        testimonialTrack.style.transition =
          'transform var(--duration-slow) var(--ease-out-expo)';
      } else {
        testimonialTrack.style.transition = 'none';
      }

      testimonialTrack.style.transform =
        'translateX(-' + (currentTestimonial * 100) + '%)';

      // Update dots
      testimonialDots.forEach(function (dot, i) {
        dot.classList.toggle('testimonials__dot--active', i === currentTestimonial);
        dot.setAttribute('aria-current', i === currentTestimonial ? 'true' : 'false');
      });

      // Update accessibility
      cards.forEach(function (card, i) {
        card.setAttribute('aria-hidden', i !== currentTestimonial ? 'true' : 'false');
      });
    }

    // Arrow buttons
    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', function () {
        goToTestimonial(currentTestimonial - 1, true);
      });
    }

    if (testimonialNext) {
      testimonialNext.addEventListener('click', function () {
        goToTestimonial(currentTestimonial + 1, true);
      });
    }

    // Dot navigation
    testimonialDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'), 10);
        goToTestimonial(index, true);
      });
    });

    // Keyboard navigation
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
          goToTestimonial(currentTestimonial - 1, true);
        } else if (e.key === 'ArrowRight') {
          goToTestimonial(currentTestimonial + 1, true);
        }
      });
    }

    // Auto-rotate (pause on hover/focus)
    let autoRotateTimer;

    function startAutoRotate() {
      autoRotateTimer = setInterval(function () {
        goToTestimonial(currentTestimonial + 1, true);
      }, 6000);
    }

    function stopAutoRotate() {
      clearInterval(autoRotateTimer);
    }

    startAutoRotate();

    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoRotate);
      carousel.addEventListener('mouseleave', startAutoRotate);
      carousel.addEventListener('focusin', stopAutoRotate);
      carousel.addEventListener('focusout', function () {
        // Restart only if focus left carousel entirely
        if (!carousel.contains(document.activeElement)) {
          startAutoRotate();
        }
      });
    }

    // Initialize first slide
    goToTestimonial(0, false);
  }

  /* ============================================================
     7. GALLERY FILTER
     ============================================================ */
  function initGalleryFilter() {
    if (galleryFilters.length === 0 || galleryItems.length === 0) return;

    galleryFilters.forEach(function (filterBtn) {
      filterBtn.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');

        // Update active filter button
        galleryFilters.forEach(function (btn) {
          btn.classList.remove('gallery__filter--active');
        });
        this.classList.add('gallery__filter--active');

        // Filter items
        galleryItems.forEach(function (item) {
          const category = item.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('gallery__item--hidden');
            item.setAttribute('tabindex', '0');
          } else {
            item.classList.add('gallery__item--hidden');
            item.setAttribute('tabindex', '-1');
          }
        });
      });
    });
  }

  /* ============================================================
     8. BOOKING FORM — DATE DEFAULTS & VALIDATION
     ============================================================ */
  function initBookingForm() {
    if (!checkinInput || !checkoutInput) return;

    // Set default check-in to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    checkinInput.setAttribute('min', tomorrowStr);
    checkinInput.value = tomorrowStr;

    // Set default checkout to day after check-in
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    checkoutInput.setAttribute('min', dayAfterStr);
    checkoutInput.value = dayAfterStr;

    // When check-in changes, update checkout min
    checkinInput.addEventListener('change', function () {
      const newCheckin = new Date(this.value);
      const newMinCheckout = new Date(newCheckin);
      newMinCheckout.setDate(newMinCheckout.getDate() + 1);
      const newMinStr = newMinCheckout.toISOString().split('T')[0];
      checkoutInput.setAttribute('min', newMinStr);

      // If current checkout is before new min, update it
      if (checkoutInput.value < newMinStr) {
        checkoutInput.value = newMinStr;
      }
    });

    // Form submit
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleBookingSubmit();
      });
    }
  }

  function handleBookingSubmit() {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('room-type').value;
    const promo = document.getElementById('promo').value;

    // Basic validation
    if (!checkin || !checkout) {
      showFormFeedback(bookingForm, 'Please select both check-in and check-out dates.', 'error');
      return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
      showFormFeedback(bookingForm, 'Check-out date must be after check-in date.', 'error');
      return;
    }

    // Simulate search
    const submitBtn = bookingForm.querySelector('.booking__submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Searching...';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFormFeedback(
        bookingForm,
        'Availability checked! Redirecting to reservation page...',
        'success'
      );

      // In production, this would redirect to a results page
      console.log('Booking search:', {
        checkin: checkin,
        checkout: checkout,
        guests: guests,
        roomType: roomType,
        promo: promo,
      });
    }, 1200);
  }

  /* ============================================================
     9. CONTACT FORM
     ============================================================ */
  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleContactSubmit();
    });
  }

  function handleContactSubmit() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showFormFeedback(contactForm, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback(contactForm, 'Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('.contact__form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFormFeedback(
        contactForm,
        'Thank you for your inquiry! We will respond within 2 hours.',
        'success'
      );
      contactForm.reset();

      // In production, this would POST to an API endpoint
      console.log('Contact inquiry:', { name: name, email: email, phone: phone, subject: subject, message: message });
    }, 1500);
  }

  /* ============================================================
     10. NEWSLETTER FORM
     ============================================================ */
  function initNewsletterForm() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value.trim();

      if (!email || !isValidEmail(email)) {
        showFormFeedback(newsletterForm, 'Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = newsletterForm.querySelector('.newsletter__submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showFormFeedback(
          newsletterForm,
          'Welcome aboard! You are now subscribed to exclusive offers.',
          'success'
        );
        newsletterForm.reset();

        // In production, this would POST to an API endpoint
        console.log('Newsletter subscription:', email);
      }, 1000);
    });
  }

  /* ============================================================
     UTILITY: Form Feedback
     ============================================================ */
  function showFormFeedback(form, message, type) {
    // Remove existing feedback
    const existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = 'form-feedback form-feedback--' + type;
    feedback.textContent = message;
    feedback.setAttribute('role', type === 'error' ? 'alert' : 'status');
    feedback.setAttribute('aria-live', 'polite');

    // Insert after submit button or at end of form
    const submitBtn =
      form.querySelector('button[type="submit"]') || form.lastElementChild;

    if (submitBtn && submitBtn.parentNode === form) {
      submitBtn.insertAdjacentElement('afterend', feedback);
    } else {
      form.appendChild(feedback);
    }

    // Auto-remove after 6 seconds for success messages
    if (type === 'success') {
      setTimeout(function () {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.3s ease';
        setTimeout(function () {
          if (feedback.parentNode) feedback.remove();
        }, 300);
      }, 6000);
    }

    // For errors, remove after 8 seconds
    if (type === 'error') {
      setTimeout(function () {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.3s ease';
        setTimeout(function () {
          if (feedback.parentNode) feedback.remove();
        }, 300);
      }, 8000);
    }

    // Scroll feedback into view
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ============================================================
     UTILITY: Email Validation
     ============================================================ */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     11. GLOBAL EVENT LISTENERS
     ============================================================ */
  function bindGlobalEvents() {
    // Scroll handler (throttled with rAF)
    let scrollTicking = false;

    window.addEventListener(
      'scroll',
      function () {
        if (!scrollTicking) {
          window.requestAnimationFrame(function () {
            handleNavbarScroll();
            updateActiveNavLink();
            scrollTicking = false;
          });
          scrollTicking = true;
        }
      },
      { passive: true }
    );

    // Hamburger click
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for all anchor links (not handled by CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navbarHeight = navbar.offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          if (lenis && !prefersReducedMotion) {
            lenis.scrollTo(target, {
              offset: -navbarHeight,
              duration: 1.2
            });
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
          }
        }
      });
    });
  }

  /* ============================================================
     13. LENIS SMOOTH SCROLLING
     ============================================================ */
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  /* ============================================================
     12. ADD FORM FEEDBACK DYNAMIC STYLES
     ============================================================ */
  function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .form-feedback {
        margin-top: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.5;
      }
      .form-feedback--success {
        background: rgba(47, 79, 79, 0.08);
        color: var(--color-forest-green);
        border: 1px solid rgba(47, 79, 79, 0.2);
      }
      .form-feedback--error {
        background: rgba(192, 57, 43, 0.06);
        color: var(--color-error);
        border: 1px solid rgba(192, 57, 43, 0.2);
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  function init() {
    createOverlay();
    initSmoothScroll();
    handleNavbarScroll();
    updateActiveNavLink();
    initScrollReveal();
    initParallax();
    initTestimonials();
    initGalleryFilter();
    initBookingForm();
    initContactForm();
    initNewsletterForm();
    bindGlobalEvents();
    injectDynamicStyles();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();