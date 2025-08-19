import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Crypto API is working',
    timestamp: new Date().toISOString(),
  });
}
