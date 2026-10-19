import { AppError } from '../errors/app-error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

/** Port: anything able to talk to a microservice. Repositories depend on this, never on `fetch`. */
export interface HttpClient {
  request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T>;
}

export type TokenProvider = () => string | null;

/** Adapter: `fetch`-based client with timeout, auth header and error normalization. */
export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
    private readonly getToken: TokenProvider = () => null,
  ) {}

  async request<T>(method: HttpMethod, path: string, { query, body, headers, signal }: RequestOptions = {}): Promise<T> {
    const url = new URL(path, this.baseUrl);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    signal?.addEventListener('abort', () => controller.abort());

    const token = this.getToken();
    try {
      const response = await fetch(url.toString(), {
        method,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(body !== undefined && { 'Content-Type': 'application/json' }),
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (!response.ok) throw AppError.fromStatus(response.status, await response.text());
      if (response.status === 204) return undefined as T;
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (controller.signal.aborted) throw new AppError('timeout', 'Request timed out', undefined, error);
      throw new AppError('network', 'Network request failed', undefined, error);
    } finally {
      clearTimeout(timer);
    }
  }
}
