export type AppErrorCode = 'network' | 'timeout' | 'unauthorized' | 'not_found' | 'validation' | 'server' | 'unknown';

/** Normalized error every layer above `core/http` can rely on. */
export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
    readonly status?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  get isRetryable() {
    return this.code === 'network' || this.code === 'timeout' || this.code === 'server';
  }

  static fromStatus(status: number, message = 'Request failed') {
    if (status === 401 || status === 403) return new AppError('unauthorized', message, status);
    if (status === 404) return new AppError('not_found', message, status);
    if (status === 422 || status === 400) return new AppError('validation', message, status);
    if (status >= 500) return new AppError('server', message, status);
    return new AppError('unknown', message, status);
  }
}
