import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTabs, List } from '../components';
import Context from '../context';

const AdminList = ({ match }) => {
    const { api, state, store } = useContext(Context);

    useEffect(() => {
        (async function() {
            await api.getUser();
            if (match.params.listType) {
                store.reduce({
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

    const currentList = store.currentList();

    return(
        <div id="dashboard">
            <br/>
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