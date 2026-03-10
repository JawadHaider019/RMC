// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements - optimize with single object
    const DOM = {
        navbar: document.getElementById('navbar'),
        navContainer: document.getElementById('navContainer'),
        menuToggle: document.getElementById('menuToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        heroImage: document.getElementById('heroImage'),
        heroSection: document.getElementById('heroSection'),
        searchToggle: document.getElementById('searchToggle'),
        searchContainer: document.getElementById('searchContainer'),
        searchInput: document.getElementById('searchInput'),
        searchSubmit: document.getElementById('searchSubmit'),
        sliderContainer: document.getElementById('sliderContainer'),
        sliderWrapper: document.getElementById('sliderWrapper'),
        sliderTrack: document.getElementById('sliderTrack'),
        navLinks: document.querySelectorAll('nav a[href]')
    };

    // Performance optimizations - use requestAnimationFrame for smooth animations
    const raf = window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                (cb => setTimeout(cb, 16));
    
    const caf = window.cancelAnimationFrame || 
                window.webkitCancelAnimationFrame || 
                clearTimeout;

    // Debounce function for performance
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function for scroll events
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ===== MOBILE MENU TOGGLE =====
    if (DOM.menuToggle && DOM.mobileMenu) {
        const toggleMenu = (show) => {
            const isHidden = show !== undefined ? !show : DOM.mobileMenu.classList.contains('hidden');
            
            DOM.mobileMenu.classList.toggle('hidden', !isHidden);
            DOM.menuToggle.setAttribute('aria-expanded', isHidden);
            
            const icon = DOM.menuToggle.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
            }
            
            // Animate menu items when opening
            if (isHidden) {
                const menuItems = DOM.mobileMenu.querySelectorAll('a');
                menuItems.forEach((item, index) => {
                    item.style.animation = 'none';
                    item.offsetHeight; // Trigger reflow
                    item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
                });
            }
        };

        DOM.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!DOM.mobileMenu.contains(e.target) && !DOM.menuToggle.contains(e.target)) {
                if (!DOM.mobileMenu.classList.contains('hidden')) {
                    toggleMenu(false);
                }
            }
        });

        // Close on link click
        DOM.mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu(false);
            }
        });
    }

    // ===== NAVBAR SCROLL EFFECT WITH RAF =====
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        
        if (DOM.navbar) {
            if (currentScrollY > 50) {
                DOM.navbar.classList.add('scrolled', 'bg-white/95', 'backdrop-blur-md', 'shadow-lg');
                DOM.navbar.classList.remove('bg-transparent');
            } else {
                DOM.navbar.classList.remove('scrolled', 'bg-white/95', 'backdrop-blur-md', 'shadow-lg');
                DOM.navbar.classList.add('bg-transparent');
            }
        }
        
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            raf(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // ===== ACTIVE LINK HIGHLIGHTING =====
    const setActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        const isActiveLink = (href) => {
            const linkPage = href.split('/').pop();
            return linkPage === '' || linkPage === '/' || linkPage === 'index.html' 
                ? currentPath === 'index.html' || currentPath === '' || currentPath === '/'
                : linkPage === currentPath;
        };

        // Process all navigation links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing classes
            link.classList.remove('active', 'text-green-600', 'font-semibold', 'bg-green-50', 
                                 'border-l-4', 'border-green-600');
            
            // Remove indicator
            const indicator = link.querySelector('.active-indicator');
            if (indicator) indicator.remove();

            if (isActiveLink(href)) {
                link.classList.add('active');
                
                if (link.classList.contains('nav-link')) {
                    link.classList.add('text-green-400', 'font-semibold');
                    // Add indicator
                    const span = document.createElement('span');
                    span.className = 'absolute bottom-0 left-0 w-full h-0.5 bg-green-400 active-indicator';
                    link.appendChild(span);
                } else {
                    link.classList.add('text-green-600', 'font-semibold', 'bg-green-50', 
                                      'border-l-4', 'border-green-600');
                    link.style.paddingLeft = '1.5rem';
                }
            }
        });
    };

    setActiveNavLink();

    // ===== SEARCH BAR FUNCTIONALITY =====
    if (DOM.searchToggle && DOM.searchContainer) {
        let isSearchOpen = false;

        const toggleSearch = (show) => {
            isSearchOpen = show !== undefined ? show : !isSearchOpen;
            
            if (isSearchOpen) {
                DOM.searchContainer.classList.remove('hidden');
                // Trigger reflow for animation
                void DOM.searchContainer.offsetWidth;
                DOM.searchContainer.classList.add('show');
                setTimeout(() => DOM.searchInput?.focus(), 300);
            } else {
                DOM.searchContainer.classList.remove('show');
                setTimeout(() => DOM.searchContainer.classList.add('hidden'), 500);
            }
        };

        const performSearch = (query) => {
            if (!query.trim()) return;
            
            console.log('Searching for:', query);
            // Implement your search logic here
            alert(`Searching for: ${query}`);
            toggleSearch(false);
        };

        DOM.searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearch();
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (isSearchOpen && 
                !DOM.searchContainer.contains(e.target) && 
                !DOM.searchToggle.contains(e.target)) {
                toggleSearch(false);
            }
        });

        // Search handlers
        if (DOM.searchSubmit) {
            DOM.searchSubmit.addEventListener('click', () => {
                performSearch(DOM.searchInput?.value || '');
            });
        }

        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch(DOM.searchInput.value);
            });
        }

        // Quick search buttons
        document.querySelectorAll('.quick-search').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.textContent;
                if (DOM.searchInput) DOM.searchInput.value = query;
                performSearch(query);
            });
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isSearchOpen) toggleSearch(false);
        });
    }

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active', 'animated');
                    
                    // Animate counters if present
                    if (entry.target.querySelector('.counter-value')) {
                        animateCounters(entry.target);
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    // Counter animation
    const animateCounters = (container) => {
        const counters = container.querySelectorAll('.counter-value:not(.animated)');
        
        counters.forEach(counter => {
            counter.classList.add('animated');
            const target = parseInt(counter.getAttribute('data-target') || '0');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    raf(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    };

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== HERO SLIDER WITH OPTIMIZED ANIMATIONS =====
// ===== ENHANCED HERO SLIDER WITH SMOOTH ANIMATIONS =====
const initHeroSlider = () => {
    const slides = document.querySelectorAll('.slide');
    const contents = document.querySelectorAll('.slide-content');
    const dots = document.querySelectorAll('.slider-dot');
    const progressBar = document.querySelector('.progress-bar');
    
    if (!slides.length) return;

    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;
    let isPaused = false;
    let progressInterval;
    let progress = 0;

    // Reset animations for a slide
    const resetAnimations = (slideIndex) => {
        const content = contents[slideIndex];
        const animatedElements = content.querySelectorAll('[class*="animate-"]');
        
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
    };

    // Animate slide content with staggered delays
    const animateContent = (slideIndex) => {
        const content = contents[slideIndex];
        const elements = content.querySelectorAll('.inline-flex, h1, p, button');
        
        elements.forEach((el, index) => {
            const delay = index * 0.2;
            el.style.animation = `slideInUp 0.8s ease forwards ${delay}s`;
        });
    };

    // Update progress bar
    const updateProgress = () => {
        if (progressBar && !isPaused) {
            progress += 1;
            if (progress > 100) progress = 0;
            progressBar.style.width = `${progress}%`;
        }
    };

    // Go to specific slide
    const goToSlide = (index) => {
        if (index === currentSlide) return;
        
        // Remove active classes from current slide
        slides[currentSlide]?.classList.remove('active');
        contents[currentSlide]?.classList.add('hidden');
        
        // Reset animations for new slide
        resetAnimations(index);
        
        currentSlide = index;
        
        // Add active classes to new slide
        slides[currentSlide]?.classList.add('active');
        contents[currentSlide]?.classList.remove('hidden');
        
        // Animate new content
        animateContent(currentSlide);
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'bg-white');
            dot.classList.add('bg-white/50');
            if (i === currentSlide) {
                dot.classList.add('active', 'bg-green-500');
                dot.classList.remove('bg-white/50');
            }
        });
        
        // Reset progress
        progress = 0;
        if (progressBar) progressBar.style.width = '0%';
    };

    // Next slide
    const nextSlide = () => {
        if (!isPaused) {
            const next = (currentSlide + 1) % slideCount;
            goToSlide(next);
        }
    };

    // Previous slide
    const prevSlide = () => {
        if (!isPaused) {
            const prev = (currentSlide - 1 + slideCount) % slideCount;
            goToSlide(prev);
        }
    };

    // Start auto-slide
    const startAutoSlide = () => {
        if (slideInterval) clearInterval(slideInterval);
        if (progressInterval) clearInterval(progressInterval);
        
        slideInterval = setInterval(nextSlide, 5000);
        progressInterval = setInterval(updateProgress, 50); // Update progress every 50ms
    };

    // Stop auto-slide
    const stopAutoSlide = () => {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    };

    // Pause on hover
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoSlide();
        });

        heroSection.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoSlide();
        });
    }

    // Dot click handlers
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            isPaused = true;
            stopAutoSlide();
            setTimeout(() => {
                isPaused = false;
                startAutoSlide();
            }, 3000); // Resume after 5 seconds
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe right
        }
    };

    // Animate first slide on load
    setTimeout(() => {
        animateContent(0);
    }, 100);

    startAutoSlide();
};

