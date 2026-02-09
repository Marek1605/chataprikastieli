import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

async function getUploadDir(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), 'public', 'uploads'),
    '/tmp/uploads',
  ];
  for (const dir of candidates) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const testFile = path.join(dir, '.write-test');
      await fs.writeFile(testFile, 'ok');
      await fs.unlink(testFile);
      return dir;
    } catch { continue; }
  }
  throw new Error('Ziadny zapisovatelny priecinok');
}

function getPublicUrl(uploadDir: string, filename: string): string {
  if (uploadDir.includes('public/uploads')) return '/uploads/' + filename;
  return '/api/admin-upload?f=' + filename;
}

const MAGIC: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

function verifyAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const uploadDir = await getUploadDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'Ziadny subor' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Nepovoleny typ: ' + file.type }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Prilis velky subor (max 10MB)' }, { status: 400 });

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return NextResponse.json({ error: 'Nepovolena pripona' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const magic = MAGIC[file.type];
    if (magic && !magic.every((b, i) => buf[i] === b)) {
      return NextResponse.json({ error: 'Subor nie je platny obrazok' }, { status: 400 });
    }

    const hash = crypto.randomBytes(8).toString('hex');
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const filename = Date.now() + '-' + hash + '-' + safe;
    await fs.writeFile(path.join(uploadDir, filename), buf);

    const url = getPublicUrl(uploadDir, filename);
    console.log('[Upload] OK:', filename, (file.size/1024).toFixed(0) + 'KB', '->', url);

    return NextResponse.json({ success: true, url, filename, size: file.size });
  } catch (err: any) {
    console.error('[Upload] Error:', err);
    return NextResponse.json({ error: err.message || 'Upload zlyhal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const f = new URL(req.url).searchParams.get('f');
  if (!f) return NextResponse.json({ error: 'Missing f param' }, { status: 400 });

  const safe = path.basename(f);
  if (safe !== f) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const dirs = [
    path.join(process.cwd(), 'public', 'uploads', safe),
    path.join('/tmp/uploads', safe),
  ];

  for (const fp of dirs) {
    try {
      const data = await fs.readFile(fp);
      const mime: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
      return new NextResponse(data, {
        headers: {
          'Content-Type': mime[path.extname(safe).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch { continue; }
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { filename } = await req.json();
    const safe = path.basename(filename || '');
    const dirs = [path.join(process.cwd(), 'public', 'uploads', safe), path.join('/tmp/uploads', safe)];
    for (const fp of dirs) { try { await fs.unlink(fp); return NextResponse.json({ success: true }); } catch { continue; } }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
