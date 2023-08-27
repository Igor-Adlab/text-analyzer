import { applyDecorators } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

import { getObjectDepth } from 'src/utils/object-depth';

@ValidatorConstraint({ name: 'maxObjectDepth', async: false })
export class MaxObjectDeplthValidator implements ValidatorConstraintInterface {
  validate(input: Record<string, any>, args: ValidationArguments) {
    const depth = getObjectDepth(input);
    const required = args.constraints[0];

    return depth < required;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Object depth ($value) is more that allowed!';
  }
}

export const MaxDepthValidator = (maxDepth: number, each: boolean = false) => applyDecorators(
    Validate(MaxObjectDeplthValidator, [maxDepth], {
        each,
        message: `Max object depth: ${maxDepth}`,
    })
);
