const GLOBALS = require('./settings/Globals');
const API_URIs = require('./settings/API_URIs');

import {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './route/NavigationService';

export default class AppComponent extends Component {
    static navigationOptions = {
        header: null,
    };

    // Дополнительный state
    defState = {
        // Старус проверки авторизации null|true|false
        isAuthorized: null,
        // Лоадер на странице
        loading: null,
        // Данные текущего пользователя
        userData: {
            bonus_balance: null,
        },
    }

    // Авторизационный токен
    authToken = null;

    constructor(props) {
        super(props);
    }

    // Включает лоадер на странице (для загрузки данных с бэк-энда)
    enableLoader = () => {
        this.setState({loading: true});
    }

    // Отключает лоадер на странице (после загрузки данных с бэк-энда)
    disableLoader = () => {
        this.setState({loading: false});
    }

    sendUsualRequest = async (uri, data, successCallback, failCallback) => {

        let formdata = new FormData();
        for (let key in data) {
            formdata.append(key, data[key]);
        }
        formdata.append('APP_VERSION', GLOBALS.APP_VERSION);

        fetch(uri, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formdata,
        })
            .then(response => response.json())
            .then(responseJson => {

                // Костыль | Старый авторизационный токен
                if (responseJson.message === 'Unauthenticated.') {
                    return;
                }

                if (responseJson.status === 'success') {
                    successCallback(responseJson);
                } else {
                    if (failCallback) {
                        failCallback(responseJson);
                    } else {
                        this.onApiError(responseJson, uri);
                    }
                }
            })
            .catch(error => {
                this.onNetworkError(error, uri);
            });
    }

    // Вызывается при ошибке API-запроса
    onApiError = (response, uri) => {
        alert(response.message || 'Произошла ошибка при обработке запроса');
        try {
            if (GLOBALS.ROLLBAR_LOG_ENABLE) {
                this.rollbar.error(`${uri}: ${response.message}`, response);
            }
        } catch (e) { ; }
    }

    // Вызывается при ошибочном коде (5xx, 4xx) запроса
    onNetworkError = (error, uri) => {
        alert(error.message || 'Произошла ошибка при отправке запроса');
        try {
            if (GLOBALS.ROLLBAR_LOG_ENABLE) {
                this.rollbar.error(`${uri}: ${error.message}`, error);
            }
        } catch (e) { ; }
    }

}
