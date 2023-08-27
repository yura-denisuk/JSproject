import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class BuildingElement {
    static showCategoryCards(category, wrapperElement, hash) {

        for (let i = 0; i < category.length; i++) {
            const showItemElement = document.createElement('div');
            showItemElement.className = 'cost-item p-3 border border-secondary rounded-1 border-opacity-50 me-3 mb-3';

            const showItemElementTitle = document.createElement('h2');
            showItemElementTitle.className = 'cost-title mb-2 text-color';
            showItemElementTitle.innerText = category[i].title;

            const wrapperButtonsElement = document.createElement('div');
            wrapperButtonsElement.className = 'cost-buttons';
            wrapperButtonsElement.setAttribute('id', category[i].id);

            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary me-2';
            editButton.innerText = 'Редактировать';
            editButton.setAttribute('type', 'button');
            editButton.onclick = () => {
                localStorage.setItem('idElement', editButton.parentElement.getAttribute('id'));
                location.href = '#/' + hash;
            }

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger';
            removeButton.innerText = 'Удалить';
            removeButton.setAttribute('type', 'button');
            removeButton.setAttribute('data-bs-toggle', 'modal');
            removeButton.setAttribute('data-bs-target', '#staticBackdrop');
            removeButton.onclick = () => {
                localStorage.setItem('idElement', editButton.parentElement.getAttribute('id'));
            }

            wrapperButtonsElement.appendChild(editButton);
            wrapperButtonsElement.appendChild(removeButton);

            showItemElement.appendChild(showItemElementTitle);
            showItemElement.appendChild(wrapperButtonsElement);

            wrapperElement.prepend(showItemElement);
        }
    }

    static buildingTableProfitCost(result, wrapperElement) {

        wrapperElement.innerHTML = '';

        for (let i = 0; i < result.length; i++) {
            const ItemElement = document.createElement('tr');
            ItemElement.className = 'text-center';

            const numElement = document.createElement('th');
            numElement.innerText = String(i + 1);
            numElement.setAttribute('scope', 'row');

            const typeElement = document.createElement('td');
            if (result[i].type === 'income') {
                typeElement.className = 'text-success';
                typeElement.innerText = 'Доход';
            }
            if (result[i].type === 'expense') {
                typeElement.className = 'text-danger';
                typeElement.innerText = 'Расход';
            }

            const categoryNameElement = document.createElement('td');
            categoryNameElement.innerText = result[i].category;

            const valueElement = document.createElement('td');
            valueElement.innerText = String(result[i].amount) + '$';

            const dateElement = document.createElement('td');
            dateElement.innerText = result[i].date;

            const buttonsElement = document.createElement('td');
            buttonsElement.className = 'text-end pe-5';

            const commentElement = document.createElement('span');
            commentElement.innerText = result[i].comment;
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#staticBackdrop');
            deleteButton.className = 'btn border-0';
            deleteButton.innerHTML = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '              <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"\n' +
                '                    fill="black"/>\n' +
                '              <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"\n' +
                '                    fill="black"/>\n' +
                '              <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"\n' +
                '                    fill="black"/>\n' +
                '              <path fill-rule="evenodd" clip-rule="evenodd"\n' +
                '                    d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"\n' +
                '                    fill="black"/>\n' +
                '            </svg>';
            deleteButton.onclick = () => {
                this.setIdElement(result[i]);
            }

            const editButton = document.createElement('a');
            editButton.setAttribute('href', '#/editing-profit-cost');
            editButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '              <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"\n' +
                '                    fill="black"/>\n' +
                '            </svg>';
            editButton.onclick = () => {
                this.setIdElement(result[i]);
                this.setNameCategory(result[i]);
                this.setIncomeOrExpense(result[i]);
            }

            buttonsElement.appendChild(commentElement);
            buttonsElement.appendChild(deleteButton);
            buttonsElement.appendChild(editButton);

            ItemElement.appendChild(numElement);
            ItemElement.appendChild(typeElement);
            ItemElement.appendChild(categoryNameElement);
            ItemElement.appendChild(valueElement);
            ItemElement.appendChild(dateElement);
            ItemElement.appendChild(buttonsElement);

            wrapperElement.appendChild(ItemElement);
        }
    }

    //Удаление операций, связанных с удаляемыми категориями расходов/доходов
    static async removeOperations(idElement, type) {
        //Получаем объект категории по id для реализации удаления связанных с ним операций
        const getCategory = await CustomHttp.request(config.host + '/categories/' + type + '/' + idElement);
        const allOperations = await CustomHttp.request(config.host + '/operations?period=all&dateFrom=&dateTo=');
        for (let i = 0; i < allOperations.length; i++) {
            if (allOperations[i].category === getCategory.title) {
                try {
                    //Удаление связанных операций с удаляемой категорией
                    const remove = await CustomHttp.request(config.host + '/operations/' + allOperations[i].id,
                        "DELETE");
                    if (remove.error) {
                        throw new Error(remove.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    static canselActionCategory(hash) {
        localStorage.removeItem('idElement');
        location.href = '#/' + hash;
    }

    static setIdElement(operation) {
        localStorage.setItem('idElement', operation.id);
    }

    static setNameCategory(operation) {
        localStorage.setItem('nameCategory', operation.category);
    }

    static setIncomeOrExpense(operation) {
        localStorage.setItem('categoriesName', operation.type);
    }

    static getIdElement() {
        return Number(localStorage.getItem('idElement'));
    }

}