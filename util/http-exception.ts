import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string, data?: any) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message,
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BadImplementation extends HttpException {
  constructor(message: string, error?: any) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
