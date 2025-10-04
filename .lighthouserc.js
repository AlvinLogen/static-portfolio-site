module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            settings: {
                chromeFlags: '--no-sandbox --headless'
            },
            numberOfRuns: 3
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', {minScore:0.9}],
                'categories:accessibility': ['error', {minScore:0.9}],
                'categories:best-practices': ['warn', {minScore:0.9}],
                'categories:seo': ['warn', {minScore:0.8}],
                'categories:pwa': 'off'
            }
        },
        upload: {
            target: 'filesystem',
            outputDir: './lighthouse-reports'
        }
    }
};