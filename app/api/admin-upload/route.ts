import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// Magic bytes for file type verification
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
};

function verifyAuth(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-token');
  return auth === ADMIN_PASSWORD;
}

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return true; // Skip check for types without known magic bytes (avif)
  for (let i = 0; i < expected.length; i++) {
    if (buffer[i] !== expected[i]) return false;
  }
  return true;
}

function sanitizeFilename(name: string): string {
  // Remove path traversal, special chars
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `Nepovolený typ súboru: ${file.type}. Povolené: JPG, PNG, WebP, AVIF` 
      }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `Súbor je príliš veľký (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 10MB` 
      }, { status: 400 });
    }

    // Validate extension
    const originalExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
      return NextResponse.json({ 
        error: `Nepovolená prípona: ${originalExt}` 
      }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes (actual file content matches claimed type)
    if (!verifyMagicBytes(buffer, file.type)) {
      return NextResponse.json({ 
        error: 'Obsah súboru nezodpovedá deklarovanému typu. Skúste iný obrázok.' 
      }, { status: 400 });
    }

    // Generate unique filename
    const hash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const safeName = sanitizeFilename(path.basename(file.name, originalExt));
    const filename = `${timestamp}-${hash}-${safeName}${originalExt}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file
    await fs.writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    console.log(`[Admin Upload] Saved: ${filename} (${(file.size / 1024).toFixed(0)}KB, ${file.type})`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err: any) {
    console.error('[Admin Upload] Error:', err);
    return NextResponse.json({ 
      error: err.message || 'Upload failed' 
    }, { status: 500 });
  }
}

// DELETE - remove uploaded file
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { filename } = await req.json();
    
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    // Prevent path traversal
    const safeName = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, safeName);

    // Check file exists and is within upload dir
    const resolvedPath = path.resolve(filepath);
    if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await fs.unlink(filepath);
    console.log(`[Admin Upload] Deleted: ${safeName}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET - list uploaded files
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureUploadDir();
    const files = await fs.readdir(UPLOAD_DIR);
    const imageFiles = files.filter(f => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()));
    
    const results = await Promise.all(
      imageFiles.map(async (f) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, f));
        return {
          filename: f,
          url: `/uploads/${f}`,
          size: stat.size,
          uploadedAt: stat.mtime.toISOString(),
        };
      })
    );

    return NextResponse.json({ files: results.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)) });
  } catch (err: any) {
    return NextResponse.json({ files: [] });
  }
}
