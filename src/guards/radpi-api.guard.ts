import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';

import { Env } from 'src/env';

@Injectable()
export class RadpiApiGuard implements CanActivate {
  rapidApiSecret: string;
  private readonly logger = new Logger(RadpiApiGuard.name);

  constructor(config: ConfigService) {
    this.rapidApiSecret = config.get(Env.RadpiApiGatewaySecret)
  }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const secret = request.header('X-RapidAPI-Proxy-Secret');

    return !!secret && this.rapidApiSecret == secret;
  }
}
