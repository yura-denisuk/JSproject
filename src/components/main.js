import {Auth} from "../services/auth.js";
import AirDatepicker from "air-datepicker";
import {Chart} from 'chart.js/auto'
import {ChangeDate} from "../services/changeDate.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import {Filter} from "../services/filter.js";

export class Main {

    constructor() {
        Balance.setActualBalance();
        this.categoryNameProfitArray = [];
        this.categoryValueProfitArray = [];
        this.categoryColorProfitArray = [];
        this.categoryNameCostArray = [];
        this.categoryValueCostArray = [];
        this.categoryColorCostArray = [];
        this.result = null;
        this.refreshToken = null;
        this.myChartProfit = null;
        this.myChartCost = null;
        this.canvasProfit = document.getElementById('myChart-profit');
        this.canvasCost = document.getElementById('myChart-cost');

        //Обрабатываем разблокировку кнопки "Интервал" при наличии дат в полях ввода
        Filter.activeButtonInterval();

        //устанавливаем имя зарегистрированного пользователя внизу блока меню
        if (window.location.hash === '#/') {
            this.userName = document.getElementById('userName');
            this.userName.innerText = Auth.getUserInfo().name + ' ' + Auth.getUserInfo().lastName;
        }

        //реализуем функционал для кнопки выйти
        this.logoutElement = document.getElementById('logout');
        this.logoutElement.onclick = async function () {
            await Auth.logout();
            return;
        }

        //Поиск кнопок фильтра
        this.buttons = document.getElementsByClassName('btn-filter');

        //Загружаем airdatapicker в поля выбора даты
        new AirDatepicker('#with');
        new AirDatepicker('#before');

        //Загрузка операций дохода/расхода "Сегодня" по умолчанию
        window.addEventListener('DOMContentLoaded', () => this.initShowFilterElement());

        //Загрузка фильтра
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].onclick = () => {
                this.initShowFilterElement(this.buttons[i]);

                //Вешаем на кнопки класс active
                for (let j = 0; j < this.buttons.length; j++) {
                    this.buttons[j].classList.remove('active');
                }
                return this.buttons[i].classList.add('active');
            }
        }
    }

    async initShowFilterElement(buttons = null) {
        let actualDate = new Date();
        let dateResponse = null;
        let dateResponseArray = [];
        let decreaseDate = null;
        let actualDateFormat = null;
        let responseDateFormat = null;

        this.categoryNameProfitArray = [];
        this.categoryValueProfitArray = [];
        this.categoryColorProfitArray = [];
        this.categoryNameCostArray = [];
        this.categoryValueCostArray = [];
        this.categoryColorCostArray = [];
        if (this.myChartProfit) {
            this.myChartProfit.destroy();
        }
        if (this.myChartCost) {
            this.myChartCost.destroy();
        }


        try {
            if (buttons) {
                switch (buttons.innerText) {
                    case 'Неделя':
                        decreaseDate = actualDate.getTime() - 604800000;
                        dateResponse = new Date(decreaseDate);
                        actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = ChangeDate.ChangeDateFormatFilter(dateResponse.toLocaleDateString());
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Месяц':
                        let actualDateMonthArray = actualDate.toLocaleDateString().split('.');
                        let newMonth = Number(actualDateMonthArray[1]) - 1;
                        dateResponseArray[0] = actualDateMonthArray[2];
                        dateResponseArray[1] = '0' + String(newMonth);
                        dateResponseArray[2] = actualDateMonthArray[0];
                        actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = dateResponseArray.join('-');
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Год':
                        let actualDateYearArray = actualDate.toLocaleDateString().split('.');
                        let newYear = Number(actualDateYearArray[2]) - 1;
                        dateResponseArray[0] = String(newYear);
                        dateResponseArray[1] = actualDateYearArray[1];
                        dateResponseArray[2] = actualDateYearArray[0];
                        actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = dateResponseArray.join('-');
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Все':
                        this.result = await CustomHttp.request(config.host + '/operations?period=all&dateFrom=&dateTo=');
                        break;
                    case 'Интервал':
                        responseDateFormat = document.getElementById('with');
                        actualDateFormat = document.getElementById('before');
                        if (responseDateFormat.value && actualDateFormat.value) {
                            this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + ChangeDate.ChangeDateFormat(responseDateFormat) + '&dateTo=' + ChangeDate.ChangeDateFormat(actualDateFormat));
                            responseDateFormat.value = '';
                            actualDateFormat.value = '';
                        }
                        break;
                    default:
                        actualDate = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
                        break;
                }
            } else {
                actualDate = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
            }


            if (!this.result && this.result.error) {
                throw new Error(this.result.message);
            } else {
                let profitArray = this.result.filter(item => {
                    return item.type === 'income';
                });
                let costArray = this.result.filter(item => {
                    return item.type === 'expense';
                });

                console.log(profitArray);
                console.log(costArray);

                //Формирование данных для диаграммы Доходы
                try {
                    const profitCategory = await CustomHttp.request(config.host + '/categories/income');
                    if (profitCategory.error) {
                        throw new Error(profitCategory.message);
                    } else {

                        for (let i = 0; i < profitCategory.length; i++) {
                            this.categoryNameProfitArray[i] = profitCategory[i].title;
                        }

                        for (let i = 0; i < this.categoryNameProfitArray.length; i++) {
                            this.categoryValueProfitArray[i] = 0;
                            for (let j = 0; j < profitArray.length; j++) {
                                if (this.categoryNameProfitArray[i] === profitArray[j].category) {
                                    this.categoryValueProfitArray[i] += profitArray[j].amount;
                                }
                            }
                        }

                        for (let i = 0; i < this.categoryValueProfitArray.length; i++) {
                            this.categoryColorProfitArray[i] = `hsla(${Math.random() * 360}, 100%, 50%, 1)`
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                //Загрузка диаграммы доходов
                let ctxProfit = this.canvasProfit.getContext('2d');
                this.myChartProfit = new Chart(ctxProfit, {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: this.categoryValueProfitArray,
                            background: this.categoryColorProfitArray
                        }],
                        labels: this.categoryNameProfitArray
                    },
                    options: {
                        responsive: true
                    }
                })

                //Формирование данных для диаграммы Расходы
                try {
                    const costCategory = await CustomHttp.request(config.host + '/categories/expense');
                    if (costCategory.error) {
                        throw new Error(costCategory.message);
                    } else {

                        for (let i = 0; i < costCategory.length; i++) {
                            this.categoryNameCostArray[i] = costCategory[i].title;
                        }

                        for (let i = 0; i < this.categoryNameCostArray.length; i++) {
                            this.categoryValueCostArray[i] = 0;
                            for (let j = 0; j < costArray.length; j++) {
                                if (this.categoryNameCostArray[i] === costArray[j].category) {
                                    this.categoryValueCostArray[i] += costArray[j].amount;
                                }
                            }
                        }

                        for (let i = 0; i < this.categoryValueCostArray.length; i++) {
                            this.categoryColorCostArray[i] = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                //Загрузка диаграммы расходов
                let ctxCost = this.canvasCost.getContext('2d');
                this.myChartCost = new Chart(ctxCost, {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: this.categoryValueCostArray,
                            background: this.categoryColorCostArray
                        }],
                        labels: this.categoryNameCostArray
                    },
                    options: {
                        responsive: true
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
