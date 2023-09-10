import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

type ExceptionResponse = {
  statusCode: number;
  message: string | ValidationError[];
  error: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    response.status(status).json({
      statusCode: status,
      code: this.getCode(exceptionResponse),
      meta: this.getMeta(exceptionResponse),
      path: request.url,
    });
  }

  private getCode(exceptionResponse: ExceptionResponse) {
    if (exceptionResponse.message instanceof Array) {
      const message = exceptionResponse.message[0];
      return Object.keys(message.constraints)[0];
    }
    return exceptionResponse.message;
  }

  private getMeta(exceptionResponse: ExceptionResponse) {
    if (exceptionResponse.message instanceof Array) {
      const message = exceptionResponse.message[0];
      return { field_name: message.property };
    }
    return undefined;
  }
}
