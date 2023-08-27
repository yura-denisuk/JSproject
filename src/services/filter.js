import {ChangeDate} from "./changeDate.js";
import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";
import {BuildingElement} from "./building-element.js";

export class Filter {

    static activeButtonInterval() {
        this.buttonInterval = document.getElementById('button-interval');

        //Обрабатываем разблокировку кнопки "Интервал" при наличии дат в полях ввода
        document.getElementById('with').addEventListener('focusout', () => {
            let withValue = document.getElementById('with');
            let beforeValue = document.getElementById('before');
            if (withValue.value && beforeValue.value) {
                this.buttonInterval.disabled = false;
            }
        })

        document.getElementById('before').addEventListener('focusout', () => {
            let withValue = document.getElementById('with');
            let beforeValue = document.getElementById('before');
            if (withValue.value && beforeValue.value) {
                this.buttonInterval.disabled = false;
            }
        })
    }

    static async showFilterElementDefault(tableElement = null) {
        let actualDate = new Date();
        actualDate = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
        let result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
        if (tableElement) {
            BuildingElement.buildingTableProfitCost(result, tableElement);
        }
    }


    static async showFilterElement(button, tableElement = null) {
        let actualDate = new Date();
        let dateResponse = null;
        let dateResponseArray = [];
        let decreaseDate = null;
        let actualDateFormat = null;
        let responseDateFormat = null;
        let result = null;

        try {
            switch (button.innerText) {
                case 'Неделя':
                    decreaseDate = actualDate.getTime() - 604800000;
                    dateResponse = new Date(decreaseDate);
                    actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = ChangeDate.ChangeDateFormatFilter(dateResponse.toLocaleDateString());
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Месяц':
                    let actualDateMonthArray = actualDate.toLocaleDateString().split('.');
                    let newMonth = Number(actualDateMonthArray[1]) - 1;
                    dateResponseArray[0] = actualDateMonthArray[2];
                    dateResponseArray[1] = '0' + String(newMonth);
                    dateResponseArray[2] = actualDateMonthArray[0];
                    actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = dateResponseArray.join('-');
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Год':
                    let actualDateYearArray = actualDate.toLocaleDateString().split('.');
                    let newYear = Number(actualDateYearArray[2]) - 1;
                    dateResponseArray[0] = String(newYear);
                    dateResponseArray[1] = actualDateYearArray[1];
                    dateResponseArray[2] = actualDateYearArray[0];
                    actualDateFormat = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = dateResponseArray.join('-');
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Все':
                    result = await CustomHttp.request(config.host + '/operations?period=all&dateFrom=&dateTo=');
                    break;
                case 'Интервал':
                    responseDateFormat = document.getElementById('with');
                    actualDateFormat = document.getElementById('before');
                    if (responseDateFormat.value && actualDateFormat.value) {
                        result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + ChangeDate.ChangeDateFormat(responseDateFormat) + '&dateTo=' + ChangeDate.ChangeDateFormat(actualDateFormat));
                        responseDateFormat.value = '';
                        actualDateFormat.value = '';
                    }
                    break;
                default:
                    actualDate = ChangeDate.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
                    break;
            }

            if (!result && result.error) {
                throw new Error(result.message);
            } else {
                if (tableElement) {
                    BuildingElement.buildingTableProfitCost(result, tableElement);
                }
                console.log(result);
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

