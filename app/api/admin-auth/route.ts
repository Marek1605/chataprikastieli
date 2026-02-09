import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChataAdmin2025!';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, token: ADMIN_PASSWORD });
    }
    
    return NextResponse.json({ error: 'Nesprávne heslo' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
