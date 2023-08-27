import {Main} from "../components/main.js";
import {ProfitCost} from "../components/profit-cost.js";
import {Sing} from "../components/sing.js";
import {Auth} from "../services/auth.js";
import {Login} from "../components/login.js";
import {Profit} from "../components/profit.js";
import {CreateCategoryProfit} from "../components/create-category-profit.js";
import {EditingCategoryProfit} from "../components/editing-category-profit.js";
import {Cost} from "../components/cost.js";
import {CreateCategoryCost} from "../components/create-category-cost.js";
import {EditingCategoryCost} from "../components/editing-category-cost.js";
import {CreateProfitCost} from "../components/create-profit-cost.js";
import {EditingProfitCost} from "../components/editing-profit-cost.js";

export class Router {

    constructor() {
        this.menu = document.getElementById('menu');
        this.content = document.getElementById('content');
        this.title = document.getElementById('title');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/profit',
                title: 'Доходы',
                template: 'templates/profit.html',
                load: () => {
                    new Profit();
                }
            },
            {
                route: '#/create-category-profit',
                title: 'Создание категории дохода',
                template: 'templates/create-category-profit.html',
                load: () => {
                    new CreateCategoryProfit();
                }
            },
            {
                route: '#/editing-category-profit',
                title: 'Редактирование категории дохода',
                template: 'templates/editing-category-profit.html',
                load: () => {
                    new EditingCategoryProfit();
                }
            },
            {
                route: '#/cost',
                title: 'Расходы',
                template: 'templates/cost.html',
                load: () => {
                    new Cost();
                }
            },
            {
                route: '#/create-category-cost',
                title: 'Создание категории расхода',
                template: 'templates/create-category-cost.html',
                load: () => {
                    new CreateCategoryCost();
                }
            },
            {
                route: '#/editing-category-cost',
                title: 'Редактирование категории расхода',
                template: 'templates/editing-category-cost.html',
                load: () => {
                    new EditingCategoryCost();

                }
            },
            {
                route: '#/profit-cost',
                title: 'Доходы и расходы',
                template: 'templates/profit-cost.html',
                load: () => {
                    new ProfitCost();
                }
            },
            {
                route: '#/create-profit-cost',
                title: 'Создание дохода/расхода',
                template: 'templates/create-profit-cost.html',
                load: () => {
                    new CreateProfitCost();
                }
            },
            {
                route: '#/editing-profit-cost',
                title: 'Редактирование дохода/расхода',
                template: 'templates/editing-profit-cost.html',
                load: () => {
                    new EditingProfitCost();
                }
            },
            {
                route: '#/login',
                title: 'Войти',
                template: 'templates/login.html',
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/sing',
                title: 'Регистрация',
                template: 'templates/sing.html',
                load: () => {
                    new Sing();
                }

            },

        ]
    }


    async openRoute() {

        if (!localStorage.getItem(Auth.accessTokenKey)) {

            if (window.location.hash === '' || window.location.hash === '#/sing') {
                this.menu.style.display = 'none';
                const sing = '#/sing';
                const RouteSing = this.routes.find(item => {
                    return item.route === sing;
                });

                if (!RouteSing) {
                    window.location.href = '#/';
                    return;
                }

                this.content.innerHTML =
                    await fetch(RouteSing.template).then(response => response.text());

                this.title.innerText = RouteSing.title;
                RouteSing.load();

            } else if (window.location.hash === '#/login') {
                this.menu.style.display = 'none';
                const login = '#/login';
                const RouteLogin = this.routes.find(item => {
                    return item.route === login;
                });

                if (!RouteLogin) {
                    window.location.href = '#/';
                    return;
                }

                this.content.innerHTML = await fetch(RouteLogin.template).then(response => response.text());

                this.title.innerText = RouteLogin.title;
                RouteLogin.load();
            }

        } else {
            const newRoute = this.routes.find(item => {
                return item.route === window.location.hash;
            });

            if (!newRoute) {
                window.location.href = '#/';
                return;
            }

            this.content.innerHTML = await fetch(newRoute.template).then(response => response.text());

            this.title.innerText = newRoute.title;
            newRoute.load();
        }
    }
}