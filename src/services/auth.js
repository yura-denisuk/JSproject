import config from "../../config/config.js";
import {CustomHttp} from "./custom-http.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnouthorizedResponse() {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }

        this.removeTokens();
        location.href = '#/';
        return false;
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static async logout() {

        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
            try {

                const result = await CustomHttp.request(config.host + '/logout', "POST", {
                    refreshToken: refreshToken,
                });

                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    location.href = '#/login';
                    return true;
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            return console.log('В localstorage отсутствует информация о refreshToken!')
        }
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}