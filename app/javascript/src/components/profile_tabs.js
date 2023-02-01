import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { ListTabs } from '../components';
import Draggable from './draggable';
import { parseQuery, capitalize } from '../utils';

const ProfileTabs = ({ pathname="/admin/", tabs }) => {
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
        <div className="profile-tabs" >
            {tabs.map(({ tab, icon }, i) =>
                <div 
                    key={i} 
                    className={`profile-tab flex section-tab ${tab === state.tab ? 'current-section-tab' : ''}`}
                    onClick={() => setTab(tab)}
                >
                    <i className={icon} style={{marginRight: '10px', width: '25px'}} />
                    <div className="tabs-heading">
                        {capitalize(tab)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTabs;