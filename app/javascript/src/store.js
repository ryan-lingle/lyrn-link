class Store {
    constructor() {
        this.state = {
            user: {
                username: localStorage.getItem('username'),
                lists: [],
            },
            users: [],
            userCount: 0,
            readOnly: true,
            listIndex: 0,
            tab: 'lists',
            loading: {
                user: true,
            },
            errors: {},
            success: {},
            searchResults: {},
            scrapeResult: {},
            likeCount: 0,
            liked: null,
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
        case 'set_users':
            this.state.loading.users = false;
            this.state.users = event.users;
            this.state.userCount = event.count;
            break;
        case 'set_user':
            this.state.loading.login = false;
            this.state.loading.user = false;
            this.state.loading.update_user = false;
            this.state.loading.profile_picture = false;
            if (event.user.username) localStorage.setItem('username', event.user.username);
            this.state.user = { ...this.state.user, ...event.user };
            this.state.readOnly = event.readOnly;
            break;
        case 'set_tab':
            this.state.tab = event.tab;
            break;
        case 'add_list':
            this.state.loading.lists = false;
            this.state.user.lists.push(event.list);
            break;
        case 'set_list_index':
            if (Number.isInteger(event.index)) {
                this.state.listIndex = event.index;
            }
            if (event.listType) {
                this.state.listIndex = this.findIndexFromType(event.listType)
            }
            break;
        case 'swap_lists':
            let newIndex = this.state.listIndex;
            if (this.state.listIndex == event.dragIndex) {
                newIndex = event.hoverIndex;
            }
            if (this.state.listIndex == event.hoverIndex) {
                newIndex = event.dragIndex;
            }
            this.state.listIndex = newIndex;
            const lists = this.state.user.lists;
            const dragList = lists[event.dragIndex];
            dragList.index = event.hoverIndex;
            lists[event.dragIndex] = lists[event.hoverIndex];
            lists[event.hoverIndex].index = event.dragIndex;
            lists[event.hoverIndex] = dragList;
            break;
        case 'add_item':
            this.state.loading.items = false;
            this.currentList().items.push(event.item);
            break;
        case 'swap_items':
            const items = this.currentList().items;
            const dragItem = items[event.dragIndex];
            dragItem.index = event.hoverIndex;
            items[event.dragIndex] = items[event.hoverIndex];
            items[event.hoverIndex].index = event.dragIndex;
            items[event.hoverIndex] = dragItem;
            break;
        case 'search_results':
            this.state.loading.search = false;
            if (event.push) {
                this.state.searchResults[event.searchType] = this.state.searchResults[event.searchType].concat(event.results);
            } else {
                this.state.searchResults[event.searchType] = event.results;
            };
            break;
        case 'scrape':
            this.state.loading.scrape = false;
            this.state.scrapeResult = event.result;
            break;
        case 'set_liked':
            this.state.liked = event.liked;
            if (event.count) {
                this.state.likeCount = event.count;
            } else {
                if (this.state.liked === false) {
                    if (this.state.likeCount > 0)
                        this.state.likeCount -= 1
                } else {
                    this.state.likeCount += 1
                }
            }
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

    currentList = () => {
        if (this.state.tab === 'lists') {
            return this.state.user.lists[this.state.listIndex];
        } else {
            return this.state.user[this.state.tab];
        }
    }

    findIndexFromType = (listType) => {
        return this.state.user.lists.findIndex(({ type }) => type === listType) || 0;
    }
}

export let store = new Store();
