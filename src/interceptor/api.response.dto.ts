import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  status_code: HttpStatus;
  detail: T;
  result: string;
}
