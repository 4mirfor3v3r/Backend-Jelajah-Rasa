import { FoodController } from './core/controller/FoodController';
import { AuthController } from './core/controller/AuthController';
import { App } from './App'

// List of Controller
const app = new App([
    new AuthController(),
    new FoodController()
])
app.listen()