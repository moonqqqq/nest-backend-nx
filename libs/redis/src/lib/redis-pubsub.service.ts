import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

export interface IPubSubMessage {
  channel: string;
  message: string;
}

@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;
  private subscriptions = new Map<string, Set<(message: string) => void>>();

  constructor(@Inject(REDIS_CLIENT) redis: Redis) {
    this.publisher = redis.duplicate();
    this.subscriber = redis.duplicate();

    this.subscriber.on('message', (channel: string, message: string) => {
      const callbacks = this.subscriptions.get(channel);
      if (callbacks) {
        callbacks.forEach((callback) => callback(message));
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.publisher.quit();
    await this.subscriber.quit();
  }

  async publish(channel: string, message: string): Promise<number> {
    return await this.publisher.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      await this.subscriber.subscribe(channel);
    }

    this.subscriptions.get(channel)!.add(callback);
  }

  async unsubscribe(
    channel: string,
    callback?: (message: string) => void,
  ): Promise<void> {
    const callbacks = this.subscriptions.get(channel);

    if (!callbacks) {
      return;
    }

    if (callback) {
      callbacks.delete(callback);
    }

    if (!callback || callbacks.size === 0) {
      this.subscriptions.delete(channel);
      await this.subscriber.unsubscribe(channel);
    }
  }

  async psubscribe(
    pattern: string,
    callback: (channel: string, message: string) => void,
  ): Promise<void> {
    await this.subscriber.psubscribe(pattern);
    this.subscriber.on('pmessage', (_pattern, channel, message) => {
      if (_pattern === pattern) {
        callback(channel, message);
      }
    });
  }

  async punsubscribe(pattern: string): Promise<void> {
    await this.subscriber.punsubscribe(pattern);
  }
}
