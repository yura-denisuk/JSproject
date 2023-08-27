import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "../services/building-element.js";
import {Balance} from "../services/balance.js";

export class Profit {
    constructor() {
        Balance.setActualBalance();
        this.idElement = null;
        // получение перечня категорий дохода с сервера
        this.profitCategory = [];
        this.wrapperProfitCategories = document.getElementById('wrapper-profit-categories');
        this.getProfitCategories();

        //удаление категории
        this.removeCategoryProfit = document.getElementById('removeCategoryProfit');
        this.removeCategoryProfit.onclick = () => {
            this.removeProfitCategory();
        }

        //отмена удаления категории
        this.cancelRemoveCategoryProfit = document.getElementById('cancelRemoveCategoryProfit');
        this.cancelRemoveCategoryProfit.onclick = () => {
            localStorage.removeItem('profit');
            BuildingElement.canselActionCategory('profit');
        }


    }

    async getProfitCategories() {
        try {
            const response = await CustomHttp.request(config.host + '/categories/income');
            if (response.error) {
                throw new Error(response.message);
            } else {
                this.profitCategory = response;
                BuildingElement.showCategoryCards(this.profitCategory, this.wrapperProfitCategories, 'editing-category-profit');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async removeProfitCategory() {
        this.idElement = BuildingElement.getIdElement();
        try {
            await BuildingElement.removeOperations(this.idElement, 'income');
            const response = await CustomHttp.request(config.host + '/categories/income/' + this.idElement,
                "DELETE");
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('idElement');

                location.href = '#/profit';
            }
        } catch (error) {
            console.log(error);
        }
    }
}