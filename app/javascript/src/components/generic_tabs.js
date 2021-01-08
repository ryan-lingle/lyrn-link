import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { ListTab } from '.';

const ListTabs = ({ lists, pathname="/admin/lists/" }) => {
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;
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

    function callback(tab, i) {
        return async function() {
            api.store.reduce({
                type: 'set_tab_index',
                tabIndex: i,
            });
            history.pushState({}, tab, pathname + tab);
        }
    }

    return(
        <div className="flex-between">
            <div 
                className="tabs"
            >
                {lists.map((list, i) =>
                        <ListTab
                            key={i}
                            {...list}
                            readOnly={readOnly}
                            onClick={callback(list.type, i)}
                            current={state.tabIndex === i}
                        />
                )}
            </div>
        </div>
    );
};

export default ListTabs;