import { registerDecorator, ValidationOptions } from 'class-validator';
import * as CPF from 'cpf';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      async: false,
      validator: {
        validate(value: string): boolean {
          return value ? CPF.isValid(value) : true;
        },

        defaultMessage() {
          return `${propertyName} must be valid`;
        },
      },
    });
  };
}
