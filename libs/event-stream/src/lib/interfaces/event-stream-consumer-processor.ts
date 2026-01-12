export abstract class EventStreamConsumerProcessor {
  abstract process(message: any): Promise<void>;
}
