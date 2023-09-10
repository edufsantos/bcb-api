import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Resource = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[data];
  },
);
