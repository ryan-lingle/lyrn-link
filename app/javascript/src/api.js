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
            });

        }
    }

    handleResponse = async (json, errorType) => {
        if (json.status === 401) {

            window.location.href = '/signup';
            return {};

        } else if (json.status === 404) {
            window.location.href = '/404';
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

    login = async (user, redirectTo="/admin") => {
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

            window.location.href = "/admin";

            return true;

        } else {

            return false;

        }
    }

    sendConfirmationEmail = async () => {
        const res = await this.post('users/send_confirmation_email', {
            errorType: 'confirmation_email',
        });

        if (!res.error) {

            store.reduce({
                type: 'success',
                successType: 'confirmation_email',
                success: 'Confirmation email resent!',
            });

            return true;
            
        } else {

            return false;

        }

    }

    confirmEmail = async (token) => {
        const res = await this.post('users/confirm_email', {
            params: { token },
            errorType: 'confirm_email',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'login',
                ...res,
            });

            return true;

        } else {

            return false;
        }
    }

    signOut = async () => {
        const res = await this.post('sign_out', {
            checkRefresh: false
        });

        if (!res.error) {

            localStorage.clear();
            window.location.href = "/";
            return res.success;

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

    getUser = async (params={}) => {
        this.setLoading('user');

        const res = await this.get('current_user', {
            params,
            checkRefresh: this.authToken ? true : false,
            errorType: 'user',
        });
        
        if (!res.error) {
            store.reduce({
                type: 'set_user',
                ...res,
                readOnly: params.handle ? true : false,
            });

            return true;

        } else {

            return false;

        }
    }

    getUsers = async (params) => {
        this.setLoading('users');

        const res = await this.get('users', {
            errorType: 'users'
        });

        if (!res.error) {

            store.reduce({
                type: 'set_users',
                ...res,
            });

            return true;

        } else {

            return false;
            
        }

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

            store.reduce({
                type: 'set_list_index',
                index: store.state.user.lists.length - 1,
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

    createLike = async (id) => {
        const res = await this.post('likes', {
            params: { like: { link_id: id } },
            errorType: 'likes',
        });

        if (!res.error) {

            return res.liked;

        } else {

            return false;

        }
    }

    destroyLike = async (id) => {
        const res = await this.get(`likes/${id}`, {
            method: 'DELETE',
            errorType: 'likes',
        });

        if (!res.error) {

            return res.liked;

        } else {

            return false;

        }
    }

    createBookmark = async (id) => {
        const res = await this.post('bookmarks', {
            params: { bookmark: { item_id: id } },
            errorType: 'bookmarks',
        });

        if (!res.error) {

            return res.bookmarked;

        } else {

            return false;

        }
    }

    destroyBookmark = async (id) => {
        const res = await this.get(`bookmarks/${id}`, {
            method: 'DELETE',
            errorType: 'bookmarks',
        });

        if (!res.error) {

            return res.bookmarked;

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