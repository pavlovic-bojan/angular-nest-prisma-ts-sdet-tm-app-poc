import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const ms = Date.now() - start;
      const correlationId = String(req.headers['x-correlation-id'] ?? '-');
      this.logger.log(
        `[${correlationId}] ${method} ${originalUrl} ${statusCode} +${ms}ms`,
      );
    });

    next();
  }
}
