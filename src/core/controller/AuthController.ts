import { IUser } from './../models/User';
import { IController } from './../shared/IController';
import { AuthWorker } from '../worker/AuthWorker';
import express from 'express';
export class AuthController implements IController {
	path = '/auth';
	router = express.Router();
	_worker: AuthWorker;
	constructor() {
		this._worker = new AuthWorker();
		this.initRouter();
	}
	initRouter() {
		this.router.get(`${this.path}/ping`, this.ping);
		this.router.post(`${this.path}/login`, this.login);
		this.router.post(`${this.path}/register`, this.register);
	}

	private ping = (req: express.Request, res: express.Response) => {
		return res.send(this._worker.ping());
	};
	private login = (req: express.Request, res: express.Response) => {
		var email = req.body.email;
		var password = req.body.password;
		return this._worker
			.login(email, password)
			.then((data: any) => {
				res.json(data);
			})
			.catch((err: Error) => {
				res.json(err);
			});
	};
	private register = (req: express.Request, res: express.Response) => {
		var data :IUser = {
			name:req.body.name,
			email:req.body.email,
			password:req.body.password,
		};
	
		this._worker
			.register(data)
			.then((data: any) => {
				res.json(data);
			})
			.catch((err: Error) => {
				res.json(err);
			});
	};
}
