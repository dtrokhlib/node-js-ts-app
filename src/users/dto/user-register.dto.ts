import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Not valid email' })
	email: string;

	@IsString({ message: 'Password does not set' })
	password: string;

	@IsString({ message: 'Name is not set' })
	name: string;
}
