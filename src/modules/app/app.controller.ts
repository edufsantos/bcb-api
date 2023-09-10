import { Controller, Get } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('')
export class AppController {
  @Public()
  @Get('')
  async create() {
    return {
      name: 'Wellcome at BCB – Big Chat Brasil',
    };
  }
}
