# Portfolio Website

[![CI/CD Pipeline](https://github.com/yourusername/portfolio/actions/workflows/main.yml/badge.svg)](https://github.com/yourusername/portfolio/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/yourusername/portfolio/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/portfolio)
[![Lighthouse Performance](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://github.com/yourusername/portfolio/actions)

A professional portfolio website built with modern web technologies and industry best practices.

## 🚀 Features

- **Modern Design**: Responsive, accessible, and performant
- **Dark/Light Theme**: User preference with persistence
- **Interactive Elements**: Smooth animations and transitions
- **Form Validation**: Real-time validation with error handling  
- **Performance Optimized**: Lighthouse scores 95+
- **Professional CI/CD**: Automated testing, building, and deployment

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (PostCSS), Vanilla JavaScript
- **Testing**: Jest (Unit), Playwright (E2E)
- **Code Quality**: ESLint, Prettier, Stylelint
- **CI/CD**: GitHub Actions
- **Performance**: Lighthouse CI, Web Vitals

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

## 🏃‍♂️ Quick Start

### 1. Clone and Setup
\`\`\`bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
\`\`\`

### 2. Development
\`\`\`bash
npm run dev        # Start development server with file watching
npm start          # Start development server
npm test           # Run test suite
npm run lint       # Check code quality
\`\`\`

### 3. Production Build
\`\`\`bash
npm run build      # Build optimized production files
npm run serve      # Serve production build locally
npm run lighthouse # Run performance audit
\`\`\`

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm test                    # Run unit tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Generate coverage report
\`\`\`

### E2E Tests
\`\`\`bash
npm run test:e2e           # Run end-to-end tests
npx playwright test        # Run with Playwright directly
npx playwright test --ui   # Run with Playwright UI
\`\`\`

### Performance Testing
\`\`\`bash
npm run performance        # Full performance audit
npm run lighthouse         # Lighthouse audit only
\`\`\`

## 📂 Project Structure

\`\`\`
portfolio/
├── .github/workflows/     # GitHub Actions CI/CD
├── src/                   # Source code
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styles
│   └── script.js         # JavaScript
├── tests/                 # Test suites
│   ├── unit/             # Unit tests
│   ├── e2e/              # End-to-end tests
│   └── setup.js          # Test configuration
├── scripts/               # Development scripts
├── dist/                  # Production build
└── docs/                  # Documentation
\`\`\`

## 🔧 Configuration Files

- **ESLint**: `.eslintrc.js` - Code linting rules
- **Prettier**: `.prettierrc` - Code formatting
- **PostCSS**: `postcss.config.js` - CSS processing
- **Jest**: `package.json` - Unit test configuration
- **Playwright**: `playwright.config.js` - E2E test configuration

## 🚀 Deployment

### Automatic Deployment
The project uses GitHub Actions for automatic deployment:

1. **Push to main** → Triggers full CI/CD pipeline
2. **Tests pass** → Builds optimized production files  
3. **Performance checks** → Lighthouse audits
4. **Deploy** → Automatically deploys to staging

### Manual Deployment
\`\`\`bash
npm run build              # Build production files
npm run deploy:staging     # Deploy to staging
npm run deploy:prod        # Deploy to production
\`\`\`

## 📊 Performance Metrics

The project maintains high performance standards:

- **Performance**: 95+ (Lighthouse)
- **Accessibility**: 100 (Lighthouse)  
- **Best Practices**: 95+ (Lighthouse)
- **SEO**: 95+ (Lighthouse)
- **Test Coverage**: 80%+ (Jest)

## 🔍 Code Quality

Automated code quality checks include:

- **ESLint**: JavaScript linting with security rules
- **Prettier**: Consistent code formatting
- **Stylelint**: CSS linting and formatting
- **CodeQL**: Security vulnerability scanning
- **Audit**: Dependency security scanning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Make your changes
4. Run tests (\`npm run validate\`)
5. Commit your changes (\`git commit -m 'Add amazing feature'\`)
6. Push to the branch (\`git push origin feature/amazing-feature\`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Modern web development best practices
- Professional CI/CD pipeline patterns
- Performance optimization techniques
- Accessibility standards (WCAG)
\`\`\`