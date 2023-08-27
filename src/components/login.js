import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Login {
    constructor() {
        this.processElement = document.getElementById('login');
        this.agreeElement = document.getElementById('flexCheckDefault');
        this.email = null;
        this.password = null;
        this.rememberMe = false;

        this.fields =
            [
                {
                    name: 'email',
                    id: 'email',
                    element: null,
                    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    valid: false,
                },
                {
                    name: 'password',
                    id: 'password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                }
            ];

        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
            if (item.id === 'email') {
                this.email = item.element;
            }
            if (item.id === 'password') {
                this.password = item.element;
            }
        });

        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
            return true;
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
    }

    async processForm() {
        if (this.validateForm()) {
            this.page = window.location.hash;
            if (this.agreeElement.checked) {
                this.rememberMe = true;
            }

            if (this.page === '#/login') {

                try {
                    const result = await CustomHttp.request(config.host + '/login', "POST", {
                        email: this.email.value,
                        password: this.password.value,
                        rememberMe: this.rememberMe,
                    });

                        if (result) {
                            if (!result.user || !result.tokens) {
                                throw new Error('Ошибка при отправке запроса на получение accessToken! Отсутствует ответ с accessToken и информацией о пользователе!');
                            }

                            Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);

                            if (this.rememberMe) {
                                Auth.setUserInfo(result.user);
                            }

                            document.getElementById('menu').style.display = 'block';
                            location.href = '#/';
                        }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }


}