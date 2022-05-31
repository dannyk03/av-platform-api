import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { HelperStringService } from '@/utils/helper/service/helper.string.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordStrongConstraint
    implements ValidatorConstraintInterface
{
    constructor(
        protected readonly helperStringService: HelperStringService,
        protected readonly configService: ConfigService,
    ) {}

    validate(value: string, args: ValidationArguments): boolean {
        // At least one upper case English letter, (?=.*?[A-Z])
        // At least one lower case English letter, (?=.*?[a-z])
        // At least one digit, (?=.*?[0-9])
        // At least one special character, (?=.*?[#?!@$%^&*-])
        // Minimum eight in length .{8,} (with the anchors)

        const [length] = args.constraints;
        return value
            ? this.configService.get<string>('app.mode') === 'secure'
                ? this.helperStringService.checkPasswordStrong(value, length)
                : true
            : false;
    }
}

export function IsPasswordStrong(
    minLength = 8,
    validationOptions?: ValidationOptions,
) {
    return function (object: Record<string, any>, propertyName: string): any {
        registerDecorator({
            name: 'IsPasswordStrong',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [minLength],
            validator: IsPasswordStrongConstraint,
        });
    };
}
