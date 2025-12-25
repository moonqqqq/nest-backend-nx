export abstract class ILoggerService {
  abstract info: (data: string | object) => void;
  abstract error: (err: string | object) => void;
  abstract warn: (err: string | object) => void;
}
