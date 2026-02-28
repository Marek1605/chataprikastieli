import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';
const DATA_DIR = '/tmp/data';
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');

function verifyAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// GET - load content (no auth)
export async function GET() {
  try {
    await ensureDir();
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

// POST - save content (auth required)
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    await ensureDir();

    // Backup
    try {
      const existing = await fs.readFile(CONTENT_FILE, 'utf-8');
      await fs.writeFile(CONTENT_FILE.replace('.json', `-bak-${Date.now()}.json`), existing);
      // Keep last 5 backups
      const files = await fs.readdir(DATA_DIR);
      const baks = files.filter(f => f.includes('-bak-')).sort().reverse();
      for (const old of baks.slice(5)) {
        await fs.unlink(path.join(DATA_DIR, old)).catch(() => {});
      }
    } catch {}

    await fs.writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), 'utf-8');
    console.log('Content saved:', new Date().toISOString());
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Save error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - alias pre POST (backward compat)
export async function PUT(req: NextRequest) {
  return POST(req);
}
