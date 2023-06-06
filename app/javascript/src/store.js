class Store {
    constructor() {
        this.state = {
            current_user_id: null,
            current_user_profile_picture: null,
            user: {
                username: localStorage.getItem('username'),
                lists: [],
            },
            item: null,
            group: {},
            users: [],
            userCount: 0,
            readOnly: true,
            groupReadOnly: true,
            tabIndex: 0,
            tab: 'lists',
            loading: {
                user: true,
                groups: true,
            },
            errors: {},
            success: {},
            searchResults: {},
            scrapeResult: {},
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
            if (event.user) localStorage.setItem('username', event.user.username);
            localStorage.setItem('authToken', event.token);
            localStorage.setItem('tokenExpires', this.tenMinFromNow());
            this.state.user = { ...event.user, ...this.state.user };
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
            this.state.current_user_id = event.current_user_id || this.state.current_user_id;
            this.state.current_user_profile_picture = event.current_user_profile_picture || this.state.current_user_profile_picture;
            this.state.admin = event.admin;
            this.state.current_user_id = event.current_user_id;
            this.state.current_user_profile_picture = event.current_user_profile_picture;
            this.state.readOnly = event.readOnly;
            break;
        case 'set_tab':
            this.state.tab = event.tab;
            this.state.tabIndex = 0;
            this.state.item = null;
            break;
        case 'set_tab_index':
            this.state.item = null;
            if (Number.isInteger(event.tabIndex)) {
                this.state.tabIndex = event.tabIndex;
            }
            if (event.tabType) {
                this.state.tabIndex = this.findIndexFromType(event.tabType)
            }
            this.state.item = null;
            break;
        case 'add_list':
            this.state.loading.lists = false;
            this.getTab('lists').push(event.list);
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
            const lists = this.getTab('lists');
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
        case 'add_discover_users':
            this.getTab('discover')[0].items = this.getTab('discover')[0].items.concat(event.users);
            break;
        case 'add_discover_items':
            this.getTab('discover')[1].items = this.getTab('discover')[1].items.concat(event.items);
            break;
        case 'set_group':
            this.state.loading.groups = false;
            this.state.group = event.group;
            this.state.groupReadOnly = !event.admin;
            this.state.tab = 'group';
            break;
        case 'add_group':
            this.state.loading.create_group = false;
            this.getTab('circle')[2].items.push(event.group);
            break;
        case 'add_member':
            this.getTab('circle', 'group')[0].items.unshift(event.user);
            break;
        case 'set_item':
            this.state.loading.items = false;
            this.state.item =  event.item;
            break;
        case 'add_comment':
            this.state.loading.comments = false;
            this.state.item.comments.push(event.comment);
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

    currentList = (type='user') => {
        const tab = this.currentTab(type);
        if (tab) return tab[this.state.tabIndex];
    }

    currentTab = (type='user') => this.getTab(this.state.tab, type);

    getTab = (_tab_, type='user') => {
        const res = this.state[type].tabs.find((({ tab }) => _tab_ === tab));
        if (res) return res.sub_tabs;
    }

    findIndexFromType = (tabType, type='user') => {
        return this.currentTab().findIndex(({ type }) => type === tabType) || 0;
    }
}

export let store = new Store();
