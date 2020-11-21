import { store } from './store';

class Api {
    baseUrl = '/api/v1/'
    authToken = localStorage.getItem('authToken')
    railsToken = document.getElementsByName('csrf-token')[0].content
    store = store

    get = async (path, { params={}, url=this.baseUrl, method='GET', checkRefresh=true, errorType='standard' } = {}) => {
        if (checkRefresh) await this.maybeRefreshToken();

        const json = await fetch(url  + path + this.querify(params), {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
                'X-CSRF-Token': this.railsToken
            }
        });

        return await this.handleResponse(json, errorType);
    }

    querify = (query) => {
        const pairs = Object.keys(query).map(key => {
            return key + '=' + query[key];
        });

        return '?' + pairs.join('&');
    }

    post = async (path, { params={}, url=this.baseUrl, method='POST', checkRefresh=true, errorType='standard' } = {}) => {
        if (checkRefresh) await this.maybeRefreshToken();

        const json = await fetch(url + path, {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
                'X-CSRF-Token': this.railsToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        });

        return await this.handleResponse(json, errorType);
    }

    maybeRefreshToken = async () => {
        const tokenExpires = new Date(localStorage.getItem('tokenExpires'));
        const now = new Date();

        if (tokenExpires && now > tokenExpires) {

            const res = await this.get('refresh_token', {
                errorType: 'login',
                checkRefresh: false,
            });

            this.authToken = res.auth_token;
            store.reduce({
                type: 'login',
                token: res.auth_token,
                user: res.user,
            });

        }
    }

    handleResponse = async (json, errorType) => {
        if (json.status === 401) {

            window.location.href = '/login';
            return {};

        } else {

            const res = await json.json();
            if (res.error) {
                store.reduce({
                    type: 'error',
                    errorType,
                    error: res.error,
                });
                return { error: true };
            }
            return res;

        }
    }

    createUser = async (user) => {
        this.setLoading('login');

        const res = await this.post('sign_up', { 
            params: { user },
            errorType: 'login',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'login',
                token: res.auth_token,
                user: res.user,
            });

            window.location.href = "/";

            return true;

        } else {

            return false;

        }
    }

    updateUser = async (id, user, type='update_user') => {
        this.setLoading(type);

        const res = await this.post(`users/${id}`, { 
            params: { user },
            errorType: type,
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                user: res.user,
            });

            return true;

        } else {

            return false;

        }
    }

    updateProfilePicture = async (id, image, type='profile_picture') => {
        this.setLoading(type);

        const res = await this.post(`users/${id}/profile_picture`, { 
            params: { image },
            errorType: type,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                user: res.user,
            });

            return true;

        } else {

            return false;

        }
    }

    destroyUser = async (id) => {
        this.get(`users/${id}`, {
            method: 'DELETE',
            errorType: 'users',
        });
    }

    login = async (user, redirectTo="/") => {
        this.setLoading('login');

        const res = await this.post('login', {
            params: { user },
            errorType: 'login',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'login',
                token: res.auth_token,
                user: res.user,
            });

            window.location.href = redirectTo;

            return true;

        } else {

            return false;

        }
    }

    getUser = async () => {
        this.setLoading('login');

        const res = await this.get('current_user', {
            errorType: 'login',
        });
        
        if (!res.error)
            store.reduce({
                type: 'set_user',
                user: res.user,
            });
    }

    createPasswordReset = async (email) => {
        this.setLoading('login');

        return await this.post('reset_password', {
            params: { email },
            errorType: 'login',
            checkRefresh: false,
        });

    }

    changePassword = async (params) => {
        this.setLoading('login');

        return await this.post('change_password', {
            params,
            errorType: 'login',
            checkRefresh: false,
        });

    }

    setError = (errorType, error) => {
        store.reduce({
            type: errorType,
            error,
        });
    }

    setLoading = (loadingType) => (
        store.reduce({
            type: 'loading',
            loadingType,
        })
    )
}

export let api = new Api();
window.api = api;