import React, { useEffect, useContext, useState } from 'react';
import { ErrorBox, Loader, ListTabs, GenericTabs, ProfileTabs, MobileTabs, List, UserProfile, UnconfirmedEmail } from '../components';
import Context from '../context';
import { Helmet } from 'react-helmet';

const Group = ({ match }) => {
    const { api, state } = useContext(Context);
    const [pageHeight, setPageHeight] = useState(window.innerHeight - 60);

    const fetchListeners = {
        discover: (length, index=0) => index 
                                ?   api.getDiscoverItems(length)
                                :   api.getDiscoverUsers(length)
    };

    useEffect(() => {
        window.onresize = () => {
            setPageHeight(window.innerHeight - 60);
        };
    }, []);

    useEffect(() => {
        (async function() {
            await api.getUser();
            await api.getGroup(match.params.handle);

            if (match.params.tab) {
                api.store.reduce({
                    type: 'set_tab',
                    tab: match.params.tab,
                });
            }

            if (match.params.listType) {
                api.store.reduce({
                    type: 'set_tab_index',
                    tabType: match.params.tabType,
                });
            }

        })();
    }, []);

    const loading = state.loading.user;
    const error = state.errors.user;
 
    if (loading) return <Loader />;
    if (error) return <div className="container"><ErrorBox error={error} /></div>;
    if (state.admin && state.user.confirm_email) return <UnconfirmedEmail email={state.user.email} />;

    const currentList = api.store.currentList();
    const pathname = state.readOnly ? `/${state.user.handle}/` : '/admin/';

    return(
        <div>
            <Helmet>
                <title>
                    {
                        state.readOnly

                        ?   `${state.user.name} (${state.user.handle})`

                        :   'lyrnlink'
                    }
                </title>
            </Helmet>
            <div className="page" style={{ height: `${pageHeight}px` }} >
                <div id="side-nav" className="non-mobile-only">
                    <UserProfile />
                    <ProfileTabs 
                        pathname={state.readOnly ? `/${state.user.handle}/` : '/admin/'}
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
                    <UserProfile />
                    <div className="mobile-only">
                        <MobileTabs 
                            pathname={state.readOnly ? `/${state.user.handle}/` : '/admin/'}
                        />
                    </div>
                </div>
                <div className="container">
                    {
                        state.tab === 'lists' 

                            ?   <ListTabs 
                                    pathname={pathname + 'lists/'} 
                                /> 

                            :   <GenericTabs 
                                    pathname={pathname + state.tab + '/'}
                                    lists={api.store.currentTab()} 
                                />
                    }
                    <List 
                        {...currentList}
                        createItem={api.createItem} 
                        destroyItem={api.destroyItem}
                        isList={state.tab === 'lists'}
                        onFetch={fetchListeners[state.tab]}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default Group;
