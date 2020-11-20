import { MongoSingleton } from './core/util/mongoSingleton';
import { Kernel } from './core/kernel/Kernel'
import { IController } from './core/shared/IController';
import * as dotenv from 'dotenv';

export class App {
    _kernel:Kernel
    _mongoSingleton:MongoSingleton
    constructor(_c:IController[]){
        this._kernel = new Kernel()
        this._mongoSingleton = new MongoSingleton()
        this.initEnv();
        this.initController(_c)
        this.connectStorage()
    }
    private initController(_c:IController[]){
        _c.forEach((controller) =>{
            this._kernel._defaultApps.use("/api/v1",controller.router)
        })
    }
    private connectStorage(){
        this._mongoSingleton.connect()
    }
    private initEnv(){
		var config: dotenv.DotenvConfigOptions = {
			path: './dot.env',
		};
		dotenv.config(config);
    }
    listen(){
        this._kernel.appService()
    }
}