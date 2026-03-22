import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));

    // Reload automatically on lazy-loaded chunk failures (e.g. after deploy)
    if (
      err.name === 'ChunkLoadError' ||
      err.message.includes('Loading chunk')
    ) {
      window.location.reload();
      return;
    }

    console.error('[GlobalErrorHandler]', err);
  }
}
