// frontend/src/app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3001')
  );
  response.cookies.delete('next-auth.session-token');
  return response;
}