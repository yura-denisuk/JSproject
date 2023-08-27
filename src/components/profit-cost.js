import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "../services/building-element.js";
import {Balance} from "../services/balance.js";
import AirDatepicker from "air-datepicker";
import {Filter} from "../services/filter.js";

export class ProfitCost {
    constructor() {
        Balance.setActualBalance();
        this.buttons = document.getElementsByClassName('btn-filter');
        this.buttonInterval = document.getElementById('button-interval');

        //Подключаем airdatapicker для задания промежутка времени в фильтре
        new AirDatepicker('#with');
        new AirDatepicker('#before');

        //Переход для создания вида категории доход
        this.createProfitButton = document.getElementById('createProfit');
        this.createProfitButton.onclick = () => {
            location.href = '#/create-profit-cost';
        }

        //Переход для создания вида категории расход
        this.createCostButton = document.getElementById('createCost');
        this.createCostButton.onclick = () => {
            location.href = '#/create-profit-cost';
        }

        //Находим DOM-элемент, в который будет встраиваться таблица
        this.tableElement = document.getElementById('table');

        //Загрузка операций дохода/расхода "Сегодня" по умолчанию
        window.addEventListener('DOMContentLoaded', this.initShowFilterElementDefault());

        //Загрузка фильтра
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].onclick = () => {
                this.initShowFilterElement(this.buttons[i], this.tableElement);

                //Вешаем на кнопки класс active
                for (let j = 0; j < this.buttons.length; j++) {
                    this.buttons[j].classList.remove('active');
                }

                return this.buttons[i].classList.add('active');

            }
        }

        //Обрабатываем модальное окно удаления операции
        this.deleteOperation = document.getElementById('deleteOperation');

        this.deleteOperation.onclick = () => {
            this.deleteOperationProfitCost();
        }

        this.cancelDeleteOperation = document.getElementById('cancelDeleteOperation');
        this.cancelDeleteOperation.onclick = () => {
            localStorage.removeItem('idElement');
        }

        //Обрабатываем разблокировку кнопки "Интервал" при наличии дат в полях ввода
        Filter.activeButtonInterval();
    }

    initShowFilterElementDefault() {
        return Filter.showFilterElementDefault(this.tableElement);
    }

    initShowFilterElement(buttons, tableElement) {
        return Filter.showFilterElement(buttons, tableElement);
    }



    async deleteOperationProfitCost() {
        let operationId = BuildingElement.getIdElement();
        try {
            const response = await CustomHttp.request(config.host + '/operations/' + operationId,
                "DELETE");
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('idElement');
                location.href = '#/profit-cost';
            }
        } catch (error) {
            console.log(error);
        }
        await Balance.changeBalanceAfterRemoveOperation(operationId);
    }
}

