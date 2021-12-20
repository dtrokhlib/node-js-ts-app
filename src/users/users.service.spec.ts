import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user-entity';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersSerivce: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersSerivce = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await usersSerivce.createUser({
			email: 'test@test.com',
			name: 'Dmitriy',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123asdasd');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersSerivce.validateUser({
			email: 'test@test.com',
			password: '1',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersSerivce.validateUser({
			email: 'test@test.com',
			password: '2',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - wrong use', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await usersSerivce.validateUser({
			email: 'test@test.com',
			password: '1',
		});

		expect(res).toBeFalsy();
	});
});
