//Performance and Memory Usage tests

describe('Performance Tests', () => {
    test('Should handle rapid scroll events efficiently', ()=>{
        const startTime = performance.now();

        //Simulate rapid scroll events
        for (let i = 0; i < 1000; i++){
            const scrollEvent = new Event('scroll');
            window.dispatchEvent(scrollEvent);
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        //Should handle 1000 scroll events under 100ms
        expect(duration).toBeLessThan(100);
    });

    test('Should efficiently filter large project lists', ()=>{
        //Create Many Project Cards
        const projectCount = 1000;
        const projectCards = [];

        for(let i = 0; i < projectCount; i++){
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.setAttribute('data-tech', i % 5 === 0 ? 'javascript' : 'other');
            projectCards.push(card);
        }

        const startTime = performance.now();
        PortfolioApp.filterProjects('javascript', projectCards);
        const endTime = performance.now();

        //Should filter 1000 projects in under 50ms
        expect(endTime - startTime).toBeLessThan(50);
    });
});