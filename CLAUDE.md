# CLAUDE.md - AI Assistant Guide for Chata pri Kaštieli

This document provides comprehensive guidance for AI assistants working with the Chata pri Kaštieli codebase - a premium cabin rental website with gamification features.

## Project Overview

**Chata pri Kaštieli** is a modern cabin rental website built with Next.js 14 (App Router). The site features multi-language support (SK, EN, CS, PL), interactive booking with real-time calendar sync, engaging games for visitor retention, and an admin CMS for content management.

### Key Business Features
- Multi-language cabin rental website (4 languages)
- Real-time booking calendar synced with Airbnb/Booking.com via iCal
- Email notifications for booking inquiries and contact forms
- Interactive games: Memory (Pexeso), Nature Quiz, Snake
- Admin CMS for inline content editing
- Dynamic pricing (off-season, season, top-season + holidays)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.21 (App Router, SSR) |
| Language | TypeScript 5.7.3 |
| UI | React 18.3.1 |
| Styling | Tailwind CSS 3.4.17 |
| i18n | next-intl 3.26.3 |
| Email | Resend 4.1.2 |
| Runtime | Node.js 20 |
| Deployment | Docker / Coolify |

## Directory Structure

```
chataprikastieli/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Locale-based routing (sk|en|cs|pl)
│   │   ├── layout.tsx        # Locale metadata + SEO
│   │   └── page.tsx          # Home page (assembles components)
│   ├── api/                  # API routes
│   │   ├── booking/route.ts  # Booking form → Resend email
│   │   ├── contact/route.ts  # Contact form → Resend email
│   │   └── ical/route.ts     # iCal calendar sync
│   ├── admin/                # Admin CMS pages
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global Tailwind styles
│
├── components/               # React components (22 files)
│   ├── Navigation.tsx        # Header + mobile menu + language selector
│   ├── Hero.tsx              # Hero section
│   ├── Gallery.tsx           # Image gallery with lightbox
│   ├── Booking.tsx           # Calendar + booking form
│   ├── GameHub.tsx           # Game selector (dynamic imports)
│   ├── MemoryGame.tsx        # 2-player Pexeso
│   ├── NatureQuiz.tsx        # Nature trivia game
│   ├── SnakeGame.tsx         # Snake game
│   ├── EditableText.tsx      # Admin inline editing
│   └── ...                   # Other UI components
│
├── lib/                      # Business logic & utilities
│   ├── config.ts             # Site configuration (pricing, images, FAQs)
│   ├── types.ts              # TypeScript interfaces
│   ├── i18n.ts               # i18n setup
│   ├── utils.ts              # Utility functions
│   └── AdminContext.tsx      # Admin state (React Context)
│
├── messages/                 # Translation files
│   ├── sk.json               # Slovak (default)
│   ├── en.json               # English
│   ├── cs.json               # Czech
│   └── pl.json               # Polish
│
├── public/                   # Static assets
│   └── assets/               # Images (hero, gallery, etc.)
│
├── middleware.ts             # next-intl locale middleware
├── next.config.js            # Next.js config (standalone output)
├── tailwind.config.ts        # Tailwind theme customization
├── Dockerfile                # Multi-stage production build
└── package.json              # Dependencies & scripts
```

## Quick Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)

# Build & Production
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint

# Docker
docker build -t chata .  # Build Docker image
docker run -p 3000:3000 -e RESEND_API_KEY=... chata
```

## Environment Variables

Required in `.env.local`:

```bash
ICAL_URL_AIRBNB=         # Airbnb calendar iCal URL
ICAL_URL_BOOKING=        # Booking.com calendar iCal URL
RESEND_API_KEY=          # Resend API key for emails
CONTACT_EMAIL=           # Destination email for inquiries
```

## Code Conventions

### Component Patterns

**Server vs Client Components:**
```typescript
// Server components (default) - no directive needed
export default function Page() { ... }

// Client components - must have directive
'use client';
export default function InteractiveComponent() { ... }
```

**Dynamic Imports for Games:**
```typescript
const MemoryGame = dynamic(() => import('./MemoryGame'), {
  loading: () => <GameLoading />
});
```

**Context Hook Pattern:**
```typescript
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
```

### TypeScript Conventions

- All interfaces defined in `lib/types.ts`
- Use strict types (no `any`)
- Generic types for API responses:
```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Styling Conventions

**Tailwind-first approach (no CSS modules):**
```typescript
className="px-4 py-3 rounded-lg bg-wood text-white hover:bg-wood-dark transition-all"
```

**Conditional classes with `cn()` utility:**
```typescript
import { cn } from '@/lib/utils';
className={cn(
  'base-styles',
  isActive && 'active-styles',
  variant === 'primary' ? 'primary-styles' : 'secondary-styles'
)}
```

