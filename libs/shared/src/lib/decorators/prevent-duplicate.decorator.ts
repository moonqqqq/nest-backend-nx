import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  PreventDuplicateGuard,
  PreventDuplicateOptions,
} from '../guards/prevent-duplicate.guard';

export const PREVENT_DUPLICATE_KEY = 'PREVENT_DUPLICATE_OPTIONS';

export function PreventDuplicate(
  options: PreventDuplicateOptions = {},
): MethodDecorator {
  return applyDecorators(
    SetMetadata(PREVENT_DUPLICATE_KEY, options),
    UseGuards(PreventDuplicateGuard),
  );
}
