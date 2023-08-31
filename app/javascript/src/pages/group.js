import React from 'react';
import { ListTabs, GenericTabs, ProfileTabs, MobileTabs, List, GroupProfile, UnconfirmedEmail, ItemShow } from '../components';
import { withStuff } from "../hocs";
import { Helmet } from 'react-helmet';

const Group = ({ api, state, pageHeight }) => {

    const currentList = api.store.currentList('group');

    const pathname = `/g/${state.group.handle}/`;

    return(
        <div>
            <Helmet>
                <title>
                    {state.group.name} / Lyrnlink
                </title>
            </Helmet>
            <div className="page" style={{ height: `${pageHeight}px` }} >
                <div id="side-nav" className="non-mobile-only">
                    <GroupProfile />
                    <ProfileTabs
                        tabs={state.group.tabs}
                        pathname={`/g/${state.group.handle}/`}
                    />
                    <div className="nav-footer">
                        <div>
                            <a style={{fontWeight: 'bolder'}}>© 2021 - Lyrnlink</a>
                        </div>
                        <div>
                            <a style={{color: '#333333'}} href="https://www.lyrn.link/privacy">Privacy Policy</a>
                            &nbsp;&nbsp;&nbsp;
                            <a style={{color: '#333333'}} href="https://www.lyrn.link/terms">Terms of Use</a>
                        </div>
                    </div>
                </div>
                <div className="mobile-only">
                    <GroupProfile />
                </div>
                <div className="container">
                    {
                        state.tab === 'lists' 

                            ?   <ListTabs 
                                    type="group"
                                    pathname={pathname + 'lists/'} 
                                /> 

                            :   <GenericTabs 
                                    pathname={pathname + state.tab + '/'}
                                    tabs={api.store.currentTab('group')} 
                                />
                    }
                    {
                        state.item

                        ?   <ItemShow {...state.item} />

                        :   <List
                                {...currentList}
                                isList={state.tab === 'lists'}
                            />
                    } 
                </div>
            </div>
        </div>
    );
}

export default withStuff(Group, {
    api: true,
    state: true,
    loader: 'groups',
    effect: async ({ api, match }) => {
        await api.getGroup(match.params.handle);
        api.getUser();

        if (match.params.tab) {
            api.store.reduce({
                type: 'set_tab',
                tab: match.params.tab,
            });
        }

        if (match.params.item) {
            api.getItem(match.params.item);
        }
        
        if (match.params.tabType) {
            
            api.store.reduce({
                type: 'set_tab_index',
                tabType: match.params.tabType,
            });
        }
    }
});
