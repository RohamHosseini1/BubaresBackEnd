import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { iranProvincesList } from 'constants/iranProvinces'

// IsValidBlogImageKey --------------------------------------------------------------------------
@ValidatorConstraint({ name: 'is-valid-blog-image-key', async: false })
export class IsValidBlogImageKey implements ValidatorConstraintInterface {
  validate(input: string) {
    return input.startsWith('/blog-images/')
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must start with "/blog-images/..."`
  }
}

@ValidatorConstraint({ name: 'is-valid-province', async: false })
export class IsValidProvince implements ValidatorConstraintInterface {
  validate(input: { provinceId: string }) {
    return !!iranProvincesList.find((e) => input.provinceId === e.provinceId)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid province object`
  }
}
