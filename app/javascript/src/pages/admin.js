import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTabs, List, UserProfile } from '../components';
import Context from '../context';

const AdminList = ({ match }) => {
    const { api, state } = useContext(Context);

    useEffect(() => {
        (async function() {
            await api.getUser();
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

    return(
        <div id="dashboard">
            <UserProfile />
            <ListTabs />
            <List 
                {...currentList} 
                createItem={api.createItem} 
                destroyItem={api.destroyItem}
            />
        </div>
    );
}

export default AdminList;