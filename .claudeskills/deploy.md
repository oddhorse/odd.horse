# Deployment Skill

You are preparing the ODDHORSE website for deployment. Follow this careful workflow.

## Pre-Deployment Checklist

Before ANY deployment, verify these conditions:

### 1. Git Status
```bash
git status
```

**Check for:**
- No uncommitted changes (or explain what's uncommitted)
- Current branch is `main` or `beta`
- Branch is up to date with remote
- No untracked files that should be committed

### 2. Production Build
```bash
npm run clean && npm run build
```

**Verify:**
- Build completes without errors
- Check `dist/` folder was created
- Verify key pages exist in dist:
  - `dist/index.html`
  - `dist/assets/css/main.css`
  - `dist/assets/js/main.js`

### 3. Build Output Review
**Check these files in dist:**
- HTML files have minified output
- CSS is processed correctly
- Images are optimized (WebP generated)
- JavaScript modules are copied

**Look for common issues:**
- Missing assets (404 links)
- Broken image references
- Missing CSS imports
- Incorrect permalinks

### 4. Local Testing
```bash
cd dist
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Test these:**
- Homepage loads and looks correct
- Navigation works
- Images load (including optimized WebP)
- CSS colors and layout render properly
- JavaScript features work (navbar hover, modals, etc.)
- All links work
- Responsive design works (test mobile viewport)

## Deployment Commands

After all checks pass, provide deployment commands:

### For MAIN branch (Production)
```bash
# Ensure you're on main
git checkout main

# Pull latest changes
git pull origin main

# Build production
npm run build

# Deploy to production server
# (Replace with actual deployment command)
rsync -avz --delete dist/ user@production-server:/var/www/oddhorse/

# Or if using GitHub Pages:
npm run build-ghpages
git add dist -f
git commit -m "Deploy production build"
git push origin gh-pages
```

### For BETA branch (Staging)
```bash
# Ensure you're on beta
git checkout beta

# Pull latest changes
git pull origin beta

# Build
npm run build

# Deploy to beta server
# (Replace with actual deployment command)
rsync -avz --delete dist/ user@beta-server:/var/www/oddhorse-beta/
```

## Post-Deployment Verification

After deploying, verify on live site:

1. **Homepage loads** - Check main page
2. **Navigation works** - Click all nav links
3. **Assets load** - Check browser console for 404s
4. **Interactive features** - Test navbar, modals, links
5. **Mobile responsive** - Test on mobile device or DevTools
6. **Performance** - Check page load speed
7. **SEO** - Verify meta tags, Open Graph data

## Deployment Safety

**NEVER deploy if:**
- Build has errors
- Tests are failing (if tests exist)
- Uncommitted changes on main/beta
- Haven't tested locally first
- Large file sizes in dist (check for unoptimized images)

**ALWAYS:**
- Deploy main branch to production
- Deploy beta branch to staging/beta server
- Keep main and beta in sync via proper git workflow
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`

## Rollback Procedure

If deployment breaks production:

```bash
# Find previous working commit
git log --oneline

# Revert to that commit
git checkout [commit-hash]

# Rebuild and redeploy
npm run build
# ... deploy command ...

# Or create a revert commit
git revert [bad-commit-hash]
npm run build
# ... deploy command ...
```

## Common Issues

**Build fails:**
- Check Node version (requires 20+)
- Clear caches: `rm -rf node_modules .cache`
- Reinstall: `npm ci`
- Check for syntax errors in templates

**Assets 404 on live site:**
- Check pathPrefix in eleventy.config.js
- Verify asset copying in config
- Check .gitignore isn't excluding dist assets

**Styles not applying:**
- Check CSS import order in main.css
- Verify CSS files copied to dist/assets/css/
- Check for CSS syntax errors

**JavaScript not working:**
- Check module imports are correct
- Verify all .js files copied to dist
- Check browser console for errors

## Output Format

Provide a clear deployment summary:

```markdown
## Deployment Checklist

### ✅ Pre-Deployment Checks
- [x] Git status clean
- [x] Production build successful
- [x] Local testing passed
- [x] All pages verified

### 📦 Ready to Deploy

Branch: [main/beta]
Commit: [hash]
Build time: [X seconds]

### 🚀 Deployment Commands

[Provide specific commands for this deployment]

### 🔍 Post-Deployment Verification

After deploying, check:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] No console errors
- [ ] Mobile responsive
```

## Important

- Be thorough - deployment mistakes are costly
- Always test locally before deploying
- Document what was deployed and when
- If anything seems wrong, STOP and investigate
