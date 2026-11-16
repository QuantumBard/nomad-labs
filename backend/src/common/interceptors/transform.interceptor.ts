import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

interface ResponseData {
  success?: boolean;
  data?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  [key: string]: unknown;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp();
    ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (data && typeof data === 'object' && data !== null && 'success' in data) {
          const responseData = data as ResponseData;
          return {
            ...responseData,
            timestamp: new Date().toISOString(),
          } as SuccessResponse<T>;
        }

        if (data && typeof data === 'object' && data !== null && ('data' in data || 'meta' in data)) {
          const responseData = data as ResponseData;
          return {
            success: true,
            data: responseData.data || data,
            ...(responseData.meta && { meta: responseData.meta }),
            timestamp: new Date().toISOString(),
          } as SuccessResponse<T>;
        }

        return {
          success: true,
          data: data as T,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
