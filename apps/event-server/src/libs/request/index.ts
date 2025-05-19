import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { v4 } from 'uuid';

@Global()
@Module({
  providers: [
    {
      provide: 'REQUEST_ID',
      scope: Scope.REQUEST,
      inject: [REQUEST],
      useFactory: (req: Request) => {
        const id = req.headers?.['x-request-id'] ?? v4();
        (req as any).requestId = id;
        return id;
      },
    },
  ],
  exports: ['REQUEST_ID'],
})
export class RequestIdModule {}
