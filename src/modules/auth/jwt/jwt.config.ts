import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Envs } from '../../../shared/envs.mapping';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private configService: ConfigService<Envs>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('JWT_SECRET'),
      signOptions: { expiresIn: this.configService.get('JWT_EXPIRES_IN') },
    };
  }
}
