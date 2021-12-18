import { BaseController } from '../common/base.controller';
import { NextFunction, Response, Request } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', func: this.login, method: 'post' },
			{ path: '/register', func: this.register, method: 'post' },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'login');
	}

	register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'register');
	}
}
