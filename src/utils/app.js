import {Router} from "./router.js";
import "../../static/styles/index.css"
import "bootstrap/dist/js/bootstrap.min"

class App {
    constructor() {
        //создаем на основе класса Router новый экземпляр
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this)); //внутри изменяется контекст (определяет первую загруженную страницу)

        window.addEventListener('popstate', this.handleRouteChanging.bind(this)); //внутри изменяется контекст (событие изменения url страницы)
    }

    handleRouteChanging() {
        this.router.openRoute();
    }
}

(new App());