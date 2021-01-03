import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTabs, GenericTabs, List, UserProfile } from '../components';
import Context from '../context';
import { Helmet } from 'react-helmet';

const Page = ({ match }) => {
    const { api, state } = useContext(Context);

    useEffect(() => {
        (async function() {
            await api.getUser(match.params);

            if (match.params.tab) {
                api.store.reduce({
                    type: 'set_tab',
                    tab: match.params.tab,
                });
            }

            if (match.params.listType) {
                api.store.reduce({
                    type: 'set_list_index',
                    listType: match.params.listType,
                });
            }

        })();
    }, []);

    const loading = state.loading.user;
    const error = state.errors.user;
 
    if (loading) return <Loader />;
    if (error) return <ErrorBox error={error} />;

    const currentList = api.store.currentList();
    const pathname = state.readOnly ? `/${state.user.handle}/` : '/admin/';

    return(
        <div>
            <Helmet>
                <title>
                    {
                        state.readOnly

                        ?   `${state.user.name} (${state.user.handle})`

                        :   'LyrnLink Admin'
                    }
                </title>
            </Helmet>
            <div style={{ display: 'flex', height: `${window.innerHeight - 50}px` }} >
                <div id="side-nav">
                    <UserProfile />
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
                    />
                </div>
            </div>
        </div>
    );
}

export default Page;
