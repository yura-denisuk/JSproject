import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class CreateCategoryProfit {
    constructor() {
        Balance.setActualBalance();
        this.createButton = document.getElementById('createCategoryProfit');
        this.cancelButton = document.getElementById('cancelCreateCategoryProfit');
        let that = this;

        //создаем обработчик событий для кнопки создания категории дохода
        this.createButton.onclick = function() {
            that.createCategoryProfit();
        }

        //создаем обработчик событий для кнопки отмены создания категории дохода
        this.cancelButton.onclick = function() {
            that.cancelCreateCategoryProfit();
        }


    }

    async createCategoryProfit() {
        const nameCategoryProfit = document.getElementById('nameCategoryProfit');

        try {
            if (nameCategoryProfit.value) {
                let result = await CustomHttp.request(config.host + '/categories/income', "POST", {
                    title: nameCategoryProfit.value
                });
                if (!result && result.error) {
                    throw new Error(result.message);
                } else {
                    location.href = '#/profit';
                }
            } else {
                alert('Введите наименование категории!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    cancelCreateCategoryProfit() {
        location.href = '#/profit';
    }
}