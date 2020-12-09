import React, { useContext, useState } from 'react';
import Context from '../context';

const NewList = () => {
    const { state, api, store } = useContext(Context);
    const [show, setShow] = useState(false);
    const lists = state.user.uncreated_lists;

    if (lists && lists.length === 0) return <div></div>;

    return(
        <div className="btn-list" onClick={() => setShow(prev => !prev)} >
            <i className="far fa-plus-circle" style={{marginRight: '5px'}} />
            List
            {
                show

                ?   <div className="new-list-menu">
                        {lists.map((list, i) =>
                            <div key={i} onClick={async () => {
                                await api.createList({ type: list });
                                store.reduce({
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