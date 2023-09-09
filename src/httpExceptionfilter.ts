import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  export interface HttpExceptionResponse {
    statusCode: number;
    message: string;
    error: string;
  }
  @Catch()
  export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    catch(exception: any, host: ArgumentsHost) {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const response =
        exception instanceof HttpException
          ? ctx.getResponse()
          : String(exception);
  
      const responsebody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        message: response,
        path:
          httpAdapter.getRequestMethod(ctx.getRequest()) +
          httpAdapter.getRequestUrl(ctx.getRequest()),
        errorResponse: response as HttpExceptionResponse,
      };
      httpAdapter.reply(ctx.getResponse(), responsebody, httpStatus);
    }
  }