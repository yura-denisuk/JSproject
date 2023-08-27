import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {ActionProfitCost} from "../services/action-profit-cost.js";
import {Balance} from "../services/balance.js";
import AirDatepicker from "air-datepicker";

export class CreateProfitCost {
    constructor() {
        Balance.setActualBalance();
        new AirDatepicker('#create-profit-cost-date');
        this.selectProfitCost = document.getElementById('selectProfitCost');
        this.categoriesSelect = document.getElementById('categoriesSelect');
        this.createItemProfitCost = document.getElementById('createItemProfitCost');
        this.cancelCreateItemProfitCost = document.getElementById('cancelCreateItemProfitCost');
        this.categories = [];

        //Получение категорий дохода/расхода при изменении select доход/расход
        this.selectProfitCost.onchange = () => {
            this.getCategories();
        }

        //Отправка запроса на создание единицы дохода/расхода
        this.createItemProfitCost.onclick = () => {
            this.createItem();
            Balance.setActualBalance();
        }

        //Отмена отправки запроса на создание единицы дохода/расхода
        this.cancelCreateItemProfitCost.onclick = () => {
            ActionProfitCost.removeCategoriesInfo('categoriesName');
            location.href = '#/profit-cost';
        }
    }

    async createItem() {
        const categoriesName = ActionProfitCost.getCategoriesInfo('categoriesName');
        const selectProfitCost = document.getElementById('selectProfitCost');
        const categoriesSelect = document.getElementById('categoriesSelect');
        const amount = document.getElementById('amount');
        const date = document.getElementById('create-profit-cost-date');
        const dateArray = date.value.split('.').reverse();
        const dateResponse = dateArray.join('-');
        const comment = document.getElementById('comment');
        const category_id = this.getCategoryId();

        if (!selectProfitCost.value || !categoriesSelect.value || !amount.value || !date.value || !comment.value) {
            alert('Заполните все поля формы!');
        } else {
            try {
                if (categoriesName) {
                    const result = await CustomHttp.request(config.host + '/operations', "POST", {
                        type: categoriesName,
                        amount: +amount.value,
                        date: dateResponse,
                        comment: comment.value,
                        category_id: +category_id,
                    });

                    if (result.error) {
                        throw new Error(result.message);
                    } else {
                        ActionProfitCost.removeCategoriesInfo('categoriesName');
                        location.href = '#/profit-cost';
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    setCategoriesToSelect() {
        if (this.categories) {
            this.removeCategoriesToSelect();
            for (let i = 0; i < this.categories.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('id', this.categories[i].id);
                optionElement.setAttribute('value', this.categories[i].title);
                optionElement.innerText = this.categories[i].title;
                this.categoriesSelect.append(optionElement);
            }
        }
    }

    removeCategoriesToSelect() {
        this.categoriesSelect.innerHTML = '';
    }

    getCategoryId() {
        let selectCategoryActual = document.getElementById('categoriesSelect');
        let categories = Array.from(this.categoriesSelect.childNodes);
        let activeCategory = categories.find(item => {
            return item.textContent === selectCategoryActual.value;
        })
        return activeCategory.getAttribute('id');
    }

    async getCategories() {
        try {
            let selectProfitCostActual = document.getElementById('selectProfitCost');
            let name = null;
            if (selectProfitCostActual.value === 'доход') {
                name = 'income';
                ActionProfitCost.removeCategoriesInfo('categoriesName');
                ActionProfitCost.setCategoriesInfo('categoriesName', 'income');
            } else if (selectProfitCostActual.value === 'расход') {
                name = 'expense';
                ActionProfitCost.removeCategoriesInfo('categoriesName');
                ActionProfitCost.setCategoriesInfo('categoriesName', 'expense');
            }

            if (name) {
                this.categories = await this.responseCategories('/categories/' + name);
                this.setCategoriesToSelect();
            } else {
                this.removeCategoriesToSelect();
                throw new Error('В select доход/расход отсутствует значение');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async responseCategories(hashResponse) {
        try {
            const response = await CustomHttp.request(config.host + hashResponse);
            if (response.error) {
                throw new Error(response.message);
            } else {
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    }

}
