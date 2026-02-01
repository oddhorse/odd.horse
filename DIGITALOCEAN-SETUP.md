# DigitalOcean Setup & Testing Guide

Progressive setup guide: get nginx working first, then add production features.

**Note:** This guide assumes you're using **Cloudflare** for DNS/CDN. Production sections cover Cloudflare-specific config.

---

## Phase 1: Minimal Setup - Get nginx Working

Goal: Get your site running on the droplet and test via IP address.

### 1. Create Droplet

- [ ] Go to DigitalOcean → Create Droplet
- [ ] **Image:** Ubuntu 24.04 LTS
- [ ] **Size:** Basic - $6/month (1GB RAM)
- [ ] **Datacenter:** Closest to you (SF, NYC, etc.)
- [ ] **Authentication:** Add your SSH key
- [ ] Wait ~60 seconds for droplet to boot
- [ ] Save droplet IP: `___.___.___.___`

### 2. Initial Server Setup

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install nginx
sudo apt install nginx -y

# Setup firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
# When prompted "Command may disrupt existing ssh connections", type 'y'
```

### 3. Create Web Directory

```bash
# Create directory for your site
sudo mkdir -p /var/www/odd.horse
sudo chown -R $USER:$USER /var/www/odd.horse
sudo chmod -R 755 /var/www/odd.horse
```

### 4. Create Minimal nginx Config

```bash
sudo nano /etc/nginx/sites-available/odd.horse
```

**Paste this minimal config:**

```nginx
server {
    listen 80;
    listen [::]:80;

    # Accept any request (test via IP)
    server_name _;

    root /var/www/odd.horse;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Enable the site:**

```bash
# Enable your site
sudo ln -s /etc/nginx/sites-available/odd.horse /etc/nginx/sites-enabled/

# Remove default nginx page
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. Deploy Your Site Manually

**From your local machine:**

```bash
cd "/Users/bear/Desktop/ODDHORSE SITE"

# Build the site
npm run build

# Deploy to droplet
rsync -avz --delete dist/ root@YOUR_DROPLET_IP:/var/www/odd.horse/
```

### 6. Test It Works!

**Visit in your browser:**

```
http://YOUR_DROPLET_IP/
```

**Checklist:**
- [ ] Homepage loads
- [ ] CSS loads correctly
- [ ] Images load
- [ ] JavaScript works (modals, artifact tracking, etc.)
- [ ] Audio files load
- [ ] All links work

**If it works, you're done with minimal setup!** 🎉

---

## Phase 2: GitHub Actions Deployment

Automate deployments on push to the `digitalocean` branch.

### 1. Add GitHub Secrets

Go to: GitHub repo → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add these three secrets:

- [ ] **`DO_SSH_KEY`** - Your private SSH key
  ```bash
  # Get your private key:
  cat ~/.ssh/id_rsa
  # Copy entire output including BEGIN/END lines
  ```

- [ ] **`DO_SERVER_IP`** - Your droplet IP address
  ```
  Example: 143.198.123.45
  ```

- [ ] **`DO_USER`** - SSH username
  ```
  Probably: root
  ```

### 2. Push the digitalocean Branch

```bash
# Make sure you're on the digitalocean branch
git branch --show-current  # Should say "digitalocean"

# Push to GitHub
git push -u origin digitalocean
```

### 3. Watch Deployment

- [ ] Go to GitHub → Actions tab
- [ ] Watch the workflow run
- [ ] Verify it completes successfully
- [ ] Visit `http://YOUR_DROPLET_IP/` to see deployed site

**Now every push to `digitalocean` branch auto-deploys!**

---

## Phase 3: Testing Checklist

Before switching to production, verify everything works:

### Core Functionality
- [ ] Homepage loads via `http://YOUR_DROPLET_IP/`
- [ ] All pages work (home, treats, shop, 404)
- [ ] CSS loads correctly (no styling issues)
- [ ] Images load
- [ ] Audio files load (for stampede effect)

### Interactive Features
- [ ] Artifact click tracking works
- [ ] NEW badges show on recent items
- [ ] SEEN badges show on clicked items
- [ ] Click tracking persists (localStorage)
- [ ] Modals open (contact, links)
- [ ] Modals close via X button
- [ ] Stampede effect works
- [ ] Chaos hover works on footer buttons
- [ ] Header logo tagline rotation works

### Technical
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive (resize browser window)
- [ ] Page load time acceptable (< 3 seconds)

**If everything works, you're ready for production setup!**

---

## Phase 4: Production Setup

Add SSL, configure for Cloudflare, and switch DNS.

### Step 1: Update nginx for Production

Update your nginx config with Cloudflare support and security headers.

```bash
sudo nano /etc/nginx/sites-available/odd.horse
```

**Replace with this production config:**

```nginx
server {
    listen 80;
    listen [::]:80;

    # Production: accept by domain name
    server_name odd.horse www.odd.horse;

    root /var/www/odd.horse;
    index index.html;

    # Get real visitor IP from Cloudflare (required for accurate logs)
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (Cloudflare caches at edge, so shorter TTL)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ogg|mp3)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;
}
```

**Reload nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 2: Install SSL Certificate

**Install certbot:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate:**

```bash
sudo certbot --nginx -d odd.horse -d www.odd.horse
```

**Prompts:**
- Email: (your email for renewal notices)
- Agree to terms: Y
- Share email with EFF: (your choice)

**Certbot will:**
- Get SSL cert from Let's Encrypt
- Update nginx config automatically
- Enable HTTPS redirect

**Test auto-renewal:**

```bash
sudo certbot renew --dry-run
```

### Step 3: Configure Cloudflare SSL

**In Cloudflare dashboard → SSL/TLS:**

- **SSL/TLS encryption mode:** Full (Strict) ✅
  - Visitor → Cloudflare: HTTPS
  - Cloudflare → Droplet: HTTPS (verified)

- **Always Use HTTPS:** On
- **Automatic HTTPS Rewrites:** On

### Step 4: Switch DNS in Cloudflare

**IMPORTANT: Do this in Cloudflare dashboard, NOT at your domain registrar**

**In Cloudflare dashboard → odd.horse → DNS:**

1. Update A records:
   ```
   Type    Name    IPv4 address        Proxy status
   A       @       YOUR_DROPLET_IP     Proxied (🟠 orange cloud)
   A       www     YOUR_DROPLET_IP     Proxied (🟠 orange cloud)
   ```

2. **Keep proxy status = Proxied** (orange cloud)

3. Save

**DNS propagation:**
- Cloudflare: 1-5 minutes (fast!)
- You'll see Cloudflare IPs when you dig (this is correct - Cloudflare proxies to your droplet)

### Step 5: Test Production

**Visit your site:**

```
https://odd.horse
```

**Checklist:**
- [ ] Site loads via HTTPS
- [ ] SSL certificate valid (green padlock in browser)
- [ ] All features work (run through Phase 3 checklist again)
- [ ] Test from different devices/locations
- [ ] Check mobile

**You're live!** 🎉

---

## Phase 5: Update Main Branch Deployment

Once production is working on the `digitalocean` branch:

### 1. Merge to Main

```bash
git checkout main
git merge digitalocean
git push origin main
```

### 2. Update main.yml Workflow

Edit `.github/workflows/main.yml`:

**Change the rsync line to:**

```yaml
- name: Deploy with rsync
  run: rsync -avz --delete ./dist/ ${{ secrets.DO_USER }}@${{ secrets.DO_SERVER_IP }}:/var/www/odd.horse/
```

**Update secrets used:**
- Change `SSH_KEY` → `DO_SSH_KEY`
- Change `SSH_SERVER` → `DO_SERVER_IP`
- Change `SSH_USER` → `DO_USER`

(Or rename the secrets in GitHub to match)

### 3. Push and Test

```bash
git add .github/workflows/main.yml
git commit -m "Update main workflow for DigitalOcean"
git push origin main
```

**Watch GitHub Actions deploy to production!**

---

## Cloudflare Recommended Settings

Configure these in Cloudflare dashboard for best performance:

### SSL/TLS
- **Encryption mode:** Full (Strict) ✅
- **Always Use HTTPS:** On
- **Automatic HTTPS Rewrites:** On
- **Minimum TLS Version:** 1.2

### Speed
- **Auto Minify:** CSS, JavaScript, HTML (all On)
- **Brotli:** On
- **Rocket Loader:** Off (can break your site)
- **Early Hints:** On

### Caching
- **Caching Level:** Standard
- **Browser Cache TTL:** Respect Existing Headers
- **Always Online:** On

### Security
- **Security Level:** Medium
- **Challenge Passage:** 30 minutes
- **Browser Integrity Check:** On

---

## Rollback Plan

If something goes wrong:

### In Cloudflare Dashboard

1. **DNS → Update A records** back to old server IP
2. Wait 1-2 minutes
3. Test old server works

### Emergency: Disable Cloudflare Proxy

- Click orange cloud → turns gray (DNS only)
- Bypasses Cloudflare while you fix issues

---

## Maintenance Commands

### nginx

```bash
# Test config
sudo nginx -t

# Reload (no downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL

```bash
# Renew certificates (auto, but you can force)
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# List certificates
sudo certbot certificates
```

### System

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check memory
free -h
```

---

## Troubleshooting

### Site shows nginx default page

```bash
# Check if your site is enabled
ls -la /etc/nginx/sites-enabled/

# Should show: odd.horse -> ../sites-available/odd.horse

# If not:
sudo ln -s /etc/nginx/sites-available/odd.horse /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 404 errors

```bash
# Check files exist
ls -la /var/www/odd.horse/

# Check permissions
sudo chown -R www-data:www-data /var/www/odd.horse
sudo chmod -R 755 /var/www/odd.horse
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

---

## Cost Tracking

- [ ] Droplet: $6/month
- [ ] Backups (optional): +$1.20/month
- [ ] Total: ~$6-7/month

vs. Current hosting: $___/month

---

Good luck with the migration! 🐴✨
