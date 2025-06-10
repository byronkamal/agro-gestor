import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsValidArea(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidArea',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const totalArea = (args.object as any)[relatedPropertyName]
          const vegetationArea = (args.object as any).vegetation_area
          const agriculturalArea = (args.object as any).agricultural_area

          if (
            typeof totalArea !== 'number' ||
            typeof vegetationArea !== 'number' ||
            typeof agriculturalArea !== 'number'
          ) {
            return false // Or throw an error, depending on desired behavior
          }

          return vegetationArea + agriculturalArea <= totalArea
        },
      },
    })
  }
}
