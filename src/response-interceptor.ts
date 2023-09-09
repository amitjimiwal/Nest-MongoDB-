import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Response<T> {
  message: string;
  statusCode: number;
  success: boolean;
  result: any;
  timestamp: string;
  path: string;
  error: any;
}
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        statusCode,
        success: data.success,
        result: data.result,
        timestamp: new Date().toISOString(),
        path,
        error: null,
      })),
    );
  }
}