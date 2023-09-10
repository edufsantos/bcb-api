import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { AuthErrors } from 'src/shared/errors/auth.errors';
import { UserSerializer } from './user-serializer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.email_verified) {
      throw new UnauthorizedException(AuthErrors.EmailNotVerifyed);
    }
    return new UserSerializer(user);
  }
}
