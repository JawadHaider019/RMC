// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // ===== CACHE DOM ELEMENTS - SINGLE SOURCE OF TRUTH =====
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
        fruitSlider: document.getElementById('fruit-slider'),
        navLinks: document.querySelectorAll('nav a[href]')
    };

    // ===== PERFORMANCE OPTIMIZATIONS =====
    const raf = window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                (cb => setTimeout(cb, 16));

    // ===== DATA =====
    const fruits = [
        { id: 1, name: "Fresh Mangoes", category: "Premium Fruits", description: "Sweet and juicy mangoes, perfect for desserts or fresh eating.", image: "images/mango.jpg", page: "mango.html" },
        { id: 2, name: "Fresh Oranges", category: "Citrus Fruits", description: "Juicy and seedless oranges, rich in vitamin C.", image: "images/oranges.jpg", page: "oranges.html" },
        { id: 3, name: "Fresh Onions", category: "Root Vegetables", description: "Grade A onions, freshly harvested. Perfect for cooking.", image: "images/onion.jpg", page: "onions.html" },
        { id: 4, name: "Fresh Potatoes", category: "Root Vegetables", description: "Freshly harvested potatoes, uniform size.", image: "images/potato.jpg", page: "potatos.html" },
    ];

    const recipes = [
        {
            type: "Frozen Desserts", typeIcon: "fa-ice-cream", name: "Fruit Ice Cream",
            description: "Creamy, all-natural ice cream made with ripe seasonal fruits.",
            fruitUsage: "We blend fresh, ripe fruits into a smooth puree, then mix with cream and natural sweeteners before churning to perfection.",
            image: "images/fruiticecream.jpg", technique: "Cold Preparation",
            suitableItems: ["Mangoes", "Strawberries", "Bananas", "Peaches", "Berries"],
            methods: ["Blending", "Churning", "Freezing", "Pureeing"]
        },
        {
            type: "Fresh Salads", typeIcon: "fa-bowl-food", name: "Fruit Salads",
            description: "Vibrant fruit salads featuring seasonal fruits tossed in light citrus dressings.",
            fruitUsage: "We carefully dice fresh fruits into bite-sized pieces, then gently toss with a light dressing.",
            image: "images/fruitsalad.jpg", technique: "Fresh Cut",
            suitableItems: ["Melons", "Berries", "Citrus", "Grapes", "Kiwi"],
            methods: ["Dicing", "Tossing", "Drizzling", "Chilling"]
        },
        {
            type: "Fresh Juices", typeIcon: "fa-glass-water", name: "Cold-Pressed Juices",
            description: "Nutrient-rich cold-pressed juices made from fresh fruits and vegetables.",
            fruitUsage: "We cold-press fresh fruits to extract maximum nutrients and flavor without heat.",
            image: "images/fruitshake.jpg", technique: "Cold Press",
            suitableItems: ["Oranges", "Apples", "Pineapple", "Carrots", "Ginger"],
            methods: ["Pressing", "Straining", "Mixing", "Chilling"]
        }
    ];

    const vegRecipes = [
        {
            type: "Fresh Salads", typeIcon: "fa-bowl-food", name: "Garden Salad",
            description: "Crisp, refreshing salads featuring fresh seasonal vegetables.",
            vegUsage: "We carefully wash and cut fresh vegetables into bite-sized pieces, then toss with signature dressings.",
            image: "images/vegsalad.jpg", technique: "Fresh Cut",
            suitableItems: ["Lettuce", "Cucumbers", "Tomatoes", "Bell Peppers", "Radishes"],
            methods: ["Washing", "Cutting", "Tossing", "Drizzling"]
        },
        {
            type: "Roasted Vegetables", typeIcon: "fa-fire", name: "Roasted Medley",
            description: "Caramelized roasted vegetables with herbs, bringing out natural sweetness.",
            vegUsage: "We toss vegetables in olive oil and herbs, then roast at high heat until golden.",
            image: "images/vegfry.jpg", technique: "High Heat Roasting",
            suitableItems: ["Broccoli", "Cauliflower", "Carrots", "Brussels Sprouts", "Sweet Potatoes"],
            methods: ["Tossing", "Seasoning", "Roasting", "Flipping"]
        },
        {
            type: "Grilled Vegetables", typeIcon: "fa-burger", name: "Grilled Vegetables",
            description: "Smoky, charred grilled vegetables perfect as a side dish.",
            vegUsage: "We slice vegetables evenly, brush with olive oil and herbs, then grill until tender.",
            image: "images/spicy.jpg", technique: "Grilling",
            suitableItems: ["Zucchini", "Eggplant", "Bell Peppers", "Asparagus", "Corn"],
            methods: ["Slicing", "Brushing", "Grilling", "Flipping"]
        }
    ];

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
        };

        DOM.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (!DOM.mobileMenu.contains(e.target) && !DOM.menuToggle.contains(e.target)) {
                if (!DOM.mobileMenu.classList.contains('hidden')) {
                    toggleMenu(false);
                }
            }
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    let ticking = false;

    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        
        if (DOM.navbar) {
            if (currentScrollY > 50) {
                DOM.navbar.classList.add('bg-white', 'shadow-lg');
                DOM.navbar.classList.remove('bg-transparent');
                
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-100');
                });
                
                document.querySelectorAll('#searchToggle, #menuToggle').forEach(btn => {
                    btn.classList.remove('text-white');
                    btn.classList.add('text-gray-800');
                });
            } else {
                DOM.navbar.classList.remove('bg-white', 'shadow-lg');
                DOM.navbar.classList.add('bg-transparent');
                
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-100');
                });
                
                document.querySelectorAll('#searchToggle, #menuToggle').forEach(btn => {
                    btn.classList.add('text-white');
                    btn.classList.remove('text-gray-100');
                });
            }
        }
        
        ticking = false;
    };

    window.addEventListener('scroll', () => {
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

        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            
            link.classList.remove('active', 'text-green-600', 'font-semibold', 'bg-green-50', 
                                 'border-l-4', 'border-green-600');
            
            const indicator = link.querySelector('.active-indicator');
            if (indicator) indicator.remove();

            if (isActiveLink(href)) {
                link.classList.add('active');
                
                if (link.classList.contains('nav-link')) {
                    link.classList.add('text-green-400', 'font-semibold');
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
        DOM.searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.searchContainer.classList.toggle('hidden');
            if (!DOM.searchContainer.classList.contains('hidden')) {
                setTimeout(() => {
                    DOM.searchContainer.classList.remove('opacity-0', '-translate-y-4');
                    if (DOM.searchInput) DOM.searchInput.focus();
                }, 10);
            } else {
                DOM.searchContainer.classList.add('opacity-0', '-translate-y-4');
            }
        });

        if (DOM.searchSubmit && DOM.searchInput) {
            DOM.searchSubmit.addEventListener('click', () => {
                const query = DOM.searchInput.value;
                if (query.trim()) alert(`Searching for: ${query}`);
            });

            DOM.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && DOM.searchInput.value.trim()) {
                    alert(`Searching for: ${DOM.searchInput.value}`);
                }
            });
        }
    }

    // ===== PRODUCT SLIDER =====
    function createProductSlider(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let activeIndex = 0;
        let autoSlideInterval;
        let isHovering = false;

        function render() {
            let slidesHtml = '';

            items.forEach((item, index) => {
                slidesHtml += `
                    <div class="product-slide ${index === 0 ? 'active' : ''}" data-index="${index}" data-page="${item.page}" style="background-image: url('${item.image}');">
                        <div class="slide-rotate-name">${item.name}</div>
                        <div class="slide-compact">
                            <div class="slide-compact-left">
                                <span class="slide-compact-category">${item.category}</span>
                                <span class="slide-compact-name">${item.name}</span>
                            </div>
                            <span class="slide-compact-number">${String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <div class="slide-content">
                            <span class="slide-category">${item.category}</span>
                            <h3 class="slide-name">${item.name}</h3>
                            <p class="slide-description">${item.description}</p>
                            <button class="slide-button" data-page="${item.page}">
                                <span>View Details</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = slidesHtml;

            document.querySelectorAll(`#${containerId} .product-slide`).forEach(slide => {
                slide.addEventListener('click', handleSlideClick);
            });

            document.querySelectorAll(`#${containerId} .slide-button`).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const page = e.currentTarget.dataset.page;
                    if (page) window.location.href = page;
                });
            });

            document.querySelectorAll(`#${containerId} .product-slide`).forEach(slide => {
                slide.addEventListener('mouseenter', () => {
                    isHovering = true;
                    stopAutoSlide();
                });
                slide.addEventListener('mouseleave', () => {
                    isHovering = false;
                    startAutoSlide();
                });
            });

            updateVisibility();
        }

        function handleSlideClick(e) {
            const slide = e.currentTarget;
            const index = parseInt(slide.dataset.index);
            const page = slide.dataset.page;

            if (index === activeIndex) {
                if (page) window.location.href = page;
            } else {
                activeIndex = index;

                document.querySelectorAll(`#${containerId} .product-slide`).forEach((s, i) => {
                    if (i === activeIndex) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });

                updateVisibility();
            }
        }

        function updateVisibility() {
            const isMobile = window.innerWidth < 768;
            const slides = document.querySelectorAll(`#${containerId} .product-slide`);

            slides.forEach((slide, index) => {
                const rotateName = slide.querySelector('.slide-rotate-name');
                const compact = slide.querySelector('.slide-compact');
                const content = slide.querySelector('.slide-content');

                if (isMobile) {
                    if (rotateName) rotateName.style.display = 'none';
                    if (index === activeIndex) {
                        if (compact) compact.style.display = 'none';
                        if (content) content.style.display = 'flex';
                    } else {
                        if (compact) compact.style.display = 'flex';
                        if (content) content.style.display = 'none';
                    }
                } else {
                    if (index === activeIndex) {
                        if (rotateName) rotateName.style.display = 'none';
                        if (compact) compact.style.display = 'none';
                        if (content) content.style.display = 'flex';
                    } else {
                        if (rotateName) rotateName.style.display = 'flex';
                        if (compact) compact.style.display = 'none';
                        if (content) content.style.display = 'none';
                    }
                }
            });
        }

        function startAutoSlide() {
            if (autoSlideInterval) stopAutoSlide();
            if (isHovering) return;

            autoSlideInterval = setInterval(() => {
                activeIndex = (activeIndex + 1) % items.length;

                document.querySelectorAll(`#${containerId} .product-slide`).forEach((s, i) => {
                    if (i === activeIndex) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });

                updateVisibility();
            }, 3000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        window.addEventListener('resize', () => {
            updateVisibility();
        });

        render();
        startAutoSlide();

        if (container) {
            container.addEventListener('mouseenter', stopAutoSlide);
            container.addEventListener('mouseleave', () => {
                if (!isHovering) startAutoSlide();
            });
        }
    }

    // Initialize product slider
    if (DOM.fruitSlider) {
        createProductSlider('fruit-slider', fruits);
    }

    // ===== RECIPE SLIDER =====
    function createRecipeSlider(config) {
        let currentIndex = 0;
        let autoSlideInterval;
        let isTransitioning = false;

        const elements = {
            typeIcon: document.getElementById(config.typeIconId),
            recipeType: document.getElementById(config.recipeTypeId),
            recipeName: document.getElementById(config.recipeNameId),
            recipeDesc: document.getElementById(config.recipeDescId),
            usage: document.getElementById(config.usageId),
            image: document.getElementById(config.imageId),
            nextImage: document.getElementById(config.imageNextId),
            techniqueBadge: document.getElementById(config.techniqueBadgeId),
            techniqueContainer: document.getElementById(config.techniqueContainerId),
            tagsContainer: document.getElementById(config.tagsContainerId),
            methodsContainer: document.getElementById(config.methodsContainerId),
            indicatorsContainer: document.getElementById(config.indicatorsContainerId),
            contentContainer: document.getElementById(config.contentId)
        };

        if (!elements.image || !elements.nextImage) return;

        function updateContent(index) {
            if (isTransitioning) return;
            isTransitioning = true;

            const recipe = config.data[index];
            
            if (recipe && elements.nextImage) {
                elements.nextImage.src = recipe.image;
            }

            if (elements.image && elements.nextImage) {
                elements.image.classList.remove('active');
                elements.image.classList.add('animating-out');
                elements.nextImage.classList.add('active');
            }

            if (elements.contentContainer) {
                elements.contentContainer.classList.remove('active');
            }

            if (elements.techniqueContainer) {
                elements.techniqueContainer.classList.remove('active');
            }

            setTimeout(() => {
                if (elements.typeIcon && recipe) {
                    elements.typeIcon.className = `fas ${recipe.typeIcon} text-white text-sm`;
                }

                if (elements.recipeType && recipe) elements.recipeType.textContent = recipe.type;
                if (elements.recipeName && recipe) elements.recipeName.textContent = recipe.name;
                if (elements.recipeDesc && recipe) elements.recipeDesc.textContent = recipe.description;

                const usageText = recipe ? (recipe.fruitUsage || recipe.vegUsage) : '';
                if (elements.usage && usageText) {
                    elements.usage.textContent = `"${usageText}"`;
                }

                if (elements.techniqueBadge && recipe) {
                    elements.techniqueBadge.textContent = recipe.technique;
                }

                if (elements.tagsContainer && recipe && recipe.suitableItems) {
                    elements.tagsContainer.innerHTML = recipe.suitableItems.map(item =>
                        `<span class="px-3 py-1 ${config.tagBgClass} text-white text-xs rounded-full transition-all duration-300 hover:scale-110">${item}</span>`
                    ).join('');
                }

                if (elements.methodsContainer && recipe && recipe.methods) {
                    elements.methodsContainer.innerHTML = recipe.methods.map(method => `
                        <div class="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                            <div class="w-6 h-6 ${config.methodBgClass} rounded-full flex items-center justify-center">
                                <i class="fas fa-check text-white text-xs"></i>
                            </div>
                            <span class="text-gray-700 text-sm">${method}</span>
                        </div>
                    `).join('');
                }

                if (elements.indicatorsContainer && config.data) {
                    elements.indicatorsContainer.innerHTML = config.data.map((_, i) =>
                        `<div class="${i === index ? config.indicatorActiveClass : 'w-4 bg-gray-300'} h-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-110" onclick="${config.goToFunction}(${i})"></div>`
                    ).join('');
                }

                setTimeout(() => {
                    if (elements.image && elements.nextImage) {
                        const tempSrc = elements.image.src;
                        elements.image.src = elements.nextImage.src;
                        elements.nextImage.src = tempSrc;

                        elements.image.classList.remove('animating-out');
                        elements.image.classList.add('active');
                        elements.nextImage.classList.remove('active');
                    }

                    if (elements.contentContainer) {
                        elements.contentContainer.classList.add('active');
                    }

                    if (elements.techniqueContainer) {
                        elements.techniqueContainer.classList.add('active');
                    }

                    isTransitioning = false;
                }, 100);

            }, 400);
        }

        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            if (config.data && config.data.length > 1) {
                autoSlideInterval = setInterval(() => {
                    if (!isTransitioning) {
                        currentIndex = (currentIndex + 1) % config.data.length;
                        updateContent(currentIndex);
                    }
                }, 3000);
            }
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        window[config.nextFunction] = () => {
            if (!isTransitioning && config.data && config.data.length) {
                stopAutoSlide();
                currentIndex = (currentIndex + 1) % config.data.length;
                updateContent(currentIndex);
                startAutoSlide();
            }
        };

        window[config.prevFunction] = () => {
            if (!isTransitioning && config.data && config.data.length) {
                stopAutoSlide();
                currentIndex = (currentIndex - 1 + config.data.length) % config.data.length;
                updateContent(currentIndex);
                startAutoSlide();
            }
        };

        window[config.goToFunction] = (index) => {
            if (!isTransitioning && index !== currentIndex && config.data && config.data.length) {
                stopAutoSlide();
                currentIndex = index;
                updateContent(currentIndex);
                startAutoSlide();
            }
        };

        if (config.data && config.data.length > 0) {
            setTimeout(() => {
                updateContent(0);
                
                if (elements.contentContainer) {
                    elements.contentContainer.classList.add('active');
                }
                if (elements.techniqueContainer) {
                    elements.techniqueContainer.classList.add('active');
                }
            }, 100);
        }

        startAutoSlide();

        const slider = document.getElementById(config.sliderId);
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
        }
    }

    // Initialize recipe sliders
    if (document.getElementById('recipe-slider')) {
        createRecipeSlider({
            sliderId: 'recipe-slider',
            data: recipes,
            typeIconId: 'recipe-icon',
            recipeTypeId: 'recipe-type',
            recipeNameId: 'recipe-name',
            recipeDescId: 'recipe-description',
            usageId: 'fruit-usage',
            imageId: 'recipe-image',
            imageNextId: 'recipe-image-next',
            techniqueBadgeId: 'technique-badge',
            techniqueContainerId: 'technique-badge-container',
            tagsContainerId: 'fruit-tags-container',
            methodsContainerId: 'methods-container',
            indicatorsContainerId: 'recipe-indicators',
            contentId: 'recipe-content',
            tagBgClass: 'bg-green-500',
            methodBgClass: 'bg-green-500',
            indicatorActiveClass: 'w-8 bg-green-500',
            nextFunction: 'nextRecipe',
            prevFunction: 'prevRecipe',
            goToFunction: 'goToRecipe'
        });
    }

    if (document.getElementById('veg-recipe-slider')) {
        createRecipeSlider({
            sliderId: 'veg-recipe-slider',
            data: vegRecipes,
            typeIconId: 'veg-recipe-icon',
            recipeTypeId: 'veg-recipe-type',
            recipeNameId: 'veg-recipe-name',
            recipeDescId: 'veg-recipe-description',
            usageId: 'veg-usage',
            imageId: 'veg-recipe-image',
            imageNextId: 'veg-recipe-image-next',
            techniqueBadgeId: 'veg-technique-badge',
            techniqueContainerId: 'veg-technique-badge-container',
            tagsContainerId: 'veg-tags-container',
            methodsContainerId: 'veg-methods-container',
            indicatorsContainerId: 'veg-recipe-indicators',
            contentId: 'veg-content',
            tagBgClass: 'bg-green-600',
            methodBgClass: 'bg-green-600',
            indicatorActiveClass: 'w-8 bg-green-600',
            nextFunction: 'nextVegRecipe',
            prevFunction: 'prevVegRecipe',
            goToFunction: 'goToVegRecipe'
        });
    }

    // ===== HERO SLIDER =====
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

        const resetAnimations = (slideIndex) => {
            const content = contents[slideIndex];
            const animatedElements = content.querySelectorAll('[class*="animate-"]');
            
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = null;
            });
        };

        const animateContent = (slideIndex) => {
            const content = contents[slideIndex];
            const elements = content.querySelectorAll('.inline-flex, h1, p, button');
            
            elements.forEach((el, index) => {
                const delay = index * 0.2;
                el.style.animation = `slideInUp 0.8s ease forwards ${delay}s`;
            });
        };

        const updateProgress = () => {
            if (progressBar && !isPaused) {
                progress += 1;
                if (progress > 100) progress = 0;
                progressBar.style.width = `${progress}%`;
            }
        };

        const goToSlide = (index) => {
            if (index === currentSlide) return;
            
            slides[currentSlide]?.classList.remove('active');
            contents[currentSlide]?.classList.add('hidden');
            
            resetAnimations(index);
            
            currentSlide = index;
            
            slides[currentSlide]?.classList.add('active');
            contents[currentSlide]?.classList.remove('hidden');
            
            animateContent(currentSlide);
            
            dots.forEach((dot, i) => {
                dot.classList.remove('active', 'bg-white');
                dot.classList.add('bg-white/50');
                if (i === currentSlide) {
                    dot.classList.add('active', 'bg-green-500');
                    dot.classList.remove('bg-white/50');
                }
            });
            
            progress = 0;
            if (progressBar) progressBar.style.width = '0%';
        };

        const nextSlide = () => {
            if (!isPaused) {
                const next = (currentSlide + 1) % slideCount;
                goToSlide(next);
            }
        };

        const prevSlide = () => {
            if (!isPaused) {
                const prev = (currentSlide - 1 + slideCount) % slideCount;
                goToSlide(prev);
            }
        };

        const startAutoSlide = () => {
            if (slideInterval) clearInterval(slideInterval);
            if (progressInterval) clearInterval(progressInterval);
            
            slideInterval = setInterval(nextSlide, 5000);
            progressInterval = setInterval(updateProgress, 50);
        };

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

        if (DOM.heroSection) {
            DOM.heroSection.addEventListener('mouseenter', () => {
                isPaused = true;
                stopAutoSlide();
            });

            DOM.heroSection.addEventListener('mouseleave', () => {
                isPaused = false;
                startAutoSlide();
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                isPaused = true;
                stopAutoSlide();
                setTimeout(() => {
                    isPaused = false;
                    startAutoSlide();
                }, 3000);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });

        setTimeout(() => {
            animateContent(0);
        }, 100);

        startAutoSlide();
    };

    initHeroSlider();

    // ===== SCROLL REVEAL ANIMATIONS =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active', 'animated');
                    
                    if (entry.target.querySelector('.counter-value')) {
                        animateCounters(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

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

    // ===== FORM VALIDATION =====
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    isValid = false;

                    setTimeout(() => {
                        input.classList.remove('border-red-500');
                    }, 3000);
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            const checkbox = document.getElementById('privacy');
            if (checkbox && !checkbox.checked) {
                checkbox.classList.add('border-red-500');
                isValid = false;
                
                setTimeout(() => {
                    checkbox.classList.remove('border-red-500');
                }, 3000);
            }

            if (isValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="flex items-center gap-2"><i class="fas fa-check"></i> Sent!</span>';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                    alert('Thank you for your inquiry! We will contact you soon.');
                }, 1500);
            } else {
                alert('Please fill in all required fields and accept the privacy policy.');
            }
        });
    }

    // ===== IMAGE LOADING =====
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
        }
    });

    // ===== INIT ALL ANIMATIONS =====
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
        `;
        document.head.appendChild(style);
    };

    addAnimationStyles();
    animateOnScroll();

    // ===== GSAP ANIMATIONS =====
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.hero-underline', {
            scaleX: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.5
        });

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
});

// ===== UTILITY FUNCTIONS =====
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
    
    const switchTab = (activeTab) => {
        tradeTab.classList.remove('bg-white', 'text-gray-900', 'shadow-md');
        produceTab.classList.remove('bg-white', 'text-gray-900', 'shadow-md');
        
        tradeTab.classList.add('text-gray-500', 'hover:text-gray-900');
        produceTab.classList.add('text-gray-500', 'hover:text-gray-900');
        
        if (activeTab === 'trade') {
            tradeTab.classList.remove('text-gray-500', 'hover:text-gray-900');
            tradeTab.classList.add('bg-white', 'text-gray-900', 'shadow-md');
            
            tradeList.classList.remove('hidden');
            produceList.classList.add('hidden');
            tradeLocations.classList.remove('hidden');
            produceLocations.classList.add('hidden');
        } else {
            produceTab.classList.remove('text-gray-500', 'hover:text-gray-900');
            produceTab.classList.add('bg-white', 'text-gray-900', 'shadow-md');
            
            tradeList.classList.add('hidden');
            produceList.classList.remove('hidden');
            tradeLocations.classList.add('hidden');
            produceLocations.classList.remove('hidden');
        }
    };
    
    tradeTab.addEventListener('click', () => switchTab('trade'));
    produceTab.addEventListener('click', () => switchTab('produce'));
    
    switchTab('trade');
};

// Initialize map tabs if elements exist
if (document.getElementById('tradeTab')) {
    initMapTabs();
}


document.addEventListener('DOMContentLoaded', function() {
    // ===== RUNNING NUMBERS ANIMATION =====
    const animateNumber = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    };

    // Observer for stats section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-value');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target') || '0');
                    const speed = parseInt(counter.getAttribute('data-speed') || '2000');
                    const startValue = parseInt(counter.textContent || '0');
                    
                    if (startValue !== target) {
                        animateNumber(counter, 0, target, speed);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-3');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Initialize counters with zero
    document.querySelectorAll('.counter-value').forEach(counter => {
        counter.textContent = '0';
    });
});
