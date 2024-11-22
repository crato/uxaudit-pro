import { createRemoteJWKSet, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const baseUrl = process.env.AUTH0_BASE_URL;

    // Handle login
    if (pathname.endsWith('/login')) {
      const returnTo = searchParams.get('returnTo') || '/dashboard';
      
      const loginUrl = new URL('/authorize', process.env.AUTH0_ISSUER_BASE_URL);
      loginUrl.searchParams.set('response_type', 'code');
      loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      loginUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/callback`);
      loginUrl.searchParams.set('scope', 'openid profile email');
      loginUrl.searchParams.set('state', returnTo);

      return NextResponse.redirect(loginUrl.toString());
    }

    // Handle logout
    if (pathname.endsWith('/logout')) {
      const returnTo = searchParams.get('returnTo') || baseUrl;
      
      const logoutUrl = new URL('/v2/logout', process.env.AUTH0_ISSUER_BASE_URL);
      logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      logoutUrl.searchParams.set('returnTo', returnTo);

      const response = NextResponse.redirect(logoutUrl.toString());
      response.cookies.delete('appSession');
      
      return response;
    }

    // Handle callback
    if (pathname.endsWith('/callback')) {
      const code = searchParams.get('code');
      if (!code) {
        throw new Error('No code provided');
      }

      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: `${baseUrl}/api/auth/callback`
        })
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        console.error('Token error:', error);
        throw new Error('Failed to get token');
      }

      const { access_token, id_token } = await tokenResponse.json();

      // Create session cookie and redirect
      const dashboardUrl = new URL('/dashboard', baseUrl);
      const response = NextResponse.redirect(dashboardUrl);
      
      response.cookies.set('appSession', id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}