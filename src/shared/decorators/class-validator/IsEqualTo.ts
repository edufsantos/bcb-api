import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEqualTo<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      async: false,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [prop] = args.constraints;
          return args.object[prop] === value;
        },

        defaultMessage(args: ValidationArguments) {
          const [constraintProperty]: (() => any)[] = args.constraints;
          return `${constraintProperty} and ${args.property} does not match`;
        },
      },
    });
  };
}
