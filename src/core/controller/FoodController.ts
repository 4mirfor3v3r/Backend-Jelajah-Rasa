import { IFood } from './../models/Food';
import { FoodWorker } from './../worker/FoodWorker';
import { Router, Request, Response } from 'express';
import { IController } from './../shared/IController';
export class FoodController implements IController {
	path = '/foods';
	router = Router();
	_worker = new FoodWorker();

	constructor() {
		this._worker = new FoodWorker();
		this.initRouter();
	}
	initRouter() {
// endpoint will be called 
// localhost:4000/api/v1/foods/ping 
// will execute ping function at line 28
		this.router.get(`${this.path}/ping`, this.ping);

		this.router.get(`${this.path}/list`, this.getListFoods);
		this.router.post(`${this.path}/add`, this.addFood);
		this.router.post(`${this.path}/update/:id`, this.updateFood);
		this.router.post(`${this.path}/delete/:id`, this.deleteFood);
		this.router.post(`${this.path}/likes/add/:userId`, this.addToLikes);
		this.router.post(`${this.path}/likes/remove/:userId`, this.removeFromLikes);
	}

	private ping = (req: Request, res: Response) => {
		return res.send(this._worker.ping()); 
		// must return Hello World from worker class
	};
	private getListFoods = (req: Request, res: Response) => {
		if (req.query.page && req.query.pageSize) {
			var { page = 1, pageSize = 10 } = req.query;
			return res.json(this._worker.getPagedFoods(Number(page), Number(pageSize)));
		} else {
			return res.json(this._worker.getAllFoods());
		}
	};
	private addFood = (req: Request, res: Response) => {
		var model: IFood = {
			name: req.body.name,
			imgUrl: req.body.imgUrl,
			time: req.body.time,
			likes: 0,
			ingredients: req.body.ingredients,
			fact: req.body.fact,
			steps: req.body.steps,
		};
		return res.json(this._worker.addFood(model));
	};
	private updateFood = (req: Request, res: Response) => {
		var id = req.params.id;
		var model: IFood = {
			name: req.body.name,
			imgUrl: req.body.imgUrl,
			time: req.body.time,
			likes: req.body.likes,
			ingredients: req.body.ingredients,
			fact: req.body.fact,
			steps: req.body.steps,
		};
		return res.json(this._worker.updateFoods(id, model));
	};
	private deleteFood = (req: Request, res: Response) => {
		var id = req.params.id;
		return res.json(this._worker.deleteFood(id));
	};
	private addToLikes = (req: Request, res: Response) => {
		var userId = req.params.userId
		var foodId = req.body.foodId
		return res.json(this._worker.addToLikes(userId, foodId));
	};
	private removeFromLikes = (req: Request, res: Response) => {
		var userId = req.params.userId;
		var foodId = req.body.foodId;
		return res.json(this._worker.removeFromLikes(userId, foodId));
	};
}
