import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(CONTENT_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Default content
const defaultContent = {
  texts: {
    'hero.title': 'Únik do ticha pod horami',
    'hero.subtitle': 'Moderný dizajn, absolútne súkromie a nezabudnuteľné zážitky.',
    'hero.badge1': 'Súkromie',
    'hero.badge2': 'Výhľad',
    'hero.badge3': 'Kľud',
    'hero.badge4': 'Self check-in',
    'overview.title': 'Miesto, kde sa zastaví čas',
    'overview.text': 'Chata pri Kaštieli je ukrytá v malebnom prostredí Turca s výhľadom na Malú Fatru.',
    'amenities.title': 'Čo vás u nás čaká',
    'gallery.title': 'Nahliadnite dovnútra',
    'pricing.title': 'Cenník a dostupnosť',
    'reviews.title': 'Čo hovoria naši hostia',
    'faq.title': 'Časté otázky',
    'contact.title': 'Kontakt a poloha',
    'footer.text': '© 2025 Chata pri Kaštieli. Všetky práva vyhradené.',
  },
  images: {
    'hero.bg': '/assets/hero-bg.jpg',
    'overview.img1': '/assets/gallery-1.jpg',
    'overview.img2': '/assets/gallery-2.jpg',
  },
  gallery: [
    { id: 'g1', url: '/assets/gallery-1.jpg', alt: 'Interiér', category: 'interior', order: 0 },
    { id: 'g2', url: '/assets/gallery-2.jpg', alt: 'Interiér 2', category: 'interior', order: 1 },
    { id: 'g3', url: '/assets/gallery-3.jpg', alt: 'Exteriér', category: 'exterior', order: 2 },
    { id: 'g4', url: '/assets/gallery-4.jpg', alt: 'Exteriér 2', category: 'exterior', order: 3 },
  ],
  reviews: [
    { id: 'r1', name: 'Martin K.', rating: 5, text: 'Nádherné miesto, úplný pokoj. Určite sa vrátime!', date: '2024-12', source: 'Airbnb' },
  ],
  faq: [
    { id: 'f1', question: 'Aký je čas príchodu a odchodu?', answer: 'Check-in je od 15:00, check-out do 10:00.', order: 0 },
  ],
  pricing: [
    { id: 'p1', name: 'Hlavná sezóna', dateFrom: '2025-06-15', dateTo: '2025-09-15', pricePerNight: 120, minNights: 2, color: '#e74c3c' },
    { id: 'p2', name: 'Mimo sezónu', dateFrom: '2025-01-01', dateTo: '2025-06-14', pricePerNight: 89, minNights: 1, color: '#3498db' },
  ],
  contact: {
    phone: '+421 900 000 000',
    email: 'info@chataprikastieli.sk',
    address: 'Necpaly, okres Martin, Slovensko',
    mapUrl: '',
    instagram: '',
    facebook: '',
    airbnb: '',
    bookingCom: '',
  },
  seo: {
    title: 'Chata pri Kaštieli | Luxusné ubytovanie v Turci',
    description: 'Moderná chata s výhľadom na Malú Fatru.',
    keywords: 'chata Turiec, ubytovanie Malá Fatra',
    ogImage: '/assets/og.jpg',
  },
  settings: {
    maxGuests: 6,
    checkInTime: '15:00',
    checkOutTime: '10:00',
    currency: 'EUR',
    defaultLang: 'sk',
    maintenanceMode: false,
    bookingEnabled: true,
  },
};

function verifyAuth(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-token');
  return auth === ADMIN_PASSWORD;
}

// GET - load content
export async function GET(req: NextRequest) {
  // No auth needed for reading (frontend needs it)
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONTENT_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    // File doesn't exist yet, return defaults
    return NextResponse.json(defaultContent);
  }
}

// PUT - save content
export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Basic validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Merge with defaults to ensure structure
    const content = { ...defaultContent, ...body };

    // Sanitize texts (strip script tags)
    if (content.texts) {
      for (const key of Object.keys(content.texts)) {
        if (typeof content.texts[key] === 'string') {
          content.texts[key] = content.texts[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '');
        }
      }
    }

    await ensureDataDir();

    // Backup previous version
    try {
      const existing = await fs.readFile(CONTENT_FILE, 'utf-8');
      const backupPath = CONTENT_FILE.replace('.json', `-backup-${Date.now()}.json`);
      await fs.writeFile(backupPath, existing, 'utf-8');
      
      // Keep only last 5 backups
      const dir = path.dirname(CONTENT_FILE);
      const files = await fs.readdir(dir);
      const backups = files
        .filter(f => f.startsWith('site-content-backup-'))
        .sort()
        .reverse();
      for (const old of backups.slice(5)) {
        await fs.unlink(path.join(dir, old)).catch(() => {});
      }
    } catch {
      // No previous file, that's OK
    }

    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error('Admin save error:', err);
    return NextResponse.json({ error: err.message || 'Save failed' }, { status: 500 });
  }
}
