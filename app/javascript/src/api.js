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

            window.location.href = '/sign_in';
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

    requestToken = async () => {
        this.setLoading('login');

        const res = await this.post('request_token', {
            checkRefresh: false,
        });

        if (!res.error) {

            window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.token}`;

            return true;

        } else {

            return false;

        }

    }

    accessToken = async (params) => {
        this.setLoading('login');

        const res = await this.post('access_token', {
            params,
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'login',
                token: res.auth_token,
                user: res.user,
            });
            
            window.location.href = '/admin';
            
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

    getUser = async (params) => {
        this.setLoading('user');

        const res = await this.get('current_user', {
            params,
            errorType: 'user',
        });
        
        if (!res.error)
            store.reduce({
                type: 'set_user',
                user: res.user,
            });
    }

    createList = async (list) => {
        this.setLoading('lists');

        const res = await this.post('lists', {
            params: { list },
            errorType: 'lists',
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

    destroyList = async (type) => {
        const res = await this.get(`lists/${type}`, {
            method: 'DELETE',
            errorType: 'lists',
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

    search = async (type, term, offset=0) => {
        this.setLoading('search');

        const res = await this.get(`lists/${type}/search`, {
            params: { term, offset },
            errorType: 'search',
        });

        if (!res.error) {

            store.reduce({
                type: 'search_results',
                searchType: type,
                results: res.results,
                push: offset > 0,
            });

            return true;

        } else {

            return false;

        }
    }

    scrape = async (url) => {
        this.setLoading('scrape');

        const res = await this.get('items/scrape', {
            params: { url },
            errorType: 'scrape',
        });

        if (!res.error) {

            store.reduce({
                type: 'scrape',
                result: res,
            })

            return true;

        } else {

            return false;

        }
    }

    createItem = async (listType, item) => {
        this.setLoading('items');

        const res = await this.post(`lists/${listType}/items`, {
            params: { item },
            errorType: 'items',
        });

        if (!res.error) {

            store.reduce({
                type: 'add_item',
                item: res.item,
            });

            return true;

        } else {

            return false;

        }
    }

    destroyItem = async (type, id) => {
        const res = await this.get(`lists/${type}/items/${id}`, {
            method: 'DELETE',
            errorType: 'items',
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

    updateItemIndex = async () => {
        const list = this.store.currentList();
        const res = await this.post(`lists/${list.type}/item_index`, {
            params: { items: list.items },
            errorType: 'items',
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

    updateListIndex = async () => {
        const res = await this.post(`lists/index`, {
            params: { lists: this.store.state.user.lists },
            errorType: 'lists',
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