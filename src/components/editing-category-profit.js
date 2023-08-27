import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "../services/building-element.js";
import {Balance} from "../services/balance.js";


export class EditingCategoryProfit {
    constructor() {
        Balance.setActualBalance();
        this.idElement = BuildingElement.getIdElement();
        this.newNameCategoryProfit = document.getElementById('newNameCategoryProfit');

        this.editCategoryProfitButton = document.getElementById('editCategoryProfitButton');
        this.editCategoryProfitButton.onclick = () => {
            this.editCategoryProfit();
        }

        this.cancelEditCategoryProfitButton = document.getElementById('cancelEditCategoryProfitButton');
        this.cancelEditCategoryProfitButton.onclick = () => {
            localStorage.removeItem('profit');
            BuildingElement.canselActionCategory('profit');
        }
    }

    async editCategoryProfit() {
        try {
            if (this.newNameCategoryProfit.value) {
                const response = await CustomHttp.request(config.host + '/categories/income/' + this.idElement,
                    "PUT", {
                        "title": this.newNameCategoryProfit.value
                    });

                if (!response) {
                    throw new Error("Неправильно отправлен запрос на изменение категории!");
                } else {
                    localStorage.removeItem('idElement');
                    location.href = '#/profit';
                }
            } else {
                alert('Введите наименование категории!');
            }
        } catch (error) {
            console.log(error);
        }
    }
}