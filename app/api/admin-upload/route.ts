import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const UPLOAD_DIR = '/tmp/uploads';

const MAGIC: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

function verifyAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

// POST - upload image
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Too large (max 10MB)' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const expected = MAGIC[file.type];
    if (expected && !expected.every((b, i) => buffer[i] === b)) {
      return NextResponse.json({ error: 'File content mismatch' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 8);
    const ext = file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg';
    const filename = `${Date.now()}-${hash}${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    // URL cez API route - funguje aj v standalone Docker
    const url = `/api/admin-upload?f=${filename}`;
    console.log(`Uploaded: ${filename} (${Math.round(file.size / 1024)}KB) -> ${url}`);
    return NextResponse.json({ success: true, url, filename, size: file.size });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}

// GET - serve uploaded images
export async function GET(req: NextRequest) {
  const f = new URL(req.url).searchParams.get('f');
  if (!f || f.includes('..') || f.includes('/')) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  try {
    const buffer = await fs.readFile(path.join(UPLOAD_DIR, f));
    const ext = path.extname(f).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    return new NextResponse(buffer, {
      headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
