export abstract class IEventStreamConsumer {
  abstract process(message: any): Promise<void>;
}
