import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      const [model] = args.constraints;
      const model_access = this.prisma[model] as any;
      const result = await model_access.findUnique({
        where: { [args.property]: value },
      });
      return !result;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be unique`;
  }
}

export function IsUnique(
  model: Prisma.ModelName,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model.toLowerCase()],
      validator: IsUniqueConstraint,
    });
  };
}
