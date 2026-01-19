import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@libs/redis';
import { PREVENT_DUPLICATE_KEY } from '../decorators/prevent-duplicate.decorator';

export interface PreventDuplicateOptions {
  keyGenerator?: (req: Request & { user?: { id: string } }) => string;
  ttlSeconds?: number;
}

@Injectable()
export class PreventDuplicateGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<PreventDuplicateOptions>(
      PREVENT_DUPLICATE_KEY,
      context.getHandler(),
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ttlSeconds = options.ttlSeconds ?? 3;

    const key = this.generateKey(request, context, options.keyGenerator);

    const isLocked = await this.redis.set(key, '1', 'EX', ttlSeconds, 'NX');

    if (!isLocked) {
      throw new ConflictException('DUPLICATE_REQUEST');
    }

    return true;
  }

  private generateKey(
    request: Request & { user?: { id: string }; method: string; url: string },
    context: ExecutionContext,
    customKeyGenerator?: (req: Request & { user?: { id: string } }) => string,
  ): string {
    if (customKeyGenerator) {
      return `prevent-duplicate:${customKeyGenerator(request)}`;
    }

    const userId = request.user?.id ?? 'anonymous';
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    return `prevent-duplicate:${userId}:${controllerName}:${handlerName}`;
  }
}