// Initialize hero slider
initHeroSlider();
// ===== DRAGGABLE SLIDER WITH CLICKABLE LINKS =====



const initInfiniteSlider = () => {
    if (!DOM.sliderContainer || !DOM.sliderWrapper || !DOM.sliderTrack) return;

    let isDragging = false;
    let startX = 0;
    let startTransform = 0;
    let currentTransform = 0;
    let dragDistance = 0;
    let clickedLink = null;
    let animationFrame = null;
    let autoSlideInterval = null;
    
    // Clone items for infinite loop
    const sliderTrack = DOM.sliderTrack;
    const originalItems = Array.from(document.querySelectorAll('.slider-item'));
    
    // Double the items for seamless loop
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        sliderTrack.appendChild(clone);
    });

    // Calculate dimensions
    const getTrackWidth = () => {
        return sliderTrack.scrollWidth / 2; // Half because we doubled
    };

    const getContainerWidth = () => {
        return DOM.sliderContainer.offsetWidth;
    };

    const getMaxTransform = () => {
        return Math.max(0, getTrackWidth() - getContainerWidth());
    };

    const getTransformX = () => {
        const style = window.getComputedStyle(sliderTrack);
        const transform = style.transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (matrix) {
            const values = matrix[1].split(', ');
            return parseFloat(values[4]) || 0;
        }
        return 0;
    };

    const setTransformX = (x, animate = false) => {
        const maxTransform = getMaxTransform();
        
        // Infinite loop logic - smooth reset when reaching the end
        if (x <= -maxTransform) {
            // Seamless jump back to start
            x = 0;
            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(${x}px)`;
            currentTransform = x;
            // Force reflow
            sliderTrack.offsetHeight;
        } else {
            sliderTrack.style.transform = `translateX(${x}px)`;
            currentTransform = x;
        }
        
        if (!animate) {
            sliderTrack.style.transition = 'none';
        } else {
            sliderTrack.style.transition = 'transform 0.3s ease';
        }
    };

    // Auto slide function
    const startAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        
        autoSlideInterval = setInterval(() => {
            if (!isDragging && !DOM.sliderContainer.matches(':hover')) {
                const step = 1; // Pixels per interval
                const newTransform = currentTransform - step;
                setTransformX(newTransform);
            }
        }, 20); // Smooth 50fps animation
    };

    // Stop auto slide
    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    // Create navigation buttons
    const createNavButtons = () => {
        // Left button
        const leftBtn = document.createElement('button');
        leftBtn.className = 'absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl opacity-0 group-hover:opacity-100 focus:outline-none';
        leftBtn.setAttribute('aria-label', 'Previous slide');
        leftBtn.innerHTML = '<i class="fas fa-chevron-left text-lg"></i>';
        
        // Right button
        const rightBtn = document.createElement('button');
        rightBtn.className = 'absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl opacity-0 group-hover:opacity-100 focus:outline-none';
        rightBtn.setAttribute('aria-label', 'Next slide');
        rightBtn.innerHTML = '<i class="fas fa-chevron-right text-lg"></i>';
        
        // Add group class to container for hover effects
        DOM.sliderContainer.classList.add('group');
        
        // Add buttons to container
        DOM.sliderContainer.appendChild(leftBtn);
        DOM.sliderContainer.appendChild(rightBtn);
        
        // Button click handlers
        leftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop auto slide temporarily
            stopAutoSlide();
            
            // Calculate step (move by 4 items or container width)
            const itemWidth = originalItems[0]?.offsetWidth || 150;
            const gap = parseInt(window.getComputedStyle(sliderTrack).gap) || 16;
            const step = (itemWidth + gap) * 3; // Move by 3 items
            
            // Move right (positive because transform is negative)
            const newTransform = Math.min(0, currentTransform + step);
            setTransformX(newTransform, true);
            
            // Resume auto slide after 3 seconds
            setTimeout(() => {
                if (!isDragging && !DOM.sliderContainer.matches(':hover')) {
                    startAutoSlide();
                }
            }, 3000);
        });
        
        rightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop auto slide temporarily
            stopAutoSlide();
            
            // Calculate step
            const itemWidth = originalItems[0]?.offsetWidth || 150;
            const gap = parseInt(window.getComputedStyle(sliderTrack).gap) || 16;
            const step = (itemWidth + gap) * 3; // Move by 3 items
            
            // Move left
            const newTransform = currentTransform - step;
            setTransformX(newTransform, true);
            
            // Resume auto slide after 3 seconds
            setTimeout(() => {
                if (!isDragging && !DOM.sliderContainer.matches(':hover')) {
                    startAutoSlide();
                }
            }, 3000);
        });
        
        return { leftBtn, rightBtn };
    };

    // Create buttons
    const { leftBtn, rightBtn } = createNavButtons();

    // Mouse down - start dragging
    DOM.sliderWrapper.addEventListener('mousedown', (e) => {
        // Only left click and not on buttons
        if (e.button !== 0 || e.target.closest('button')) return;
        
        console.log('Drag started');
        
        isDragging = true;
        startX = e.pageX;
        startTransform = getTransformX();
        dragDistance = 0;
        clickedLink = e.target.closest('a');
        
        // Pause auto slide while dragging
        stopAutoSlide();
        
        DOM.sliderContainer.classList.add('dragging');
        DOM.sliderContainer.style.cursor = 'grabbing';
        sliderTrack.style.transition = 'none';
        
        e.preventDefault();
    });

    // Mouse move - handle dragging
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const currentX = e.pageX;
        const deltaX = currentX - startX;
        dragDistance = Math.abs(deltaX);
        
        setTransformX(startTransform + deltaX);
    });

    // Mouse up - handle end of drag
    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        console.log('Drag ended', dragDistance);
        
        isDragging = false;
        DOM.sliderContainer.classList.remove('dragging');
        DOM.sliderContainer.style.cursor = 'grab';
        
        // If this was a click (not a drag) and we have a clicked link
        if (dragDistance < 5 && clickedLink && clickedLink.href) {
            console.log('Navigating to:', clickedLink.href);
            window.location.href = clickedLink.href;
        }
        
        // Resume auto slide
        startAutoSlide();
        
        clickedLink = null;
    });

    // Mouse leave - cancel drag
    DOM.sliderWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            DOM.sliderContainer.classList.remove('dragging');
            DOM.sliderContainer.style.cursor = 'grab';
            startAutoSlide(); // Resume auto slide
            clickedLink = null;
        }
    });

    // Hover events - pause auto slide on hover and show buttons
    DOM.sliderContainer.addEventListener('mouseenter', () => {
        DOM.sliderContainer.style.cursor = 'grab';
        stopAutoSlide(); // Pause when hovering
        
        // Show buttons with animation
        leftBtn.style.opacity = '1';
        rightBtn.style.opacity = '1';
    });

    DOM.sliderContainer.addEventListener('mouseleave', () => {
        DOM.sliderContainer.style.cursor = 'default';
        
        // Hide buttons
        leftBtn.style.opacity = '1';
        rightBtn.style.opacity = '1';
        
        if (!isDragging) {
            startAutoSlide(); // Resume when not hovering
        }
    });

    // Touch events for mobile
    DOM.sliderWrapper.addEventListener('touchstart', (e) => {
        // Don't start drag if touching buttons
        if (e.target.closest('button')) return;
        
        isDragging = true;
        startX = e.touches[0].pageX;
        startTransform = getTransformX();
        dragDistance = 0;
        
        // Pause auto slide
        stopAutoSlide();
        
        // Check what was touched
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        clickedLink = element?.closest('a');
        
        DOM.sliderContainer.classList.add('dragging');
        sliderTrack.style.transition = 'none';
        
        e.preventDefault();
    }, { passive: false });

    DOM.sliderWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentX = e.touches[0].pageX;
        const deltaX = currentX - startX;
        dragDistance = Math.abs(deltaX);
        
        setTransformX(startTransform + deltaX);
    }, { passive: false });

    DOM.sliderWrapper.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        DOM.sliderContainer.classList.remove('dragging');
        
        // If this was a tap (not a drag) and we have a clicked link
        if (dragDistance < 5 && clickedLink) {
            e.preventDefault();
            window.location.href = clickedLink.href;
        }
        
        // Resume auto slide
        startAutoSlide();
        
        clickedLink = null;
    });

    // Prevent default drag on images
    document.querySelectorAll('.slider-item img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Start auto slide
    startAutoSlide();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    });

    console.log('Infinite slider initialized with auto slide and navigation buttons');
};
    // ===== GSAP ANIMATIONS (if available) =====
    const initGSAP = () => {
        if (typeof gsap === 'undefined') return;

        // Hero section animations
        const heroBadge = document.querySelector('#heroSection .inline-flex');
        const heroTitle = document.querySelector('#heroSection h1');
        const heroDesc = document.querySelector('#heroSection p');
        const heroBtn = document.querySelector('#heroSection button');

        if (heroBadge && heroTitle && heroDesc && heroBtn) {
            const tl = gsap.timeline();
            
            tl.from(heroBadge, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from(heroTitle, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.4')
            .from(heroDesc, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from(heroBtn, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');
        }

        // Scroll-triggered animations
        gsap.utils.toArray('.value-icon').forEach((icon, i) => {
            gsap.from(icon, {
                scrollTrigger: {
                    trigger: icon,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 360,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'back.out(1.7)'
            });
        });

        gsap.utils.toArray('.product-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out'
            });
        });

        // Floating animation for map pins
        gsap.utils.toArray('.fa-map-pin').forEach((pin, i) => {
            gsap.to(pin, {
                y: -5,
                duration: 1.5,
                delay: i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        });
    };

    // ===== ADD CSS ANIMATIONS DYNAMICALLY =====
    const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in {
                opacity: 0;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .reveal.active {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            .reveal-left.active {
                animation: slideIn 0.8s ease forwards;
            }
            
            .reveal-right.active {
                animation: slideIn 0.8s ease forwards;
                animation-name: slideIn;
                direction: rtl;
            }
            
            .reveal-scale.active {
                animation: scaleIn 0.6s ease forwards;
            }
            
            .fade-in.active {
                animation: fadeIn 1s ease forwards;
            }
            
            .dragging {
                cursor: grabbing !important;
            }
            
            .dragging * {
                user-select: none;
                pointer-events: none;
            }
            
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, #10b981, #34d399);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .nav-link:hover::after {
                transform: scaleX(1);
            }
            
            .slide {
                transition: opacity 0.5s ease;
            }
            
            .slider-dot {
                transition: all 0.3s ease;
            }
            
            .slider-dot:hover {
                transform: scale(1.2);
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize all animations
    const init = () => {
        addAnimationStyles();
        animateOnScroll();
        initHeroSlider();
        initInfiniteSlider();
        initGSAP();
        
        // Check for existing counters
        if (document.querySelector('.grid-cols-2.md\\:grid-cols-3')) {
            animateCounters(document.body);
        }
    };

    init();

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (DOM.mobileMenu) {
            DOM.mobileMenu.classList.add('hidden');
        }
    });
});

// Utility function for image changes
window.changeImage = (src) => {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.style.opacity = '0.5';
        mainImage.src = src;
        setTimeout(() => mainImage.style.opacity = '1', 100);
    }
};

// ===== TABBED MAP FUNCTIONALITY =====
const initMapTabs = () => {
    const tradeTab = document.getElementById('tradeTab');
    const produceTab = document.getElementById('produceTab');
    const tradeList = document.getElementById('tradeList');
    const produceList = document.getElementById('produceList');
    const tradeLocations = document.getElementById('tradeLocations');
    const produceLocations = document.getElementById('produceLocations');
    
    if (!tradeTab || !produceTab) return;
    
    // Function to switch tabs
    const switchTab = (activeTab) => {
        // Remove active classes from all tabs
        tradeTab.classList.remove('bg-white', 'text-gray-900', 'shadow-md');
        produceTab.classList.remove('bg-white', 'text-gray-900', 'shadow-md');
        
        // Add default classes
        tradeTab.classList.add('text-gray-500', 'hover:text-gray-900');
        produceTab.classList.add('text-gray-500', 'hover:text-gray-900');
        
        if (activeTab === 'trade') {
            // Activate trade tab
            tradeTab.classList.remove('text-gray-500', 'hover:text-gray-900');
            tradeTab.classList.add('bg-white', 'text-gray-900', 'shadow-md');
            
            // Show trade content
            tradeList.classList.remove('hidden');
            produceList.classList.add('hidden');
            tradeLocations.classList.remove('hidden');
            produceLocations.classList.add('hidden');
        } else {
            // Activate produce tab
            produceTab.classList.remove('text-gray-500', 'hover:text-gray-900');
            produceTab.classList.add('bg-white', 'text-gray-900', 'shadow-md');
            
            // Show produce content
            tradeList.classList.add('hidden');
            produceList.classList.remove('hidden');
            tradeLocations.classList.add('hidden');
            produceLocations.classList.remove('hidden');
        }
    };
    
    // Add click handlers
    tradeTab.addEventListener('click', () => switchTab('trade'));
    produceTab.addEventListener('click', () => switchTab('produce'));
    
    // Initialize with trade tab active
    switchTab('trade');
};

// Add this line in your init() function:
initMapTabs();