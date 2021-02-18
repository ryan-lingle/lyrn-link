import React, { useContext, useEffect } from 'react';
import Context from '../context';
import ListTab from './list_tab';
import NewList from './new_list';
import Draggable from './draggable';
import NoLists from '../assets/nolist.png';
import NoListsUser from '../assets/nolistuser.png'

const ListTabs = ({ pathname="/admin/lists/" }) => {
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;
    const lists = state.user.lists;

    // useEffect(() => {

    //     const changeTab = () => {

    //         const wire = window.location.pathname.split('/');
    //         const path = wire[wire.length - 1];
    //         if (path) api.store.reduce({
    //             type: 'set_tab_index',
    //             tabType: path,
    //         });
    //         window.removeEventListener('popstate', changeTab);

    //     }

    //     window.addEventListener('popstate', changeTab);

    //     () => window.removeEventListener('popstate', changeTab);

    // }, [state.listIndex]);

    function listCallback(list) {
        return async function() {
            api.store.reduce({
                type: 'set_tab_index',
                tabIndex: list.index,
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

    if (lists.length === 0) return(
        <div>
            {
                readOnly

                ?   <div className="todo-card" >
                        <img 
                            className="todo-img"
                            src={NoLists} 
                            alt="Lyrn Link No Lists" 
                        />
                        <div className="todo-text">
                            <div className="todo-heading">You'll have to wait a moment...</div>
                            <div className="todo-body">{state.user.name} is just getting started with lyrnlink and hasn't created a list yet.</div>
                        </div>
                    </div>

                :   <div className="todo-card" >
                        <img 
                            className="todo-img"
                            src={NoListsUser} 
                            alt="Lyrn Link No Lists" 
                        />
                        <div className="todo-text">
                            <div className="todo-heading">👋 Welcome to the family!</div>
                            <div className="todo-body">Now you can begin creating lists.  <b>We recommend starting with Books</b>, they're easy to search for and you'll get the feel of list making pretty quickly.</div>
                        </div>
                        <NewList id={'empty-state-new-list'} >
                            <div className="todo-btns" style={{marginTop: '20px'}}>
                                <div className="btn-black">
                                <i className="far fa-plus-circle" style={{marginRight: '7px'}}/>
                                List
                                </div>
                            </div>
                        </NewList>
                    </div>
            }
        </div>
    );

    return(
        <div className="flex-between" style={{alignItems: 'center'}}>
            <div 
                className="tabs"
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
                            current={list.index == state.tabIndex}
                        />
                    </Draggable>
                    
                )}
            </div>
            <div>
                {readOnly ? null : <NewList />}
            </div>
        </div>
    );
};

export default ListTabs;