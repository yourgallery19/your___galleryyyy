/**
 * YOUR__GALLERYYYYY | Simple Minimalist Auto-Scrolling Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
    const autoSliders = document.querySelectorAll('.auto-slider');

    autoSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const bars = slider.querySelectorAll('.bar');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        let timer = null;
        let isPaused = false;
        const intervalMs = parseInt(slider.getAttribute('data-interval')) || 3300;

        function updateSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            bars.forEach((bar, i) => {
                const fill = bar.querySelector('.fill');
                if (!fill) return;

                if (i < index) {
                    fill.style.transition = 'none';
                    fill.style.width = '100%';
                } else if (i === index) {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                    void fill.offsetWidth; // Trigger reflow
                    fill.style.transition = `width ${intervalMs}ms linear`;
                    if (!isPaused) fill.style.width = '100%';
                } else {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                }
            });

            currentIndex = index;
        }

        function nextSlide() {
            if (isPaused) return;
            const nextIdx = (currentIndex + 1) % slides.length;
            updateSlide(nextIdx);
        }

        function startTimer() {
            if (timer) clearInterval(timer);
            const activeFill = slider.querySelector('.bar:nth-child(' + (currentIndex + 1) + ') .fill');
            if (activeFill && !isPaused) {
                activeFill.style.transition = `width ${intervalMs}ms linear`;
                activeFill.style.width = '100%';
            }
            timer = setInterval(nextSlide, intervalMs);
        }

        slider.addEventListener('mouseenter', () => {
            isPaused = true;
            if (timer) clearInterval(timer);
            const activeFill = slider.querySelector('.bar:nth-child(' + (currentIndex + 1) + ') .fill');
            if (activeFill) {
                const currentWidth = window.getComputedStyle(activeFill).width;
                activeFill.style.transition = 'none';
                activeFill.style.width = currentWidth;
            }
        });

        slider.addEventListener('mouseleave', () => {
            isPaused = false;
            startTimer();
        });

        // Initialize first slide
        updateSlide(0);
        startTimer();
    });

    // Horizontal Carousel Navigation Arrows
    const scrollArrows = document.querySelectorAll('.scroll-arrow');
    scrollArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const targetSelector = arrow.getAttribute('data-target');
            const carousel = document.querySelector(targetSelector);
            if (!carousel) return;

            const card = carousel.querySelector('.simple-card');
            const scrollAmount = card ? card.offsetWidth + 24 : 340;

            if (arrow.classList.contains('scroll-left')) {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });

    // Automatic Horizontal Scrolling for Product Carousels
    const autoCarousels = document.querySelectorAll('.auto-horizontal-scroll');
    autoCarousels.forEach(carousel => {
        let isHovered = false;
        const intervalMs = parseInt(carousel.getAttribute('data-interval')) || 4500;

        carousel.addEventListener('mouseenter', () => isHovered = true);
        carousel.addEventListener('mouseleave', () => isHovered = false);

        setInterval(() => {
            if (isHovered) return;
            const card = carousel.querySelector('.simple-card');
            const step = card ? card.offsetWidth + 24 : 340;

            // Loop back to start if scrolled to the right end
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: step, behavior: 'smooth' });
            }
        }, intervalMs);
    });
});