**Custom Theme Colors:**
- `graphite` (#2C2C2C) - Primary text
- `wood` (#8B7355) - Accent/CTA buttons
- `cream` (#F5F0E8) - Backgrounds
- `success`, `error`, `booked`, `selected` - State colors

**Font Families:**
- Display: `font-display` (Cormorant Garamond)
- Body: `font-body` (DM Sans)

### Internationalization (i18n)

**Translation files:** `messages/{locale}.json`

**Component usage:**
```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

**Supported locales:** `sk` (default), `en`, `cs`, `pl`

**Adding translations:** Update all 4 JSON files with matching keys.

### Form Handling Pattern

```typescript
const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  gdprConsent: false,
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!formData.email || !isValidEmail(formData.email)) {
    setError('Invalid email');
    return;
  }

  // API call
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  if (result.success) {
    // Success handling
  }
};
```

### API Route Pattern

```typescript
// app/api/endpoint/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.requiredField) {
      return NextResponse.json(
        { success: false, error: 'Missing required field' },
        { status: 400 }
      );
    }

    // Business logic
    // ...

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/config.ts` | All site configuration (pricing, gallery, FAQs, amenities) |
| `lib/types.ts` | TypeScript interfaces and types |
| `lib/utils.ts` | Utility functions (date formatting, pricing calculations, validation) |
| `lib/AdminContext.tsx` | Admin state management with localStorage persistence |
| `components/Booking.tsx` | Complex booking calendar and form (~400 lines) |
| `components/Navigation.tsx` | Header with mobile menu and language selector (~425 lines) |
| `app/[locale]/layout.tsx` | SEO metadata and structured data |
| `middleware.ts` | Locale detection and routing |

## Common Tasks

### Adding a New Component

1. Create file in `components/` directory
2. Use `'use client'` if component needs interactivity
3. Import translations with `useTranslations` if needed
4. Follow existing patterns (see similar components)

### Adding a New Translation Key

1. Add key to `messages/sk.json` (Slovak - primary)
2. Add same key with translations to `en.json`, `cs.json`, `pl.json`
3. Use nested structure for namespacing: `"namespace": { "key": "value" }`

### Modifying Pricing

Edit `lib/config.ts`:
```typescript
export const pricingConfig = {
  offSeason: { pricePerNight: 189, minNights: 2 },
  season: { pricePerNight: 219, minNights: 2 },
  topSeason: { pricePerNight: 249, minNights: 3 },
  holidays: { pricePerNight: 269, minNights: 3 },
  // Season dates and holiday definitions...
};
```

### Adding Gallery Images

1. Add image to `public/assets/` (e.g., `gallery-11.jpg`)
2. Update `galleryImages` array in `lib/config.ts`:
```typescript
{ src: '/assets/gallery-11.jpg', alt: 'Description' }
```

### Creating a New API Route

1. Create directory: `app/api/routename/`
2. Create `route.ts` with exported HTTP method handlers
3. Follow existing patterns (see `app/api/booking/route.ts`)

## Deployment

### Coolify (Recommended)

1. Push code to Git repository
2. Create application in Coolify with:
   - Build Pack: Dockerfile
   - Port: 3000
3. Add environment variables
4. Configure domain with HTTPS
5. Deploy

### Docker Manual

```bash
docker build -t chata-kastieli .
docker run -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e CONTACT_EMAIL=email@example.com \
  chata-kastieli
```

## Security Notes

- **Admin password** is currently hardcoded in `AdminContext.tsx` (`chata2024`) - consider moving to environment variable for production
- Form validation exists on both frontend and backend
- GDPR consent checkbox required on all forms
- Resend API key must be kept secret (use environment variables)

## Testing

No automated tests currently configured. When adding tests:
- Use Jest + React Testing Library
- Add test scripts to `package.json`
- Focus on: utility functions, form validation, API routes

## Performance Optimizations

- **Dynamic imports** for game components (code splitting)
- **Next.js Image** component with AVIF/WebP optimization
- **API caching** (5 minutes with stale-while-revalidate)
- **Standalone output** for smaller Docker images
- **Tailwind CSS** (no runtime CSS-in-JS overhead)

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct
- Ensure all translation keys exist in all locale files

### Emails Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for API status
- Review API route error logs

### Calendar Not Syncing
- Verify `ICAL_URL_AIRBNB` and `ICAL_URL_BOOKING` are valid
- Check that URLs are publicly accessible
- Review `/api/ical` endpoint logs

### Locale Issues
- Ensure `middleware.ts` is configured correctly
- Check browser language settings
- Verify translation files have matching keys
