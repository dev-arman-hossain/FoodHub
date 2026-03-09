import { NextRequest, NextResponse } from 'next/server';

/**
 * Decodes a JWT payload without verification.
 * This is safe because the backend strictly verifies the token.
 */
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function proxyHandler(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const accessToken = req.cookies.get('accessToken')?.value;

    // Define protected subtrees and their required roles
    const protectionMap: Record<string, string[]> = {
        'admin': ['ADMIN'],
        'provider': ['PROVIDER', 'ADMIN'],
        'orders': ['CUSTOMER', 'ADMIN'],
    };

    // Get the first segment of the path (e.g., 'admin', 'provider', 'orders')
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment && protectionMap[firstSegment]) {
        const requiredRoles = protectionMap[firstSegment];

        if (!accessToken) {
            // Redirect to login if no token is present
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const payload = parseJwt(accessToken);
        const userRole = payload?.role;

        if (!userRole || !requiredRoles.includes(userRole)) {
            // If the user doesn't have the required role, redirect them to a safe place
            if (userRole === 'ADMIN') return NextResponse.next(); // Admins can go anywhere

            if (userRole === 'PROVIDER' && firstSegment === 'admin') {
                return NextResponse.redirect(new URL('/provider/dashboard', req.url));
            }
            if (userRole === 'CUSTOMER' && (firstSegment === 'admin' || firstSegment === 'provider')) {
                return NextResponse.redirect(new URL('/', req.url));
            }

            // Default fallback
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

// Next.js 16+ Edge Middleware / Proxy convention
export default function middleware(request: NextRequest) {
    return proxyHandler(request);
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/provider/:path*',
        '/orders/:path*',
    ],
};
