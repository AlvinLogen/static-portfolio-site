// Main Application Object

const PortfolioApp = {
    // Configuration
    config: {
        animationSpeed: 300,
        scrollOffset: 80,
        counterSpeed: 2000,
        progressAnimationDelay: 500
    },

    // State Management
    state: {
        currentTheme: localStorage.getItem('theme') || 'light',
        activeSection: 'about',
        isMenuOpen: false,
        animationsTriggered: new Set(),
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || {}
    },

    // Initialize the application
    init() {
        this.bindEvents()
        this.loadTheme();
        this.loadUserPreferences();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        console.log('Portfolio App initialized successfully');
    },

    //Event Binding
    bindEvents() {
        //Navigation
        this.bindNavigationEvents();

        //Theme Toggle
        this.bindThemeToggle();

        //Form Handling
        this.bindFormEvents();

        //Project Filtering
        this.bindProjectFiltering();

        //Window Events
        this.bindWindowEvents();

        //Smooth Scrolling
        this.bindSmoothScrolling();
    },

    //Navigation Event handlers
    bindNavigationEvents() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        //Mobile Menu Toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        //Navigation Link Clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                if (targetSection) {
                    this.navigateToSection(targetSection);
                    this.closeMobileMenu();
                }
            });
        });

        //Close Mobile Menu When Clicking outside
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    //Mobile Menu Methods
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        //Null Checks
        if (!navMenu || !navToggle) {
            console.warn('Navigation elements not found');
            return;
        }

        this.state.isMenuOpen = !this.state.isMenuOpen;

        if (this.state.isMenuOpen) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeMobileMenu() {
        if (this.state.isMenuOpen) {
            this.toggleMobileMenu();
        }
    },

    //Navigation and scrolling
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const offsetTop = section.offsetTop - this.config.scrollOffset;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        this.updateActiveNavLink(sectionId);
        this.state.activeSection = sectionId;

        //Save user preference
        this.saveUserPreference('lastSection', sectionId);
    },

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeId) {
                link.classList.add('active')
            }
        });
    },

    //Theme Management
    bindThemeToggle() {
        const themeButton = document.getElementById('theme-button');

        if (themeButton) {
            themeButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    toggleTheme() {
        this.state.currentTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();

        //Visual Effects
        const button = document.getElementById('theme-button');
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    },

    loadTheme() {
        this.applyTheme();
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);

        const themeButton = document.getElementById('theme-button');
        if (themeButton) {
            themeButton.textContent = this.state.currentTheme === 'light' ? '🌙' : '☀️';
        }
    },

    saveTheme() {
        localStorage.setItem('theme', this.state.currentTheme);
    },

    //Form handling with validation
    bindFormEvents() {
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            });

            //Real-time Validation
            const inputs = contactForm.querySelectorAll('input', 'textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearValidation(input);
                });
            });
        }
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        //Remove existing error message
        const existingError = field.parentNode.querySelectorAll('.error-message');

        if (existingError) {
            if (existingError.parentNode) {
                existingError.parentNode.removeChild(existingError);
            }
        }

        //Validation Rules
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'text':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Thjis field must be at least 2 characters long';
                }
                break;
            default:
                if (field.tagName === 'TEXTAREA' && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
        }

        //Apply validation styles and messages
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');

            //Add Error Message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    },

    clearValidation(field) {
        field.classList.remove('valid', 'invalid');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    },

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const formStatus = document.getElementById('form-status');

        //Validate All Fields
        const inputs = form.querySelectorAll('input', 'textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false
            }
        });

        if (!isFormValid) {
            this.showFormStatus('Please correct the errors above', 'error');
            return;
        }

        //Simulate form submission
        this.showFormStatus('Sending message...', 'info');

        //Simulate API call
        setTimeout(() => {
            this.showFormStatus('Message sent successfully! Thank you for reaching out.', 'success');
            form.reset();

            //Clear validation classes
            input.forEach(input => {
                this.clearValidation(input);
            });
        }, 2000);
    },

    showFormStatus(message, type) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        //Auto-hide success/error message
        if (type !== 'info') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    },

    //Project Filtering
    bindProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');

                //Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                //Filter Projects
                this.filterProjects(filter, projectCards);
            });
        });
    },

    filterProjects(filter, projectCards) {
        projectCards.forEach((card, index) => {
            const cardTech = card.getAttribute('data-tech');
            const shouldShow = filter === 'all' || cardTech === filter;

            setTimeout(() => {
                if (shouldShow) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }, index * 50); //Staggered animation
        });
    },

    //Window event handlers
    bindWindowEvents() {
        //Scroll handling with throttling
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); //60fps
        });

        //Resize handling
        let resizeTimout;
        window.addEventListener('resize', () => {
            if (resizeTimout) {
                clearTimeout(resizeTimout);
            }

            resizeTimout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    },

    handleScroll() {
        //Update activate navigation based on scroll position
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + this.config.scrollOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                if (sectionId !== this.state.activeSection) {
                    this.updateActiveNavLink(sectionId);
                    this.state.activeSection = sectionId;
                }
            }
        });
    },

    handleResize() {
        //Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    },

    //Smooth scrolling for anchor links
    bindSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    e.preventDefault();
                    this.navigateToSection(targetId);
                }
            });
        });
    },

    //Animation initialization
    initializeAnimations() {
        //Animate Progress bars when in view
        setTimeout(() => {
            this.animateProgressBar();
        }, this.config.progressAnimationDelay);

        //Animate Counters
        this.animateCounters();
    },

    animateProgressBar() {
        const progressBars = document.querySelectorAll('.progress-fill, .skill-bar');

        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress') || bar.getAttribute('data-skill');
            if (progress) {
                bar.style.setProperty('--progress-width', `${progress}%`);
                bar.classList.add('animate');
            }
        });
    },

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = this.config.counterSpeed;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            //Start animation after delay
            setTimeout(() => {
                updateCounter();
            }, 1000);
        });
    },

    //Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elementId = entry.target.id;

                    if (!this.state.animationsTriggered.has(elementId)) {
                        this.triggerSectionAnimation(entry.target);
                        this.state.animationsTriggered.add(elementId);
                    }
                }
            });
        }, observerOptions);

        //Observe all sections 
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    },

    triggerSectionAnimation(section) {
        const sectionId = section.id;

        //Add fade-in animation
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';

        requestAnimationFrame(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });

        console.log(`Animated section: ${sectionId}`);
    },

    //User preferences management
    loadUserPreferences() {
        const lastSection = this.state.userPreferences.lastSection;
        if (lastSection && document.getElementById(lastSection)) {
            this.navigateToSection(lastSection);
        }
    },

    saveUserPreference(key, value) {
        this.state.userPreferences[key] = value;
        localStorage.setItem('userPreferences', JSON.stringify(this.state.userPreferences));
    },

    //Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executeFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.init();
});

//Export for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}