# DigitalOcean Setup & Testing Guide

Testing infrastructure on the `digitalocean` branch before switching DNS.

---

## Phase 1: Initial Droplet Setup

### 1. Create Droplet

- [ ] Create $6/month Ubuntu 24.04 droplet
- [ ] Save droplet IP address: `___.___.___.___`
- [ ] Add your SSH key during creation
- [ ] Wait for droplet to boot (~60 seconds)

### 2. Initial Server Setup

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install nginx
sudo apt install nginx -y

# Install Node.js (if adding backend later)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (if adding backend later)
sudo npm install -g pm2

# Setup firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 3. Create Web Directories

```bash
# Create directory for test site
sudo mkdir -p /var/www/test.odd.horse
sudo chown -R $USER:$USER /var/www/test.odd.horse
sudo chmod -R 755 /var/www/test.odd.horse

# If adding backend later
sudo mkdir -p /srv/oddhorse-test
sudo chown -R $USER:$USER /srv/oddhorse-test
```

### 4. Configure nginx

Create test site config:
```bash
sudo nano /etc/nginx/sites-available/test.odd.horse
```

Paste this config:
```nginx
server {
    listen 80;
    listen [::]:80;

    # Accept requests by IP or test subdomain
    server_name YOUR_DROPLET_IP test.odd.horse;

    root /var/www/test.odd.horse;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ogg|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/test.odd.horse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Phase 2: GitHub Actions Setup

### 1. Add GitHub Secrets

Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add these secrets:
- [ ] `DO_SSH_KEY` - Your private SSH key for the droplet
- [ ] `DO_SERVER_IP` - Your droplet IP address
- [ ] `DO_USER` - SSH username (probably `root` or your username)

**Get your SSH key:**
```bash
# On your local machine
cat ~/.ssh/id_rsa
# Copy the entire output (including BEGIN/END lines)
```

### 2. Push digitalocean Branch

```bash
# Make sure you're on the branch
git branch --show-current  # Should say "digitalocean"

# Commit the workflow file
git add .github/workflows/digitalocean-test.yml
git add DIGITALOCEAN-SETUP.md
git commit -m "Add DigitalOcean test deployment workflow"

# Push to GitHub
git push -u origin digitalocean
```

### 3. Trigger Deployment

- [ ] Go to GitHub Actions tab
- [ ] Watch the workflow run
- [ ] Verify it completes successfully

---

## Phase 3: Testing (Before DNS Switch)

### Test via IP Address

Visit your site using the droplet IP:
```
http://YOUR_DROPLET_IP/
```

**Checklist:**
- [ ] Homepage loads
- [ ] CSS loads correctly
- [ ] Images load
- [ ] Audio files load (for stampede, etc.)
- [ ] JavaScript works (artifact tracking, modals, etc.)
- [ ] All links work
- [ ] Mobile responsive (resize browser)

### Test via test.odd.horse (Optional)

If you want to use a subdomain for testing:

**Add DNS record:**
```
Type    Name    Value               TTL
A       test    YOUR_DROPLET_IP     3600
```

Wait 5 minutes, then visit:
```
http://test.odd.horse/
```

**Optional: Add SSL for test subdomain:**
```bash
# On droplet
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d test.odd.horse
```

Then visit:
```
https://test.odd.horse/
```

---

## Phase 4: Backend Testing (Optional)

If you're adding Express backend:

### 1. Create server.js

On your local machine in the project root:
```bash
nano server.js
```

```javascript
/**
 * server.js - Express backend for odd.horse
 */
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    environment: 'test'
  })
})

// Serve static 11ty build
app.use(express.static(path.join(__dirname, 'dist')))

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🐴 oddhorse server running on port ${PORT}`)
})
```

### 2. Update package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "npm run build && node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### 3. Test Locally

```bash
npm install
npm run build
npm start

# Visit http://localhost:3000
# Test http://localhost:3000/api/health
```

