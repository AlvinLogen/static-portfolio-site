#!/bin/bash

# Setup Git Hooks for Professional Development

echo "Setting up Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "Running pre-commit checks..."

# Stash unstaged changes
git stash -q --keep-index

# Run linting
npm run lint
LINT_EXIT_CODE=$?

# Run tests
npm run test
TEST_EXIT_CODE=$?

# Restore stashed changes
git stash pop -q

# Exit with error if any check failed
if [ $LINT_EXIT_CODE -ne 0 ] || [ $TEST_EXIT_CODE -ne 0 ]; then
  echo "Pre-commit checks failed. Commit aborted."
  exit 1
fi

echo "Pre-commit checks passed!"
EOF

# Pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

echo "Running pre-push checks..."

# Run security audit
npm audit --audit-level moderate
AUDIT_EXIT_CODE=$?

# Run full test suite including E2E
npm run test:coverage
TEST_EXIT_CODE=$?

# Build project to ensure it compiles
npm run build
BUILD_EXIT_CODE=$?

# Exit with error if any check failed
if [ $AUDIT_EXIT_CODE -ne 0 ] || [ $TEST_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "Pre-push checks failed. Push aborted."
  exit 1
fi

echo "Pre-push checks passed!"
EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

echo "Git hooks setup complete!"
echo ""
echo "Hooks installed:"
echo "- pre-commit: Runs linting and tests"
echo "- pre-push: Runs security audit, full tests, and build"
```

**6. Development Scripts (scripts/dev-setup.sh):**
```bash
#!/bin/bash

# Professional Development Environment Setup

echo "Setting up professional development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Git hooks
echo "🔗 Setting up Git hooks..."
chmod +x scripts/setup-git-hooks.sh
./scripts/setup-git-hooks.sh

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p dist
mkdir -p test-results
mkdir -p lighthouse-reports
mkdir -p coverage

# Setup environment files
echo "⚙️ Setting up environment configuration..."
if [ ! -f .env.local ]; then
  cat > .env.local << 'EOF'
# Local Development Configuration
NODE_ENV=development
DEBUG=true
PORT=3000
# Add your local environment variables here
EOF
  echo "Created .env.local file"
fi

# Verify setup
echo "🧪 Running setup verification..."
npm run validate

if [ $? -eq 0 ]; then
  echo "✅ Development environment setup complete!"
  echo ""
  echo "Available commands:"
  echo "  npm start       - Start development server"
  echo "  npm run dev     - Start with file watching"
  echo "  npm run build   - Build for production"
  echo "  npm test        - Run tests"
  echo "  npm run lint    - Check code quality"
  echo "  npm run format  - Format code"
  echo ""
else
  echo "❌ Setup verification failed. Please check the errors above."
  exit 1
fi