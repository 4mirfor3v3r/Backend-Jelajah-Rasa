import bodyParser from 'body-parser';
import { Application } from 'express';
export class AppUse {
	constructor(private app: Application) {
		this.setup();
	}
	private setup() {
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}
}
