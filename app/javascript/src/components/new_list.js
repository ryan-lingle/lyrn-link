import React, { useContext, useState, useEffect, useRef } from 'react';
import Context from '../context';
const maxListsLength = 5;

const NewList = ({ children, id, type="user" }) => {
    const { state, api } = useContext(Context);
    const [show, setShow] = useState(false);
    const lists = state[type].uncreated_lists;
    const maxLists = lists && lists.length === maxListsLength;
    const menu = useRef();

    useEffect(() => {
        document.onclick = show ? ({ target }) => {
            if (target !== menu.current) setShow(false);
        } : null;
    }, [show]);

    if (lists && lists.length === 0) return <div></div>;



    return(
        <div className="new-list"
            id={id}
            onClick={() => setShow(prev => !prev)} 
        >
            <div className="new-list text-right">
                {children || <i className={`fa-solid fa-${show ? 'xmark' : 'plus'}-circle`} />}
            </div>
            {
                show

                ?   <div 
                        className="new-list-menu" 
                        ref={menu}
                    >
                        {lists.map((list, i) =>
                            <div key={i} onClick={async () => {
                                await api.createList({
                                    type: list,
                                    group_id: type === 'group' ? state.group.id : null,
                                });
                                api.store.reduce({
                                    type: 'set_tab_index',
                                    tabType: list,
                                });
                            }} >
                                {list.toUpperCase()}
                            </div>
                        )}
                    </div>

                :   null
            }
            
        </div>
    );
};

export default NewList;