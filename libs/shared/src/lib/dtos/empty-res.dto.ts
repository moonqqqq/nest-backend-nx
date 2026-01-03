import { BaseResDTO } from './base-res.dto';

export class EmptyResDTO extends BaseResDTO<null> {
  constructor() {
    super(true, null);
  }
}
