import React, { useContext } from 'react';
import Context from '../context';
import ListTab from './list_tab';
import NewList from './new_list';
import Draggable from './draggable';

const ListTabs = ({ pathname="/admin/", readOnly }) => {
    const { state, api } = useContext(Context);
    const lists = state.user.lists;

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
        <div className="flex-between" >
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
                            onDestroy={() => api.destroyList(list.type)}
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