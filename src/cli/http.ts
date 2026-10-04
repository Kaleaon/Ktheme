import http from 'node:http';
import https from 'node:https';

export interface HttpResponse {
  ok: boolean;
  status: number;
  json: <T = unknown>() => Promise<T>;
  text: () => Promise<string>;
}

export async function httpFetch(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string; timeoutMs?: number } = {}
): Promise<HttpResponse> {
  if (typeof globalThis.fetch === 'function') {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs || 5000);
      const res = await globalThis.fetch(url, {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.body,
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      return {
        ok: res.ok,
        status: res.status,
        json: <T = unknown>() => res.json() as Promise<T>,
        text: () => res.text(),
      };
    } catch {
      // Fallback to node http/https if global fetch fails/errors
    }
  }

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(reqOptions, (res) => {
      let body = '';
      res.setEncoding('utf-8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300,
          status: res.statusCode || 500,
          json: async () => JSON.parse(body),
          text: async () => body,
        });
      });
    });

    req.on('error', reject);
    if (options.timeoutMs) {
      req.setTimeout(options.timeoutMs, () => {
        req.destroy(new Error('Request timeout'));
      });
    }

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}
