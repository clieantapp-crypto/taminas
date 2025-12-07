import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const suspiciousBots = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
  'go-http-client', 'java/', 'perl', 'ruby', 'php/', 'libwww', 'httpclient',
  'scrapy', 'phantom', 'headless', 'selenium', 'puppeteer', 'playwright'
];

const allowedBots = ['googlebot', 'bingbot', 'yandex', 'duckduckbot', 'slurp'];

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const blockedIPs = new Set<string>();

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 100;
const BLOCK_DURATION = 300000;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const path = request.nextUrl.pathname;

  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next();
  }

  if (blockedIPs.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  const ua = userAgent.toLowerCase();
  
  const isAllowedBot = allowedBots.some(bot => ua.includes(bot));
  if (!isAllowedBot) {
    const isSuspiciousBot = suspiciousBots.some(bot => ua.includes(bot));
    if (isSuspiciousBot) {
      console.log(`Blocked suspicious bot: ${ua} from IP: ${ip}`);
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  if (!userAgent || userAgent.length < 10) {
    console.log(`Blocked empty/short user agent from IP: ${ip}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  } else if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  } else {
    record.count++;
    if (record.count > MAX_REQUESTS) {
      blockedIPs.add(ip);
      console.log(`Rate limited and blocked IP: ${ip}`);
      setTimeout(() => blockedIPs.delete(ip), BLOCK_DURATION);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
