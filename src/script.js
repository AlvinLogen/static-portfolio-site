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
        const navLinks = document.getElementById('.nav-link');

        //Mobile Menu Toggle
        if (navToggle & navMenu){
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
            if (this.state.isMenuOpen && !navToggle.contains(e.target) && !navMenu.contains(e.target)){
                this.closeMobileMenu();
            }
        });
    },

    //Mobile Menu Methods
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        this.state.isMenuOpen = !this.state.isMenuOpen;

        if(this.state.isMenuOpen){
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeMobileMenu(){
        if (this.state.isMenuOpen){
            this.toggleMobileMenu();
        }
    },

    //Navigation and scrolling
    navigateToSection(sectionId){
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

    updateActiveNavLink(activeId){
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-section') === activeId){
                link.classList.add('active')
            }
        });
    },

    //Theme Management

};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.init();
});

//Export for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports){
    module.exports = PortfolioApp;
}