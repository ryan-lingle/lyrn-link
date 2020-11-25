import React, { useContext } from 'react';
import Context from '../context';
import ListTab from './list_tab';
import NewList from './new_list';

const ListTabs = () => {
    const { state, store, api } = useContext(Context);

    function listCallback(list) {
        return async function() {
            store.reduce({
                type: 'set_list_index',
                index: list.index,
            });
            history.pushState({}, list.type, '/admin/' + list.type);
        }
    }

    return(
        <div className="card-wrapper new-list">
            {state.user.lists.map((list, i) =>
                <ListTab 
                    {...list} 
                    key={i} 
                    onClick={listCallback(list)}
                    onDestroy={() => api.destroyList(list.type)}
                    current={list.index == state.listIndex}
                />
            )}
            <NewList />
        </div>
    );
};

export default ListTabs;