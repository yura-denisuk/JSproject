import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "../services/building-element.js";
import {Balance} from "../services/balance.js";


export class EditingCategoryCost {
    constructor() {
        Balance.setActualBalance();
        this.idElement = BuildingElement.getIdElement();
        this.newNameCategoryCost = document.getElementById('newNameCategoryCost');

        this.editCategoryCostButton = document.getElementById('editCategoryCostButton');
        this.editCategoryCostButton.onclick = () => {
            this.editCategoryCost();
        }

        this.cancelEditCategoryCostButton = document.getElementById('cancelEditCategoryCostButton');
        this.cancelEditCategoryCostButton.onclick = () => {
            localStorage.removeItem('cost');
            BuildingElement.canselActionCategory('cost');
        }
    }

    async editCategoryCost() {
        try {
            if (this.newNameCategoryCost.value) {
                const response = await CustomHttp.request(config.host + '/categories/expense/' + this.idElement,
                    "PUT", {
                        "title": this.newNameCategoryCost.value
                    });

                if (!response) {
                    throw new Error("Неправильно отправлен запрос на изменение категории!");
                } else {
                    localStorage.removeItem('idElement');
                    location.href = '#/cost';
                }
            } else {
                alert('Введите наименование категории!');
            }
        } catch (error) {
            console.log(error);
        }
    }
}