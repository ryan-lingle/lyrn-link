import React, { useContext, useState } from 'react';
import Context from '../context';
const maxListsLength = 5;

const NewList = () => {
    const { state, api } = useContext(Context);
    const [show, setShow] = useState(false);
    const lists = state.user.uncreated_lists;
    const maxLists = lists && lists.length === maxListsLength;
    if (lists && lists.length === 0) return <div></div>;

    return(
        <div 
            className="btn-list new-list" 
            onClick={() => setShow(prev => !prev)} 
        >
            <i className="fas fa-plus-circle icon-black" style={{fontSize: 'large'}} />
            {
                show

                ?   <div 
                        className="new-list-menu" 
                    >
                        {lists.map((list, i) =>
                            <div key={i} onClick={async () => {
                                await api.createList({ type: list });
                                api.store.reduce({
                                    type: 'set_list_index',
                                    listType: list,
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