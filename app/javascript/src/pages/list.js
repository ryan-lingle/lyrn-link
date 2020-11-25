import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTabs, List } from '../components';
import Context from '../context';

const AdminList = ({ match }) => {
    const { api, state, store } = useContext(Context);

    useEffect(() => {
        console.log('hi');
        (async function() {
            await api.getUser({ username: match.params.username });
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
        <div className="container">
            <div id="dashboard">
                <br/>
                <ListTabs 
                    readOnly={true} 
                    pathname={`/u/${match.params.username}/`} 
                />
                <List 
                    {...currentList} 
                    readOnly={true}
                />
            </div>
        </div>
    );
}

export default AdminList;