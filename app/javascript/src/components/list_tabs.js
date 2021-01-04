import React, { useContext, useEffect } from 'react';
import Context from '../context';
import ListTab from './list_tab';
import NewList from './new_list';
import Draggable from './draggable';

const ListTabs = ({ pathname="/admin/lists/" }) => {
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;
    const lists = state.user.lists;

    // useEffect(() => {

    //     const changeTab = () => {

    //         const wire = window.location.pathname.split('/');
    //         const path = wire[wire.length - 1];
    //         if (path) api.store.reduce({
    //             type: 'set_list_index',
    //             listType: path,
    //         });
    //         window.removeEventListener('popstate', changeTab);

    //     }

    //     window.addEventListener('popstate', changeTab);

    //     () => window.removeEventListener('popstate', changeTab);

    // }, [state.listIndex]);

    function listCallback(list) {
        return async function() {
            api.store.reduce({
                type: 'set_list_index',
                index: list.index,
            });
            history.pushState({}, list.type, pathname + list.type);
        }
    }

    function onMove(dragIndex, hoverIndex) {
        api.store.reduce({
            type: 'swap_lists',
            dragIndex, hoverIndex,
        });
    }
    return(
        <div className="flex-between tabs">
            <div 
                className="flex"
                style={{
                    display: lists.length === 0 ? 'none' : '',
                }}
            >
                {lists.map((list, i) =>
                    <Draggable 
                        key={i} 
                        type="list"
                        id={list.id}
                        index={list.index}
                        disable={readOnly} 
                        onDrop={() => api.updateListIndex()} 
                        onMove={onMove}
                    >

                        <ListTab 
                            {...list} 
                            readOnly={readOnly}
                            onClick={listCallback(list)}
                            current={list.index == state.listIndex}
                        />
                    </Draggable>
                )}
            </div>
            {readOnly ? null : <NewList />}
        </div>
    );
};

export default ListTabs;