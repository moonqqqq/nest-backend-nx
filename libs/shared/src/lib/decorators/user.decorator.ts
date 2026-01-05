import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userObj = request.user;

    return userObj;
  },
);
