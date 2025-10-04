//Mock HTML structure for testing
describe('Portfolio DOM Interactions', () => {
    let PortfolioApp;

    beforeEach(() => {
        // Reset DOM for each test
        document.body.innerHTML = `
            <div id="theme-button">☀️</div>
            <nav id="nav-menu" class="nav-menu">
                <a href="#" class="nav-link" data-section="about">About</a>
                <a href="#" class="nav-link" data-section="projects">Projects</a>
            </nav>
            <button id="nav-toggle">Menu</button>
            <form id="contact-form">
                <input type="text" name="name" required>
                <input type="email" name="email" required>
                <textarea name="message" required></textarea>
                <button type="submit">Send</button>
            </form>
            <div id="form-status">
            </div>
        `;

        jest.clearAllMocks();

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        });

        //Mock Module Imporrt
        PortfolioApp = require('../src/script.js');
        PortfolioApp.init();
    });

    describe('Theme Management', () => {
        test('should toggle theme correctly', () => {
            const initialTheme = PortfolioApp.state.currentTheme;
            PortfolioApp.toggleTheme();

            expect(PortfolioApp.state.currentTheme).not.toBe(initialTheme);
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                'theme',
                PortfolioApp.state.currentTheme
            );
        });

        test('should apply dark theme correctly', () => {
            PortfolioApp.state.currentTheme = 'dark';
            PortfolioApp.applyTheme();

            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
            expect(document.getElementById('theme-button').textContent).toBe('☀️');
        });
    });

    describe('Navigation', () => {
        test('Should update active nav link', () => {
            PortfolioApp.updateActiveNavLink('projects');

            const activeLink = document.querySelector('.nav-link.active');
            expect(activeLink.getAttribute('data-section')).toBe('projects');
        });

        test('Should handle mobile menu toggle', () => {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');

            expect(PortfolioApp.state.isMenuOpen).toBe(false);

            PortfolioApp.toggleMobileMenu();

            expect(navMenu.classList.contains('active')).toBe(true);
            expect(PortfolioApp.state.isMenuOpen).toBe(true);

            PortfolioApp.toggleMobileMenu();
            expect(navMenu.classList.contains('active')).toBe(false);
            expect(PortfolioApp.state.isMenuOpen).toBe(false);
        });
    }); 

    describe('Form Validation', () => {
        test('Should validate email field correctly', () => {
            const emailInput = document.querySelector('input[type="email"]');

            emailInput.value = 'invalid-email';
            const isValid = PortfolioApp.validateField(emailInput);

            expect(isValid).toBe(false);
            expect(emailInput.classList.contains('invalid')).toBe(true);

            emailInput.value = 'valid@email.com';
            const isValidAfter = PortfolioApp.validateField(emailInput);

            expect(isValidAfter).toBe(true);
            expect(emailInput.classList.contains('valid')).toBe(true);
        });

        test('Should handle form submission with validation', () => {
            const form = document.getElementById('contact-form');
            const nameInput = form.querySelector('input[name="name"]');
            const emailInput = form.querySelector('input[name="email"]');
            const messageInput = form.querySelector('textarea[name="message"]');

            //Set invalid values
            nameInput.value = 'A';
            emailInput.value = 'invalid';
            messageInput.value = 'Short';

            PortfolioApp.handleFormSubmit(form);

            expect(document.querySelector('.error-message')).toBeTruthy();
        });
    });

    describe('Project Filtering', () => {
        test('Should filter projects correctly', () => {
            //Setup project cards
            document.body.innerHTML += `
                <div class="project-card" data-tech="javascript"></div>
                <div class="project-card" data-tech="python"></div>
                <div class="project-card" data-tech="javascript"></div>
            `;

            const projectCards = document.querySelectorAll('.project-card');

            PortfolioApp.filterProjects('javascript', projectCards);

            setTimeout(() => {
                const visibleCards = Array.from(projectCards).filter(card => ! card.classList.contains('hidden'));
                expect(visibleCards.length).toBe(2);
            },100);
        });
    });

    describe('Animation Control', () => {
        test('Should animate progress bar', async () => {
            document.body.innerHTML += `
                <div class="progress-fill" data-progress="75"></div>
                <div class="skill-bar" data-skill="90"></div>
            `;

            PortfolioApp.initializeAnimations();

            await new Promise(resolve => setTimeout(resolve, PortfolioApp.config.progressAnimationDelay + 50))

            const progressBar = document.querySelector('.progress-fill');
            const skillBar = document.querySelector('.skill-bar');

            expect(progressBar.classList.contains('animate')).toBe(true);
            expect(skillBar.classList.contains('animate')).toBe(true);
        });

        test('Should animate counters', () => {
            document.body.innerHTML = `
                <span class="stat-number" data-target="100">0</span>
            `;

            const counter = document.querySelector('.stat-number');
            PortfolioApp.animateCounters();

            //test that counter animation starts
            setTimeout(() =>{
                expect(parseInt(counter.textContent)).toBeGreaterThan(0);
            },100);
        });
    });

    describe('User Preferences', () => {
        test('Should save and load user preferences', () => {
            PortfolioApp.saveUserPreference('lastSection', 'projects');

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'userPreferences',
                JSON.stringify({lastSection: 'projects'})
            );
        });
    });

    describe('Utility Functions', () => {
        test('Should debounce function calls', () => {
            const mockFn = jest.fn();
            const debouncedFN = PortfolioApp.debounce(mockFn, 100);

            debouncedFN();
            debouncedFN();
            debouncedFN();

            expect(mockFn).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledTimes(1);
            }, 150);
        });

        test('Should throttle function calls', () => {
            const mockFn = jest.fn();
            const throttledFn = PortfolioApp.throttle(mockFn, 100);

            throttledFn();
            throttledFn();
            throttledFn();

            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

});