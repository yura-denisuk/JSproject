import {ActionProfitCost} from "../services/action-profit-cost.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import AirDatepicker from "air-datepicker";

export class EditingProfitCost {
    constructor() {
        Balance.setActualBalance();

        //Устанавливаем airdatapicker в поля ввода даты
        new AirDatepicker('#editing-profit-cost-date');

        this.categoriesName = ActionProfitCost.getCategoryName('categoriesName');
        this.nameCategory = ActionProfitCost.getCategoryName('nameCategory');

        this.selectProfitCost = document.getElementById('selectProfitCost');
        this.categoriesSelect = document.getElementById('categoriesSelect');
        this.editItemProfitCost = document.getElementById('editItemProfitCost');
        this.cancelCreateItemProfitCost = document.getElementById('cancelEditItemProfitCost');
        this.categories = [];

        //Присваивание в поля тип и категория значения редактируемой операции, чтобы пользователь их не исправил
        //для типа операции (доход/расход)
        this.setValueCategory(this.categoriesName, this.selectProfitCost);

        //для категории операции
        this.categoriesSelect.innerHTML = "<option>" + this.nameCategory + "</option>";
        this.categoriesSelect.disabled = true;

        //Получение категорий дохода/расхода при изменении select доход/расход
        this.selectProfitCost.onchange = () => {
            this.getCategories();
        }

        //Отправка запроса на редактирование единицы дохода/расхода
        this.editItemProfitCost.onclick = () => {
            this.editItem();
        }

        //Отмена отправки запроса на редактирование единицы дохода/расхода
        this.cancelCreateItemProfitCost.onclick = () => {
            ActionProfitCost.removeCategoriesInfo('categoriesName');
            ActionProfitCost.removeCategoriesInfo('idElement');
            ActionProfitCost.removeCategoriesInfo('nameCategory');
            location.href = '#/profit-cost';
        }


    }

    setValueCategory(nameLocalStorage, selectElement) {
        if (nameLocalStorage === 'income') {
            selectElement.value = 'доход';
            selectElement.disabled = true;
        } else if (nameLocalStorage === 'expense') {
            selectElement.value = 'расход';
            selectElement.disabled = true;
        }
        return selectElement;
    }

    async editItem() {

        const amount = document.getElementById('amount');
        const date = document.getElementById('editing-profit-cost-date');
        const dateArray = date.value.split('.').reverse();
        const dateResponse = dateArray.join('-');
        const comment = document.getElementById('comment');
        const element_id = +ActionProfitCost.getCategoryName('idElement');

        //Выполняем изменение операции
        const categoryArray = await CustomHttp.request(config.host + '/categories/' + this.categoriesName);
        const category_id = categoryArray.find(item => {
            if (item.title === this.nameCategory) {
                return item.id;
            }
        })

        try {
            if (this.categoriesName) {
                const result = await CustomHttp.request(config.host + '/operations/' + element_id, "PUT", {
                    type: this.categoriesName,
                    amount: +amount.value,
                    date: dateResponse,
                    comment: comment.value,
                    category_id: category_id.id,
                });

                if (result.error) {
                    throw new Error(result.message);
                } else {
                    ActionProfitCost.removeCategoriesInfo('categoriesName');
                    ActionProfitCost.removeCategoriesInfo('idElement');
                    ActionProfitCost.removeCategoriesInfo('nameCategory');
                    location.href = '#/profit-cost';
                }
            }
        } catch (error) {
            console.log(error);
        }

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
}
