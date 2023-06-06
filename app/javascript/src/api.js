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
            params: { 
                ...params,
                affiliate: localStorage.getItem('affiliate'),
                token: localStorage.getItem('token'),
                group_id: localStorage.getItem('group_id'),
            },
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

    googleLogin = async (params, redirectTo="/admin") => {
        this.setLoading('login');

        const res = await this.post('google', {
            params: { 
                fetch: true, 
                ...params,
                affiliate: localStorage.getItem('affiliate'),
                token: localStorage.getItem('token'),
                group_id: localStorage.getItem('group_id'),
            },
            errorType: 'login',
            checkRefresh: false,
        })

        if (!res.error) {

            store.reduce({
                type: 'login',
                token: res.auth_token,
                user: res.user,
            });

            console.log(redirectTo);

            window.location.href = redirectTo;

            return true;

        } else {

            return false;

        }
    }

    createUser = async (user) => {
        this.setLoading('login');

        const res = await this.post('sign_up', { 
            params: {
                user: { ...user, token: localStorage.getItem('token') },
                affiliate: localStorage.getItem('affiliate'),
                group_id: localStorage.getItem('group_id'),
            },
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
                ...res,
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
                ...res,
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
                type: 'set_tab_index',
                index: store.state.user.lists.length - 1,
            });

            return true;

        } else {

            return false;

        }
    }

    createGroupInvite = async (group_invite) => {
        this.setLoading('group_relationship');

        const res = await this.post('group_invites', {
            params: { group_invite },
            errorType: 'group_relationship',
        });

        if (!res.error) {

            if (res.user) {
                store.reduce({
                    type: 'add_member',
                    ...res,
                });
            } else {
                store.reduce({
                    type: 'success',
                    successType: 'group_relationship',
                    success: `Invite email sent to ${res.email}!`,
                });
            }

            return true;

        } else {

            return false;

        }
    }

    createGroupRelationship = async (group_relationship) => {
        this.setLoading('group_relationship');

        const res = await this.post('group_relationships', {
            params: { group_relationship },
            errorType: 'group_relationship',
        });

        if (!res.error) {

            if (!group_relationship.accepted) {
                store.reduce({
                    type: 'add_member',
                    ...res,
                });
            }

            return true;

        } else {

            return false;

        }
    }

    updateGroupRelationship = async (group_id, group_relationship) => {
        this.setLoading('group_relationship');

        const res = await this.post(`group_relationships/${group_id}`, {
            params: { group_relationship },
            errorType: 'group_relationship',
            method: 'PATCH',
        });

        if (!res.error) {
            
            return true;

        } else {

            return false;

        }
    }

    destroyGroupRelationship = async (group_id) => {
        this.setLoading('group_relationship');

        const res = await this.get(`group_relationships/${group_id}`, {
            errorType: 'group_relationship',
            method: 'DELETE',
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

    userSearch = async (term, offset=0) => {
        this.setLoading('search');

        const res = await this.get('users/search', {
            params: { term },
        });

        if (!res.error) {

            store.reduce({
                type: 'search_results',
                searchType: 'users',
                results: res.results,
                push: offset > 0,
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
            params: { bookmark: { meta_item_id: id } },
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

    getDiscoverUsers = async (offset) => {
        const res = await this.get(`users/discover?offset=${offset}`, {
            errorType: 'discover',
        });

        if (!res.error) {

            store.reduce({
                type: 'add_discover_users',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getDiscoverItems = async (offset) => {
        const res = await this.get(`items/discover?offset=${offset}`, {
            errorType: 'discover',
        });

        if (!res.error) {

            store.reduce({
                type: 'add_discover_items',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getIndexGroup = async (handle) => {
        // this.setLoading('groups');

        const res = await this.get(`groups/${handle}/index`, {
            errorType: 'groups',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_group',
                ...res,
            });

        } else {

            return false;
            
        }
    }

    getGroup = async (handle) => {
        this.setLoading('groups');

        const res = await this.get(`groups/${handle}`, {
            errorType: 'groups',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_group',
                ...res,
            });

        } else {

            return false;
            
        }
    }

    createGroup = async (group) => {
        this.setLoading('create_group');

        const res = await this.post('groups', {
            params: { group },
            errorType: 'create_group',
        });

        if (!res.error) {

            store.reduce({
                type: 'add_group',
                ...res
            });

            return true;

        } else {

            return false;

        }
    }

    updateGroup = async (id, group) => {
        this.setLoading('update_group');

        const res = await this.post(`groups/${id}`, { 
            params: { group },
            errorType: 'update_group',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_group',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateGroupImage = async (id, image, type='profile_picture') => {
        this.setLoading(type);

        const res = await this.post(`groups/${id}/image`, { 
            params: { image },
            errorType: type,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_group',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    destroyGroup = async (id) => {
        const res = await this.get(`groups/${id}`, {
            method: 'DELETE',
            errorType: 'groups',
        });

        if (!res.error) {

            window.location.href = '/admin/circle/groups';
            
            return true;

        } else {

            return false;

        }
    }

    getItem = async (id) => {
        const res = await this.get(`items/${id}`, {
            errorType: 'items',
        });
        
        if (!res.error) {
                
            store.reduce({
                type: 'set_item',
                ...res,
            });

            return true;

        } else {

            return false;

        }

    }

    updateItem = async (id, item) => {
        this.setLoading('update_item');

        const res = await this.post(`items/${id}`, {
            params: { item },
            errorType: 'update_item',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_item',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    createComment = async (id, comment) => {
        this.setLoading('comments');
        
        const res = await this.post(`items/${id}/comments`, {
            params: { comment },
            errorType: 'comments',
        });

        if (!res.error) {

            store.reduce({
                type: 'add_comment',
                ...res,
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