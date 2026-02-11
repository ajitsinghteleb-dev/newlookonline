import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const baseUrl = request.nextUrl.origin;
    const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
    `.trim();

    return new NextResponse(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
