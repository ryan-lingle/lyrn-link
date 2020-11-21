class Store {
    constructor() {
        this.state = {
            user: {
                username: localStorage.getItem('username'),
            },
            loading: {},
            errors: {},
            success: {},
            searchResults: {},
        }

        this.setState = () => {};
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    reduce(event) {
        console.log(event);

        switch (event.type) {
        case 'login':
            this.state.loading.login = false;
            localStorage.setItem('username', event.user.username);
            localStorage.setItem('authToken', event.token);
            localStorage.setItem('tokenExpires', this.tenMinFromNow());
            this.state.user = event.user;
            break;
        case 'set_user':
            this.state.loading.login = false;
            this.state.loading.update_user = false;
            this.state.loading.update_password = false;
            this.state.loading.profile_picture = false;
            localStorage.setItem('username', event.user.username);
            this.state.user = event.user || {};
            break;
        case 'search_results':
            this.state.searchResults[event.searchType] = event.results;
            break;
        case 'error':
            this.state.loading[event.errorType] = null;
            this.state.success[event.errorType] = null;
            this.state.errors[event.errorType] = event.error;
            break;
        case 'loading':
            this.state.success[event.loadingType] = null;
            this.state.errors[event.loadingType] = null;
            this.state.loading[event.loadingType] = true;
            break;
        case 'success':
            this.state.errors[event.successType] = null;
            this.state.loading[event.successType] = null;
            this.state.success[event.successType] = event.success;
            break;
        default:
            break;
        };
        this.setState(this.state);
    }

    tenMinFromNow() {
        return new Date(new Date().getTime() + 600000);
    }
}

export let store = new Store();
