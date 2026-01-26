import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(96)
	firstName: string;

	@IsString()
	@IsOptional()
	@MinLength(3)
	@MaxLength(96)
	lastName?: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(96)
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(96)
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/,
		{
			message:
				"Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character",
		},
	)
	password: string;
}

/**
 * /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/
 * ^ -> Start of the string
 * (?=.*[a-z]) -> At least one lowercase letter
 * (?=.*[A-Z]) -> At least one uppercase letter
 * (?=.*\d) -> At least one digit
 * (?=.*[@$!%*#?&]) -> At least one special character
 * [A-Za-z\d@$!%*#?&]{8,64} -> 8 to 64 characters
 * $ -> End of the string
 */
