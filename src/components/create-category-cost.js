import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class CreateCategoryCost {
    constructor() {
        Balance.setActualBalance();
        this.createButton = document.getElementById('createCategoryCost');
        this.cancelButton = document.getElementById('cancelCreateCategoryCost');
        let that = this;

        //создаем обработчик событий для кнопки создания категории дохода
        this.createButton.onclick = function() {
            that.createCategoryCost();
        }

        //создаем обработчик событий для кнопки отмены создания категории дохода
        this.cancelButton.onclick = function() {
            that.cancelCreateCategoryCost();
        }


    }

    async createCategoryCost() {
        const nameCategoryCost = document.getElementById('nameCategoryCost');

        try {
            if (nameCategoryCost.value) {
                let result = await CustomHttp.request(config.host + '/categories/expense', "POST", {
                    title: nameCategoryCost.value
                });
                if (!result && result.error) {
                    throw new Error(result.message);
                } else {
                    location.href = '#/cost';
                }
            } else {
                alert('Введите наименование категории!');
            }
        } catch (error) {
            console.log(error)
        }
    }

    cancelCreateCategoryCost() {
        location.href = '#/cost';
    }
}