import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.getStatus();

    // TODO: logger 추가
    console.error(error);

    response.status(status).json({
      errorMessage:
        //@ts-expect-error
        error.getResponse().errorMessage ?? error.getResponse().message,
    });
  }
}
