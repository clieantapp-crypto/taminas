const suspiciousBots = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
  'go-http-client', 'java', 'perl', 'ruby', 'php', 'libwww', 'httpclient',
  'scrapy', 'phantom', 'headless', 'selenium', 'puppeteer', 'playwright',
  'axios', 'node-fetch', 'postman', 'insomnia', 'httpie'
];

const blockedIPs: Set<string> = new Set();
const requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 100;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return suspiciousBots.some(bot => ua.includes(bot));
}

export function isSuspiciousRequest(headers: Record<string, string | null>): boolean {
  const userAgent = headers['user-agent'];
  const acceptLanguage = headers['accept-language'];
  const accept = headers['accept'];
  
  if (!userAgent || userAgent.length < 10) return true;
  if (!acceptLanguage) return true;
  if (!accept || !accept.includes('text/html')) return true;
  
  return false;
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  record.count++;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    blockedIPs.add(ip);
    return true;
  }
  
  return false;
}

export function isBlockedIP(ip: string): boolean {
  return blockedIPs.has(ip);
}

export function blockIP(ip: string): void {
  blockedIPs.add(ip);
}

export function generateFingerprint(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function validateHoneypot(value: string | undefined): boolean {
  return !value || value === '';
}

export function getBotScore(data: {
  userAgent: string | null;
  hasJavascript: boolean;
  hasCookies: boolean;
  screenResolution: string | null;
  timezone: string | null;
  touchSupport: boolean;
  mouseMovements: number;
  timeOnPage: number;
}): number {
  let score = 0;
  
  if (isBot(data.userAgent)) score += 50;
  if (!data.hasJavascript) score += 30;
  if (!data.hasCookies) score += 10;
  if (!data.screenResolution) score += 10;
  if (!data.timezone) score += 5;
  if (data.mouseMovements < 3) score += 15;
  if (data.timeOnPage < 2000) score += 20;
  
  return Math.min(score, 100);
}

export const BOT_THRESHOLD = 50;
