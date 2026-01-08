# Contract Companion - Deployment Guide

## 🌐 Deploy to Production

This guide covers deploying Contract Companion to various hosting platforms.

---

## Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Contract Companion"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add: `GATEWAYZ_API_KEY` = your_api_key
   - Available for: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes
   - Get a URL like: `contract-companion.vercel.app`

### Automatic Deployments
- Every push to `main` triggers a production deployment
- Pull requests get preview deployments

---

## Option 2: Netlify

### Steps:

1. **Build Configuration**
   - Build command: `npm run build` or `bun run build`
   - Publish directory: `.next`
   - Next.js runtime plugin required

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Environment Variables**
   - Netlify Dashboard → Site Settings → Environment
   - Add `GATEWAYZ_API_KEY`

---

## Option 3: Docker

### Dockerfile (Already included)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Deploy Steps:

1. **Build Docker Image**
   ```bash
   docker build -t contract-companion .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e GATEWAYZ_API_KEY=your_key_here \
     contract-companion
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - GATEWAYZ_API_KEY=${GATEWAYZ_API_KEY}
   ```

---

## Option 4: AWS (EC2 + PM2)

### Steps:

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - t2.small or larger recommended
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Setup Server**
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Clone your repo
   git clone YOUR_REPO_URL
   cd contract-companion

   # Install dependencies
   npm install

   # Build
   npm run build

   # Create .env file
   echo "GATEWAYZ_API_KEY=your_key" > .env

   # Start with PM2
   pm2 start npm --name "contract-companion" -- start
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/contract-companion
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/contract-companion /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Option 5: DigitalOcean App Platform

### Steps:

1. **Connect Repository**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub repo

2. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000

3. **Environment Variables**
   - Add `GATEWAYZ_API_KEY` in app settings

4. **Deploy**
   - Click "Deploy"
   - Get a `.ondigitalocean.app` domain

---

## Environment Variables for Production

Ensure these are set in your production environment:

```env
GATEWAYZ_API_KEY=your_production_api_key
NODE_ENV=production
```

Optional optimizations:
```env
NEXT_TELEMETRY_DISABLED=1
```

---

## Pre-Deployment Checklist

- [ ] Test the application locally with `npm run build && npm start`
- [ ] Verify `.env` contains valid API keys
- [ ] Ensure all dependencies are in `package.json`
- [ ] Test with sample contracts
- [ ] Check error handling for API failures
- [ ] Verify UI is responsive on mobile devices
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Review API usage limits for Gatewayz
- [ ] Set up monitoring/logging (optional but recommended)

---

## Post-Deployment

### 1. Test Your Deployment
```bash
# Health check
curl https://your-domain.com

# Test with a contract
# Use browser or API client
```

### 2. Monitor Performance
- Check response times
- Monitor API usage (Gatewayz dashboard)
- Set up error tracking (Sentry, LogRocket, etc.)

### 3. Set Up Analytics (Optional)
- Google Analytics
- Plausible Analytics
- Vercel Analytics

### 4. Custom Domain (if needed)
- Update DNS settings
- Point A/CNAME records to your hosting provider
- Wait for DNS propagation (can take 24-48 hours)

---

## Optimization Tips

### 1. Performance
```javascript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
```

### 2. Caching
- Enable CDN caching for static assets
- Consider Redis for API response caching

### 3. Rate Limiting
Consider adding rate limiting to prevent abuse:
```typescript
// Example with next-rate-limit
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});
```

### 4. Security Headers
```javascript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
};
```

---

## Troubleshooting Production Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading
- Check variable names (exact match required)
- Restart application after adding variables
- Verify no typos in `.env` file

### API Calls Failing
- Verify `GATEWAYZ_API_KEY` is set
- Check API usage limits
- Review server logs for detailed errors

### High Response Times
- Upgrade server resources
- Implement caching
- Use CDN for static assets
- Optimize database queries (if applicable)

---

## Cost Estimates

### Vercel (Recommended for small-medium apps)
- **Hobby**: Free (limited usage)
- **Pro**: $20/month
- Includes: Hosting, SSL, CDN, Analytics

### AWS EC2
- **t2.micro**: Free tier (1 year)
- **t2.small**: ~$17/month
- Additional: Elastic IP, data transfer

### DigitalOcean
- **Basic Droplet**: $6-12/month
- **App Platform**: $5-12/month
- Includes: SSL, monitoring

### Gatewayz API Costs
- Pay-per-use based on tokens
- Monitor usage in dashboard
- Typical cost per contract analysis: $0.01-0.10

---

## Scaling Considerations

### For High Traffic:
1. Use a CDN (Cloudflare, AWS CloudFront)
2. Implement Redis caching
3. Use load balancers
4. Horizontal scaling with multiple instances
5. Optimize database queries
6. Consider serverless for API routes

### For Enterprise:
1. Separate frontend and backend
2. Use message queues for async processing
3. Implement comprehensive logging
4. Set up alerts and monitoring
5. Multi-region deployment
6. Disaster recovery plan

---

## Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor API usage and costs
- Review error logs weekly
- Backup data regularly
- Test new Next.js versions in staging

### Security Updates
- Run `npm audit` regularly
- Update critical dependencies immediately
- Review Dependabot alerts (GitHub)
- Keep Node.js version updated

---

**Ready to deploy! 🚀**

For specific deployment issues, check the hosting provider's documentation or contact their support.
