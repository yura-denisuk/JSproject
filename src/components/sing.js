import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Sing {
    constructor() {
        this.processElement = document.getElementById('sing');
        this.password = null;
        this.repeatPassword = null;
        this.page = null;

        this.fields =
            [{
                name: 'name',
                id: 'name',
                element: null,
                regex: /\s?[А-Я][а-я]+\S*/,
                valid: false,
            },
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
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.id === "password") {
                this.password = item.element;
            }
            if (item.id === "repeat-password") {
                this.repeatPassword = item.element;
            }
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
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

    comparePasswordAndRepeatPassword() {
        if (this.password.value === this.repeatPassword.value) {
            return true;
        } else {
            this.repeatPassword.style.borderColor = 'red';
        }
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm && this.comparePasswordAndRepeatPassword()) {
            this.processElement.removeAttribute('disabled');
            return true;
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
    }

    async processForm() {
        if (this.validateForm()) {

            this.page = window.location.hash;

            if (this.page === '#/sing' || this.page === '') {

                try {
                    const result = await CustomHttp.request(config.host + '/signup', "POST", {
                        name: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.password.value,
                        passwordRepeat: this.repeatPassword.value,
                    });

                    if (result) {
                        if(!result.user) {
                            throw new Error('Ошибка при отправке запроса на регистрацию! Отсутствует информация о зарегистрированном пользователе!');
                        }

                        const resultLogin = await CustomHttp.request(config.host + '/login', "POST", {
                            email: result.user.email,
                            password: this.password.value,
                            rememberMe: false,
                        });

                        if (resultLogin) {
                            if (!resultLogin.user || !resultLogin.tokens) {
                                throw new Error('Ошибка при отправке запроса на получение accessToken! Отсутствует ответ с accessToken и информацией о пользователе!');
                            }

                            Auth.setTokens(resultLogin.tokens.accessToken, resultLogin.tokens.refreshToken);
                            Auth.setUserInfo(resultLogin.user);
                            document.getElementById('menu').style.display = 'block';
                            location.href = '#/';
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}