import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class Balance {
    //Обновление баланса при добавлении дохода/расхода
    static async setActualBalance() {
        let balanceElement = document.getElementById('balance');
        try {
            const response = await CustomHttp.request(config.host + '/balance');
            if (response.error) {
                throw new Error(response.message);
            } else {
                return balanceElement.textContent = String(response.balance);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Обновление баланса при удалении дохода/расхода
    static async changeBalanceAfterRemoveOperation(idElement) {
        try {
            //Получаем объект операции по id для реализации изменения баланса
            const getOperation = await CustomHttp.request(config.host + '/operations/' + idElement);
            if (getOperation.error) {
                throw new Error(getOperation.message);
            } else {
                try {
                    const balanceValue = await CustomHttp.request(config.host + '/balance');
                    if (balanceValue.error) {
                        throw new Error(balanceValue.message);
                    } else {
                        try {
                            let newBalanceValue = null;
                            if (getOperation.type === 'income') {
                                newBalanceValue = balanceValue.balance - getOperation.amount;
                            }
                            if (getOperation.type === 'expense') {
                                newBalanceValue = balanceValue.balance + getOperation.amount;
                            }

                            const changeBalanceValue = await CustomHttp.request(config.host + '/balance', 'PUT', {
                                newBalance: newBalanceValue
                            });

                            if (changeBalanceValue.error) {
                                throw new Error(changeBalanceValue.message);
                            } else {
                                this.setActualBalance();
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}