/* ==========================================================================
   THE DECO HOUSE - INTERACTION & ANIMATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Synchronize ScrollTrigger with Lenis via GSAP ticker exclusively (no duplicate RAF loop)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Smooth Anchor Navigation with Lenis
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
        }
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
    }

    function openMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
        }
        if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: -60 });
                    closeMobileMenu();
                }
            }
        });
    });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('pointer-events-none');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // 4. GSAP Animations Setup
    if (typeof gsap !== 'undefined') {
        // Hero Timeline Setup
        const tl = gsap.timeline();
        
        gsap.set('.gs-title', { y: 50, opacity: 0 });
        gsap.set('.gs-subtitle', { y: 20, opacity: 0 });
        gsap.set('.gs-line', { width: 0 });
        gsap.set('.gs-hero-img', { scale: 1.3, opacity: 0 });
        gsap.set('.gs-bg-scale', { scaleY: 0 });
        gsap.set('.gs-reveal', { y: -20, opacity: 0 });

        // Hero Sequence
        tl.to('.gs-bg-scale', { scaleY: 1, duration: 1.2, ease: 'power4.inOut' })
          .to('.gs-reveal', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, '-=0.6')
          .to('.gs-hero-img', { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }, '-=0.8')
          .to('.gs-title', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=1')
          .to('.gs-subtitle', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
          .to('.gs-line', { width: 96, duration: 0.8, ease: 'power2.out' }, '-=0.4');

        // Fade up standard elements on scroll (once: true prevents constant repaint lag)
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('.gs-fade-up').forEach(element => {
                gsap.fromTo(element, 
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 88%',
                            once: true
                        }
                    }
                );
            });

            // Staggered Cards Animation
            gsap.utils.toArray('.gs-card').forEach((card) => {
                gsap.fromTo(card,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 92%',
                            once: true
                        }
                    }
                );
            });
        }

        // 5. Ensure Hero Video Autoplays & Interactive Sound Toggle
        const heroVideo = document.getElementById('hero-video') || document.querySelector('video.gs-hero-img');
        const heroSoundToggle = document.getElementById('hero-sound-toggle');
        const heroMutedIcon = document.getElementById('hero-sound-muted-icon');
        const heroActiveIcon = document.getElementById('hero-sound-active-icon');

        if (heroVideo) {
            heroVideo.muted = true;
            heroVideo.play().catch(() => {});
        }

        if (heroSoundToggle && heroVideo) {
            heroSoundToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                heroVideo.muted = !heroVideo.muted;
                if (heroVideo.muted) {
                    if (heroMutedIcon) heroMutedIcon.classList.remove('hidden');
                    if (heroActiveIcon) heroActiveIcon.classList.add('hidden');
                } else {
                    if (heroMutedIcon) heroMutedIcon.classList.add('hidden');
                    if (heroActiveIcon) heroActiveIcon.classList.remove('hidden');
                    heroVideo.play().catch(() => {});
                }
            });
        }

        // 6. Interactive CTA Typology Selector Pills
        const pills = document.querySelectorAll('.cta-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => {
                    p.classList.remove('bg-champagne', 'text-plum', 'font-medium', 'shadow-sm');
                    p.classList.add('bg-white/10', 'text-ivory/90', 'border', 'border-champagne/30');
                });
                pill.classList.remove('bg-white/10', 'text-ivory/90', 'border', 'border-champagne/30');
                pill.classList.add('bg-champagne', 'text-plum', 'font-medium', 'shadow-sm');
            });
        });

        // 7. Interactive Category Filter Tabs
        const catTabs = document.querySelectorAll('.category-pill');
        const cards = document.querySelectorAll('.collection-card');
        catTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                catTabs.forEach(t => {
                    t.classList.remove('bg-plum', 'text-ivory', 'font-medium', 'shadow-sm');
                    t.classList.add('bg-stone/40', 'text-charcoal/80', 'border', 'border-stone');
                });
                tab.classList.remove('bg-stone/40', 'text-charcoal/80', 'border', 'border-stone');
                tab.classList.add('bg-plum', 'text-ivory', 'font-medium', 'shadow-sm');

                const filter = tab.textContent.trim().toLowerCase();
                cards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter.includes('all') || filter.includes(cat)) {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0.45';
                        card.style.transform = 'scale(0.98)';
                    }
                });
            });
        });
    }

    // Direct Email Dispatch for Sample Request Form
    const ctaSampleForm = document.getElementById('cta-sample-form');
    const ctaSampleBtn = document.getElementById('cta-sample-btn');
    const ctaBtnText = document.getElementById('cta-btn-text');
    const ctaSuccessMsg = document.getElementById('cta-success-msg');

    if (ctaSampleForm) {
        ctaSampleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (ctaBtnText) ctaBtnText.textContent = 'Dispatching...';
            if (ctaSampleBtn) ctaSampleBtn.disabled = true;

            const formData = new FormData(ctaSampleForm);
            try {
                const res = await fetch('https://formsubmit.co/ajax/technomantraindia@gmail.com', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (ctaSuccessMsg) ctaSuccessMsg.classList.remove('hidden');
                ctaSampleForm.reset();
            } catch (err) {
                console.warn('Fallback direct submit:', err);
                ctaSampleForm.submit();
            } finally {
                if (ctaBtnText) ctaBtnText.textContent = 'Request Box';
                if (ctaSampleBtn) ctaSampleBtn.disabled = false;
            }
        });
    }

});
