import { HttpException, HttpStatus } from '@nestjs/common';

export class success extends HttpException {
  constructor(message: string, data?: any) {
    super(
      {
        status: true,
        message,
        data,
      },
      HttpStatus.OK,
    );
  }
}
