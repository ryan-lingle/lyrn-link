import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTabs, List, UserProfile } from '../components';
import Context from '../context';

const AdminList = ({ match }) => {
    const { api, state } = useContext(Context);

    useEffect(() => {
        console.log('hi');
        (async function() {
            await api.getUser({ handle: match.params.handle });
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
        <div className="container">
            <div id="dashboard">
                <UserProfile readOnly={true} />
                <ListTabs 
                readOnly={true} 
                pathname={`/u/${match.params.handle}/`} 
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