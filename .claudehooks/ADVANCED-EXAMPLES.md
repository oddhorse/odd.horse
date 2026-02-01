# Advanced Claude Code Hook Examples

Beyond basic dev server management, hooks can automate many development workflows.

## Pre-Commit Validation Hook

**Scenario:** Ensure code quality before allowing commits

```bash
#!/usr/bin/env bash
# .claudehooks/PreCommit

# Run linting
echo "Running linters..."
npm run lint || {
    echo "❌ Linting failed. Fix errors before committing."
    exit 1
}

# Run tests
echo "Running tests..."
npm test || {
    echo "❌ Tests failed. Fix tests before committing."
    exit 1
}

# Check for console.logs in production code
if grep -r "console\.log" src/ --exclude-dir=node_modules; then
    echo "⚠️  Warning: console.log found in source code"
    echo "Remove debug statements before committing to main"
fi

# Check for large files
find . -type f -size +5M ! -path "./node_modules/*" ! -path "./.git/*" | while read file; do
    echo "⚠️  Large file detected: $file"
done

echo "✓ Pre-commit checks passed"
```

## Auto-Format Hook

**Scenario:** Automatically format code at session start

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

# Auto-format CSS files
echo "Formatting CSS files..."
npx prettier --write "src/assets/css/**/*.css"

# Auto-format JavaScript
echo "Formatting JavaScript files..."
npx prettier --write "src/assets/js/**/*.js"

# Auto-format templates
echo "Formatting Nunjucks templates..."
npx prettier --write "src/**/*.njk"

echo "✓ Code formatting complete"
```

## Dependency Health Check Hook

**Scenario:** Alert about outdated or vulnerable dependencies

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

# Check for security vulnerabilities
echo "Checking for security vulnerabilities..."
npm audit --audit-level=moderate || {
    echo "⚠️  Security vulnerabilities found. Run 'npm audit fix'"
}

# Check for outdated packages
echo "Checking for outdated packages..."
npm outdated || true

# Check if node_modules is in sync with package.json
if [ package.json -nt node_modules ]; then
    echo "⚠️  package.json is newer than node_modules"
    echo "Run 'npm install' to sync dependencies"
fi
```

## Build Validation Hook

**Scenario:** Ensure production build succeeds before ending session

```bash
#!/usr/bin/env bash
# .claudehooks/SessionEnd

# Only run on main/beta branches
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" == "main" || "$BRANCH" == "beta" ]]; then
    echo "Running production build validation..."

    # Clean build
    npm run clean

    # Production build
    npm run build || {
        echo "❌ Production build failed!"
        echo "Fix build errors before pushing to $BRANCH"
        exit 1
    }

    echo "✓ Production build successful"
fi
```

## Git Status Hook

**Scenario:** Show uncommitted changes at session start

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

echo "Git Status:"
git status --short

# Check for unpushed commits
UNPUSHED=$(git log --branches --not --remotes --oneline)
if [ -n "$UNPUSHED" ]; then
    echo ""
    echo "⚠️  Unpushed commits:"
    echo "$UNPUSHED"
fi

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED" ]; then
    echo ""
    echo "Untracked files:"
    echo "$UNTRACKED"
fi
```

## Environment Setup Hook

**Scenario:** Ensure development environment is configured

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

# Check Node version
REQUIRED_NODE="20"
CURRENT_NODE=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$CURRENT_NODE" -lt "$REQUIRED_NODE" ]; then
    echo "⚠️  Node.js version $CURRENT_NODE detected"
    echo "This project requires Node $REQUIRED_NODE+"
fi

# Check for required env variables
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "Copy .env.example to .env and configure"
fi

# Check for required global tools
command -v gh >/dev/null 2>&1 || {
    echo "⚠️  GitHub CLI (gh) not found"
    echo "Install with: brew install gh"
}
```

## Performance Monitoring Hook

**Scenario:** Track build performance over time

```bash
#!/usr/bin/env bash
# .claudehooks/SessionEnd

# Run production build and time it
echo "Measuring build performance..."
START_TIME=$(date +%s)

npm run build > /dev/null 2>&1

END_TIME=$(date +%s)
BUILD_TIME=$((END_TIME - START_TIME))

# Log build time
echo "$(date -Iseconds),$BUILD_TIME" >> .build-times.csv

echo "Build completed in ${BUILD_TIME}s"

# Show performance trend (last 10 builds)
if [ -f .build-times.csv ]; then
    echo "Recent build times:"
    tail -10 .build-times.csv | awk -F',' '{print $2"s"}'
fi
```

## Smart Cache Invalidation Hook

**Scenario:** Clear caches when dependencies change

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

# Check if package-lock.json changed
if git diff HEAD@{1} HEAD --name-only | grep -q "package-lock.json"; then
    echo "Dependencies changed, clearing caches..."

    # Clear npm cache
    rm -rf node_modules/.cache

    # Clear Eleventy cache
    rm -rf .cache

    # Reinstall to be safe
    npm ci

    echo "✓ Caches cleared and dependencies reinstalled"
fi
```

## Conditional Hooks Based on Branch

**Scenario:** Different behavior for different branches

```bash
#!/usr/bin/env bash
# .claudehooks/SessionStart

BRANCH=$(git branch --show-current)

case "$BRANCH" in
    main)
        echo "📍 On MAIN branch - extra safety checks enabled"
        # Run more rigorous checks
        npm run lint
        npm run test
        npm run build
        ;;
    beta)
        echo "📍 On BETA branch - running standard checks"
        npm run build
        ;;
    feature/*)
        echo "📍 On FEATURE branch - fast feedback mode"
        # Skip heavy checks for faster iteration
        ;;
esac
```

## Screenshot Archiving Hook

**Scenario:** Auto-capture screenshots before major changes

```bash
#!/usr/bin/env bash
# .claudehooks/PreCommit (when using Claude Chrome integration)

# Check if significant CSS/layout files changed
CHANGED_FILES=$(git diff --cached --name-only)

if echo "$CHANGED_FILES" | grep -qE "\.(css|njk)$"; then
    echo "Layout files changed - archiving screenshots..."

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    SCREENSHOT_DIR=".screenshots/$TIMESTAMP"

    mkdir -p "$SCREENSHOT_DIR"

    # Note: This requires Chrome integration and manual screenshot
    # In practice, you'd ask Claude to take screenshots before committing
    echo "⚠️  Remember to capture screenshots before committing layout changes"
    echo "Screenshots should be saved to: $SCREENSHOT_DIR"
fi
```

## Usage Tips

1. **Combine hooks**: SessionStart can run multiple checks
2. **Exit codes matter**: `exit 1` stops the session, `exit 0` continues
3. **Performance**: Keep hooks fast (<5 seconds) for good UX
4. **Idempotency**: Hooks should be safe to run multiple times
5. **User feedback**: Always echo what the hook is doing

## Hook Naming Convention

- `SessionStart` - Runs at session beginning
- `SessionEnd` - Runs at session end
- `PreCommit` - Runs before git commits (if configured)
- `PostCommit` - Runs after successful commit
- Custom names: Create your own, call them manually

## Testing Hooks

```bash
# Test individually
./.claudehooks/SessionStart

# Test with timing
time ./.claudehooks/SessionStart

# Test error handling
bash -x ./.claudehooks/SessionStart  # Debug mode
```
