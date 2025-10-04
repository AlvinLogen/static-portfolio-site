//Mock of LocalStorage for testing

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

global.localStorage = localStorageMock;

//Mock window.scrollTo
global.scrollTo = jest.fn();

//Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
    }

    observe(target) {
        // Simulate the element being in view
        this.callback([{
            target: target,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now()
        }]);
    }

    unobserve(target) {
        // Mock unobserve
    }

    disconnect() {
        // Mock disconnect
    }
};