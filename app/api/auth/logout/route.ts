import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    cookies().delete('session');
    const url = new URL('/', request.url);
    return NextResponse.redirect(url, { status: 303 });
}
