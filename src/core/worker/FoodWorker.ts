import { MUser } from './../models/User';
import { MFood, IFood } from './../models/Food';
import { BaseResponse } from '../util/BaseResponse';

interface IFoodWorker {
	ping(): string;
	getAllFoods(): Promise<BaseResponse<Array<IFood>>>;
	getPagedFoods(page: number, pageSize: number): Promise<BaseResponse<Array<IFood>>>;
	addFood(food: IFood): Promise<BaseResponse<IFood>>;
	deleteFood(id: string): Promise<BaseResponse<IFood>>;
	updateFoods(id: string, newData: IFood): Promise<BaseResponse<IFood>>;
	addToLikes(userId: string, id: string): Promise<BaseResponse<IFood>>;
	removeFromLikes(userId: string, foodId: string): Promise<BaseResponse<IFood>>;
}

export class FoodWorker implements IFoodWorker {
	addFood(food: IFood): Promise<BaseResponse<IFood>> {
		return new Promise((resolve, reject) => {
			if (food) {
				MFood.create(food)
					.then((food) => {
						if (food) resolve(BaseResponse.success(food));
						else reject(BaseResponse.error('Something wrong'));
					})
					.catch((err: Error) => {
						reject(BaseResponse.error(err.message));
					});
			} else reject(BaseResponse.error('Something Wrong'));
		});
	}

	updateFoods(id: string, newData: IFood): Promise<BaseResponse<IFood>> {
		return new Promise((resolve, reject) => {
			if (newData) {
				MFood.findOneAndUpdate({ _id: id }, { $set: newData })
					.then((food) => {
						if (food) resolve(BaseResponse.success(food));
						else reject(BaseResponse.error('Something wrong'));
					})
					.catch((err: Error) => {
						reject(BaseResponse.error(err.message));
					});
			} else reject(BaseResponse.error('Something Wrong'));
		});
	}

	getAllFoods(): Promise<BaseResponse<IFood[]>> {
		return new Promise((resolve, reject) => {
			MFood.find()
				.then((foods) => {
					if (foods) resolve(BaseResponse.success(foods));
					else reject(BaseResponse.error('No One Data'));
				})
				.catch((err: Error) => {
					reject(BaseResponse.error(err.message));
				});
		});
	}

	async getPagedFoods(page: number, pageSize: number): Promise<BaseResponse<IFood[]>> {
		const count = await MFood.countDocuments();
		return new Promise((resolve, reject) => {
			if (Math.ceil(count / pageSize) < page) {
				resolve(BaseResponse.error(`Maximum page is ${Math.ceil(count / pageSize)}`));
			}

			MFood.find()
				.limit(pageSize * 1)
				.skip((page - 1) * pageSize)
				.exec()
				.then((foods) => {
					if (foods) {
						resolve(BaseResponse.success(foods));
					} else {
						resolve(BaseResponse.error('No One Data'));
					}
				})
				.catch((err: Error) => {
					reject(BaseResponse.error(err.message));
				});
		});
	}

	deleteFood(id: string): Promise<BaseResponse<IFood>> {
		return new Promise((resolve, reject) => {
			MFood.findByIdAndDelete({ _id: id })
				.then((data) => {
					if (data) resolve(BaseResponse.success(data));
					else reject(BaseResponse.error('Id not Found'));
				})
				.catch((err: Error) => {
					reject(BaseResponse.error(err.message));
				});
		});
	}

	addToLikes(userId: string, foodId: string): Promise<BaseResponse<IFood>> {
		return new Promise((resolve, reject) => {
			MUser.findOne({ _id: userId }).then((user) => {
				if (user) {
					if (foodId) {
						MFood.findOneAndUpdate({ id: foodId }, { $inc: { likes: 1 } })
							.then((food) => {
								if (food) {
									MUser.findOneAndUpdate({ _id: user._id }, { $push: { likedFoodId: food.id } })
										.then((doc) => {
											if (doc) resolve(BaseResponse.success(food));
											else reject(BaseResponse.error('Failed to Update'));
										})
										.catch((err: Error) => {
											reject(err.message);
										});
								} else {
									reject(BaseResponse.error('Unknown Error'));
								}
							})
							.catch((err: Error) => {
								reject(err.message);
							});
					}
				}
			});
		});
	}

	removeFromLikes(userId: string, foodId: string): Promise<BaseResponse<IFood>> {
		return new Promise((resolve, reject) => {
			MUser.findOne({ _id: userId }).then((user) => {
				if (user) {
					if (foodId) {
						MFood.findOneAndUpdate({ id: foodId, likes: { $gt: 0 } }, { $inc: { likes: -1 } })
							.then((food) => {
								if (food) {
									MUser.findOneAndUpdate({ _id: user._id }, { $pullAll: { likedFoodId: [food.id] } })
										.then((doc) => {
											if (doc) resolve(BaseResponse.success(food));
											else reject(BaseResponse.error('Failed to update'));
										})
										.catch((err: Error) => {
											reject(BaseResponse.error(err.message));
										});
								} else {
									reject(BaseResponse.error('No one food liked'));
								}
							})
							.catch((err: Error) => {
								reject(BaseResponse.error(err.message));
							});
					} else {
						reject(BaseResponse.error('Food not found'));
					}
				} else {
					reject(BaseResponse.error('Register first'));
				}
			});
		});
	}

	ping(): string {
		return 'Hello World'
	}
}
