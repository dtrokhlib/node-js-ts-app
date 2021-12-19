import { IsEmail, IsString } from 'class-validator';
export class UserLoginDto {
	@IsEmail({}, { message: 'Not valid email' })
	email: string;
	@IsString({ message: 'Password do not specified' })
	password: string;
}
