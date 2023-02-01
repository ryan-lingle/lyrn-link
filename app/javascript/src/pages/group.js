import React, { useEffect, useContext, useState } from 'react';
import { ErrorBox, Loader, ListTabs, GenericTabs, ProfileTabs, MobileTabs, List, GroupProfile, UnconfirmedEmail } from '../components';
import Context from '../context';
import { Helmet } from 'react-helmet';

const Group = ({ match }) => {
    const { api, state } = useContext(Context);
    const [pageHeight, setPageHeight] = useState(window.innerHeight - 60);

    useEffect(() => {
        window.onresize = () => {
            setPageHeight(window.innerHeight - 60);
        };
    }, []);

    useEffect(() => {
        (async function() {
            await api.getGroup(match.params.handle);
            await api.getUser();

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

    const loading = state.loading.groups;
    const error = state.errors.groups;
 
    if (loading) return <Loader />;
    if (error) return <div className="container"><ErrorBox error={error} /></div>;

    const currentList = api.store.currentList('group');
    const pathname = `/g/${state.group.handle}/`;

    return(
        <div>
            <Helmet>
                <title>
                    {state.group.name}
                </title>
            </Helmet>
            <div className="page" style={{ height: `${pageHeight}px` }} >
                <div id="side-nav" className="non-mobile-only">
                    <GroupProfile />
                   {/* <ProfileTabs
                        tabs={state.group.tabs}
                        pathname={`/g/${state.group.handle}/`}
                    />*/}
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
                                    pathname={pathname + 'lists/'} 
                                /> 

                            :   <GenericTabs 
                                    pathname={pathname + state.tab + '/'}
                                    tabs={api.store.currentTab('group')} 
                                />
                    }
                    <List 
                        {...currentList}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default Group;