### 4. Deploy Backend

Uncomment the backend sections in `.github/workflows/digitalocean-test.yml` and push:

```bash
git add server.js package.json
git commit -m "Add Express backend for testing"
git push
```

### 5. Update nginx for Backend

On droplet, edit the nginx config:
```bash
sudo nano /etc/nginx/sites-available/test.odd.horse
```

Add BEFORE the `location /` block:
```nginx
    # Proxy API requests to Express
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
```

Reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Test Backend

```bash
# Test health endpoint
curl http://YOUR_DROPLET_IP/api/health

# Should return:
# {"status":"ok","timestamp":1234567890,"environment":"test"}
```

---

## Phase 5: Performance Testing

### Load Time Test

```bash
# Test page load time
curl -w "@-" -o /dev/null -s http://YOUR_DROPLET_IP/ <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### Browser DevTools

- [ ] Open browser DevTools (F12)
- [ ] Network tab → Reload page
- [ ] Check total load time
- [ ] Verify all assets load (no 404s)
- [ ] Check file sizes

---

## Phase 6: Final Checklist Before DNS Switch

- [ ] Site loads via droplet IP
- [ ] All pages work (home, treats, shop, 404)
- [ ] All interactive features work:
  - [ ] Artifact click tracking
  - [ ] Modals (contact, links)
  - [ ] Stampede effect
  - [ ] Chaos hover
  - [ ] Header logo tagline rotation
  - [ ] Audio playback
- [ ] Mobile responsive (test on phone or resize browser)
- [ ] No console errors in browser
- [ ] Backend API works (if applicable)
- [ ] SSL certificate ready (certbot installed)
- [ ] Performance acceptable (load time < 3 seconds)

---

## Phase 7: Switch to Production

Once everything works on the test branch:

### 1. Merge to Main

```bash
git checkout main
git merge digitalocean
git push origin main
```

### 2. Update Production Workflow

Update `.github/workflows/main.yml` to deploy to DigitalOcean:
```yaml
# Change rsync target from old server to DO
rsync -avz --delete ./dist/ ${{ secrets.DO_USER }}@${{ secrets.DO_SERVER_IP }}:/var/www/odd.horse/
```

### 3. Setup Production nginx Config

On droplet:
```bash
sudo nano /etc/nginx/sites-available/odd.horse
```

Same config as test, but with production domain:
```nginx
server_name odd.horse www.odd.horse;
root /var/www/odd.horse;
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/odd.horse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup Production SSL

```bash
sudo certbot --nginx -d odd.horse -d www.odd.horse
```

### 5. Switch DNS

At your domain registrar:
```
Type    Name    Value                   TTL
A       @       YOUR_DROPLET_IP         3600
A       www     YOUR_DROPLET_IP         3600
```

### 6. Wait for DNS Propagation

```bash
# Check DNS (takes 5-60 minutes)
dig odd.horse

# When it shows your droplet IP, you're live!
```

### 7. Test Production

- [ ] Visit https://odd.horse
- [ ] Run through all tests again
- [ ] Verify SSL certificate is valid
- [ ] Check from different devices/locations

---

## Rollback Plan

If something goes wrong after DNS switch:

```bash
# At domain registrar, point DNS back to old server
# Wait 5-10 minutes for DNS to propagate back
```

---

## Maintenance Commands

**View nginx logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Restart services:**
```bash
sudo systemctl restart nginx
pm2 restart oddhorse-test
```

**View PM2 logs:**
```bash
pm2 logs oddhorse-test
pm2 list
```

**Update SSL:**
```bash
sudo certbot renew --dry-run  # Test renewal
sudo certbot renew            # Actually renew
```

---

## Cost Tracking

- [ ] Droplet: $6/month
- [ ] Backups (optional): +$1.20/month
- [ ] Total: ~$6-7/month

Compare to current hosting: $___/month

---

Good luck with the migration! 🐴✨
