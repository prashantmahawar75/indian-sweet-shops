# Deployment Guide - Indian Sweet Shop Management System

## Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

3. **Configure environment variables in Vercel dashboard:**
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `JWT_SECRET` - Secure random string for JWT tokens
   - `NODE_ENV` - Set to "production"

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy using Netlify CLI:**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

### Option 3: Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (Railway will provide this)

### Option 4: Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build and start commands:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

## Environment Variables for Production

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production
PORT=5000
```

## Database Setup for Production

1. **Create production database on Neon:**
   - Go to https://neon.tech
   - Create a new project for production
   - Get the connection string

2. **Push schema to production database:**
   ```bash
   npm run db:push
   ```

3. **Seed production database:**
   ```bash
   npm run seed
   ```

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Authentication works (login/register)
- [ ] Indian sweets are displayed with INR pricing
- [ ] Admin panel accessible
- [ ] All API endpoints responding
- [ ] Environment variables properly set
- [ ] Database connection working
- [ ] HTTPS enabled

## Monitoring and Maintenance

1. **Health Check Endpoint:**
   - Add a `/health` endpoint for monitoring
   
2. **Logging:**
   - Monitor application logs
   - Set up error tracking (e.g., Sentry)

3. **Database Backups:**
   - Configure automatic backups on Neon
   - Regular backup verification

## Performance Optimization

1. **Enable gzip compression**
2. **Set up CDN for static assets**
3. **Configure caching headers**
4. **Monitor response times**

## Security Considerations

1. **HTTPS only in production**
2. **Secure JWT secret**
3. **Database connection over SSL**
4. **Rate limiting for APIs**
5. **Input validation and sanitization**