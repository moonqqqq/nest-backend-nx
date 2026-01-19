import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '@libs/redis';
import {
  LlmStreamMessage,
  LlmStreamMessageType,
} from '../types/llm-stream-message.type';

@Injectable()
export class LlmStreamService {
  private readonly CHANNEL_PREFIX = 'llm:stream:';

  constructor(private readonly llmMessagePubSub: RedisPubSubService) {}

  private getChannel(messageId: string): string {
    return `${this.CHANNEL_PREFIX}${messageId}`;
  }

  async publishChunk(messageId: string, content: string): Promise<void> {
    const message: LlmStreamMessage = {
      type: LlmStreamMessageType.CHUNK,
      content,
    };

    await this.llmMessagePubSub.publish(
      this.getChannel(messageId),
      JSON.stringify(message),
    );
  }

  async publishDone(messageId: string): Promise<void> {
    const message: LlmStreamMessage = {
      type: LlmStreamMessageType.DONE,
    };

    await this.llmMessagePubSub.publish(
      this.getChannel(messageId),
      JSON.stringify(message),
    );
  }

  async publishError(messageId: string, error: string): Promise<void> {
    const message: LlmStreamMessage = {
      type: LlmStreamMessageType.ERROR,
      error,
    };

    await this.llmMessagePubSub.publish(
      this.getChannel(messageId),
      JSON.stringify(message),
    );
  }

  async subscribe(
    messageId: string,
    callback: (message: LlmStreamMessage) => void,
  ): Promise<() => Promise<void>> {
    const channel = this.getChannel(messageId);

    const handler = (raw: string) => {
      const message = JSON.parse(raw) as LlmStreamMessage;
      callback(message);
    };

    await this.llmMessagePubSub.subscribe(channel, handler);

    return async () => {
      await this.llmMessagePubSub.unsubscribe(channel, handler);
    };
  }
}
