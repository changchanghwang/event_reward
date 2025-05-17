import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
export * from './filter';

type ErrorOption = {
  errorMessage?: string;
};

// NOTE: @hapi/boom에 영향을 받아서 만든 매핑 함수

export const badRequest = (message?: string, option?: ErrorOption) => {
  return new BadRequestException({
    message,
    errorMessage: option?.errorMessage,
  });
};

export const notFound = (message?: string, option?: ErrorOption) => {
  return new NotFoundException({
    message,
    errorMessage: option?.errorMessage,
  });
};

export const forbidden = (message?: string, option?: ErrorOption) => {
  return new ForbiddenException({
    message,
    errorMessage: option?.errorMessage,
  });
};

export const conflict = (message?: string, option?: ErrorOption) => {
  return new ConflictException({
    message,
    errorMessage: option?.errorMessage,
  });
};

export const unauthorized = (message?: string, option?: ErrorOption) => {
  return new UnauthorizedException({
    message,
    errorMessage: option?.errorMessage,
  });
};

export const internalServerError = (message?: string, option?: ErrorOption) => {
  return new InternalServerErrorException({
    message,
    errorMessage: option?.errorMessage,
  });
};
