import React from 'react';
import { PageWrapper } from '.';
import { List, ItemShow } from '../components';
import { withStuff } from "../hocs";

const ListPage = (props) => {

    const currentList = props.api.store.currentList();

    const fetchListeners = {
        discover: (length, index=0) => index 
                                ?   api.getDiscoverItems(length)
                                :   api.getDiscoverUsers(length)
    };

    return(
        <PageWrapper {...props} >
            {
                props.state.item

                ?   <ItemShow {...props.state.item} />

                :     <List 
                        {...currentList}
                        isList={props.state.tab === 'lists'}
                        onFetch={fetchListeners[props.state.tab]}
                    />
            }
        </PageWrapper>
    );
}

export default withStuff(ListPage, {
    api: true,
    state: true,
    loader: 'user',
    effect: async ({ api, match }) => {
        await api.getUser(match.params);

        if (match.params.item) {
            api.getItem(match.params.item);
        }

        if (match.params.tab) {
            api.store.reduce({
                type: 'set_tab',
                tab: match.params.tab,
            });
        }
        
        if (match.params.tabType) {
            
            api.store.reduce({
                type: 'set_tab_index',
                tabType: match.params.tabType,
            });
        }
    }
});
