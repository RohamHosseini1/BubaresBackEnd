import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { iranProvincesList } from 'constants/iranProvinces'

@ValidatorConstraint({ name: 'is-valid-province', async: false })
export class IsValidProvince implements ValidatorConstraintInterface {
  validate(input: { provinceId: string }) {
    return !!iranProvincesList.find((e) => input.provinceId === e.provinceId)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid province object`
  }
}
