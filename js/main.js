/* ==========================================================================
   THE DECO HOUSE - INTERACTION & ANIMATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Sync ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
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

        // Fade up standard elements on scroll
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('.gs-fade-up').forEach(element => {
                gsap.fromTo(element, 
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Staggered Cards Animation
            gsap.utils.toArray('.gs-card').forEach((card) => {
                gsap.fromTo(card,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }
    }
});

