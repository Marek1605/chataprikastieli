# 🏔️ Chata pri Kaštieli

Premium cabin rental website built with Next.js 14, featuring:
- 🌍 Multi-language support (SK, EN, CS, PL)
- 📅 Real-time availability calendar with iCal sync
- 📧 Contact & booking forms with email notifications
- 🎨 Premium, responsive design
- ⚡ SEO optimized with SSG
- 🎮 **Interactive games to win discounts!**

## 🎮 Interactive Games

The website includes two engaging games that help convert visitors to bookings:

### 🎡 Lucky Wheel (Koleso šťastia)
- Spin the wheel to win discounts (5% - 15%) or a FREE night!
- Email capture before playing
- One play per visitor (localStorage)
- Beautiful animations and mobile-optimized

### 🎫 Scratch Card (Stieracia karta)
- Interactive scratch-to-reveal experience
- Touch-friendly for mobile devices
- Canvas-based scratching with progress indicator
- Same prize pool as Lucky Wheel

**Benefits:**
- ⏱️ Increases time on site (SEO boost)
- 📧 Captures visitor emails
- 💰 Motivates immediate booking with discount
- 🎯 Gamification increases engagement

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Deploy to Coolify

### Step 1: Push to Git Repository

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub/GitLab and push
git remote add origin https://github.com/YOUR_USERNAME/chata-pri-kastieli.git
git push -u origin main
```

### Step 2: Create Application in Coolify

1. Login to your Coolify dashboard
2. Go to **Projects** → **Add New** → **Application**
3. Select **Public Repository** or connect your Git provider
4. Enter your repository URL

### Step 3: Configure Build Settings

In Coolify application settings:

| Setting | Value |
|---------|-------|
| **Build Pack** | Dockerfile |
| **Dockerfile Location** | /Dockerfile |
| **Port** | 3000 |

### Step 4: Add Environment Variables

In Coolify → Your App → **Environment Variables**, add:

```
ICAL_URL_AIRBNB=https://www.airbnb.com/calendar/ical/XXXXX.ics?s=YYYYY
ICAL_URL_BOOKING=https://admin.booking.com/hotel/hoteladmin/ical.html?t=XXXXX
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=info@chataprikastieli.sk
```

### Step 5: Configure Domain

1. Go to **Domains** tab
2. Add your domain: `chataprikastieli.sk`
3. Enable **HTTPS** (Let's Encrypt)

### Step 6: Deploy

Click **Deploy** and wait for the build to complete (~2-3 minutes).

---

## 📧 Email Setup (Resend)

1. Go to [resend.com](https://resend.com) and create account
2. Verify your domain (add DNS records)
3. Create API key
4. Add to Coolify environment variables

### DNS Records for Resend

```
Type: TXT
Name: resend._domainkey
Value: (provided by Resend)
```

---

## 📅 iCal Calendar Sync

### Get Airbnb iCal URL
1. Go to Airbnb → Calendar → Availability settings
2. Find "Export Calendar" → Copy iCal link

### Get Booking.com iCal URL
1. Go to Booking.com Extranet → Calendar
2. Click "Sync calendars" → Export → Copy link

Add both URLs to your environment variables.

---

## 🖼️ Adding Images

Place your images in `/public/assets/`:

```
public/assets/
├── hero.jpg              (1920x1080 recommended)
├── gallery-1.jpg         (800x600)
├── gallery-2.jpg         (400x300)
├── ...
├── gallery-10.jpg
├── experience-1.jpg      (600x800)
├── experience-2.jpg      (600x800)
├── surrounding-1.jpg     (400x300)
├── ...
└── surrounding-8.jpg
```

**Image optimization**: Next.js automatically optimizes images. Use high-quality JPGs.

---

## ⚙️ Configuration

### Site Settings
Edit `/lib/config.ts`:

```typescript
export const siteConfig = {
  name: 'Chata pri Kaštieli',
  domain: 'chataprikastieli.sk',
  email: 'info@chataprikastieli.sk',
  phone: '+421 XXX XXX XXX',
  // ...
};
```

### Pricing
Edit `/lib/config.ts`:

```typescript
export const pricingConfig = {
  offSeason: 85,      // € per night
  season: 95,
  topSeason: 110,
  minNights: {
    default: 2,
    holidays: 3,
  },
  // ...
};
```

---

## 🌍 Translations

Translations are in `/messages/`:
- `sk.json` - Slovak (default)
- `en.json` - English
- `cs.json` - Czech
- `pl.json` - Polish

---

## 📁 Project Structure

```
chata-pri-kastieli/
├── app/
│   ├── [locale]/           # Localized pages
│   │   ├── layout.tsx      # Locale layout with SEO
│   │   └── page.tsx        # Main page
│   ├── api/
│   │   ├── ical/           # iCal proxy (CORS fix)
│   │   ├── booking/        # Booking form handler
│   │   └── contact/        # Contact form handler
│   ├── globals.css
│   └── layout.tsx
├── components/             # React components
├── lib/
│   ├── config.ts          # Site configuration
│   ├── i18n.ts            # Internationalization
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── messages/              # Translation files
├── public/assets/         # Images
├── Dockerfile             # For Coolify
└── package.json
```

---

## 🔧 Troubleshooting

### Images not loading
- Check file exists in `/public/assets/`
- Verify file extension matches (case-sensitive)

### iCal not syncing
- Check URLs in environment variables
- API caches for 20 minutes

### Emails not sending
- Verify Resend API key
- Check domain is verified in Resend
- Check Coolify logs for errors

### Build fails in Coolify
- Check Node version (requires 18+)
- Verify all environment variables are set
- Check Coolify build logs

---

## 📝 License

Private project for Chata pri Kaštieli.

---

## 🆘 Support

For technical issues, check:
1. Coolify logs
2. Browser console
3. API responses in Network tab
