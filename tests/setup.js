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