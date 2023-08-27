import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "../services/building-element.js";
import {Balance} from "../services/balance.js";

export class Cost {
    constructor() {
        Balance.setActualBalance();
        this.idElement = null;
        // получение перечня категорий дохода с сервера
        this.costCategory = [];
        this.wrapperCostCategories = document.getElementById('wrapper-cost-categories');
        this.getCostCategories();

        //удаление категории
        this.removeCategoryCost = document.getElementById('removeCategoryCost');
        this.removeCategoryCost.onclick = () => {
            this.removeCostCategory();
        }

        //отмена удаления категории
        this.cancelRemoveCategoryCost = document.getElementById('cancelRemoveCategoryCost');
        this.cancelRemoveCategoryCost.onclick = () => {
            localStorage.removeItem('cost');
            BuildingElement.canselActionCategory('cost');
        }


    }

    async getCostCategories() {
        try {
            const response = await CustomHttp.request(config.host + '/categories/expense');
            if (response.error) {
                throw new Error(response.message);
            } else {
                this.costCategory = response;
                BuildingElement.showCategoryCards(this.costCategory, this.wrapperCostCategories, 'editing-category-cost');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async removeCostCategory() {
        this.idElement = BuildingElement.getIdElement();
        try {
            await BuildingElement.removeOperations(this.idElement, 'expense');
            const response = await CustomHttp.request(config.host + '/categories/expense/' + this.idElement,
                "DELETE");
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('idElement');
                location.href = '#/cost';
            }
        } catch (error) {
            console.log(error);
        }
    }
}