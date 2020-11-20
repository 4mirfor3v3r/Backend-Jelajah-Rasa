import { BaseResponse } from './../util/BaseResponse';
import { IUser, MUser } from './../models/User';
import { compareSync, hash } from 'bcrypt';

interface IAuthWorker {
	ping(): string;
	register(user: IUser): Promise<BaseResponse<IUser>>;
	login(email: string, password: string): Promise<BaseResponse<IUser>>;
}

export class AuthWorker implements IAuthWorker {
	register(user: IUser): Promise<BaseResponse<IUser>> {
		return new Promise((resolve, reject) => {
			MUser.findOne({ email: user.email })
				.then((result) => {
					if (!result) {
						hash(user.password,10,(err,hash) =>{
							user.password = hash
							MUser.create(user).then((data) =>{
								resolve(BaseResponse.success(data))
							}).catch((err:Error)=>{
								reject(BaseResponse.error(err.message))
							})
						})
					} else {
						reject(BaseResponse.error("Email already Exists"))
					}
				})
				.catch((err: Error) => {
					console.log(err);
					reject(BaseResponse.error(err.message));
				});
		});
	}
	login(email: string, password: string): Promise<BaseResponse<IUser>> {
		return new Promise((resolve, reject) => {
			MUser.findOne({ email: email })
				.then((result) => {
					if (result) {
						if (compareSync(password, result.password)) {
							resolve(BaseResponse.success(result));
						} else {
							resolve(BaseResponse.error('Email or Password Wrong'));
						}
					} else {
						resolve(BaseResponse.error('Email or Password Wrong'));
					}
				})
				.catch((err: Error) => {
					console.log(err);
					reject(BaseResponse.error(err.message));
				});
		});
	}

	ping(): string {
		return 'Pong';
	}
}
