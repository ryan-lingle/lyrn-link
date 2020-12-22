import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { ListTabs } from '../components';
import Draggable from './draggable';
import { parseQuery, capitalize } from '../utils';

const ProfileTabs = ({ pathname="/admin/" }) => {
    const { state, api } = useContext(Context);

    // useEffect(() => {

    //     const changeTab = () => {

    //         const wire = window.location.pathname.split('/');
    //         const path = wire[wire.length - 1];
    //         if (path) setTab(path);

    //         window.removeEventListener('popstate', changeTab);

    //     }

    //     window.addEventListener('popstate', changeTab);

    //     () => window.removeEventListener('popstate', changeTab);

    // }, [state.tab]);


    function setTab(tab) {
        history.pushState({}, tab, pathname + tab);
        api.store.reduce({
            type: 'set_tab', tab
        });
    };  

    return(
        <div>
            <div className="flex tabs" style={{marginBottom: '40px'}} >
                {['lists', 'following', 'bookmarks'].map((tab, i) =>
                    <div 
                        key={i} 
                        className={`list-tab ${tab === state.tab ? 'current-list-tab' : ''}`}
                        onClick={() => setTab(tab)}
                    >
                        <div className="tabs-heading">
                            {capitalize(tab)}
                        </div>
                    </div>
                )}
            </div>
            {
                state.tab === 'lists'

                ?   <ListTabs pathname={pathname + 'lists/'} />

                :   null
            }
        </div>
    );
};

export default ProfileTabs;