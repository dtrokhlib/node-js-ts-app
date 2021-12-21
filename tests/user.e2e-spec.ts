import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import supertest from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

let jwt: string;

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@test.com', password: '1asdas542!' });

		expect(res.statusCode).toBe(422);
	});
	it('Login - error', async () => {
		const res = await supertest(application.app)
			.post('/users/login')
			.send({ email: 'test@test.com', passowrd: 'WrongPass' });

		expect(res.statusCode).toBe(422);
	});
	it('Login - success', async () => {
		const res = await supertest(application.app)
			.post('/users/login')
			.send({ email: 'test@test.com', password: '1asdas542!' });
		if (res.body.jwt) {
			jwt = res.body.jwt;
		}
		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Info - not authorized', async () => {
		const res = await await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${jwt}1`);

		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const res = await await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.email).toEqual('test@test.com');
		expect(res.body.id).toEqual(3);
	});
});

afterAll(() => {
	application.close();
});
