import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginDto {
	@ApiProperty({
		description: "The institutional email of the user",
		example: "john.doe@sudamericano.edu.ec",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "The password for the user account",
		example: "StrongP@ssw0rd",
		minLength: 8,
		maxLength: 20,
	})
	@IsStrongPassword()
	@IsNotEmpty()
	password: string;
}
