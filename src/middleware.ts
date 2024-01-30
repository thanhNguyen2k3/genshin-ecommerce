import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest, NextMiddleware } from 'next/server';

export const middleware = async (req: NextRequest, next: NextMiddleware) => {
    const token = await getToken({ req });

    if (token?.isAdmin !== true || (token.isAdmin !== true && !token)) {
        return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    } else {
        next;
    }
};

export const config = {
    matcher: ['/admin/:path*'],
};
