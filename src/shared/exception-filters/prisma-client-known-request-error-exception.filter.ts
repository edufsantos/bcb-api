import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorExceptionFilter
  implements ExceptionFilter
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 409;

    response.status(status).json({
      statusCode: status,
      code: this.codeMapping(exception.code),
      meta: this.handleMeta(exception.meta),
      path: request.url,
    });
  }

  private codeMapping(code: string) {
    const mapping = {
      P2002: 'isUnique',
      P2025: 'notFound',
    };

    return mapping[code] ?? code;
  }

  private handleMeta(meta: any) {
    return {
      field_name: meta?.target?.[0],
    };
  }
}
