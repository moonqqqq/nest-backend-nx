import { BaseResDTO } from './base-res.dto';

export class ResDTO<T> extends BaseResDTO<T> {
  constructor(data: T) {
    super(true, data);
  }
}
