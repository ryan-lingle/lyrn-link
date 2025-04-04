import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { ListTabs } from '../components';
import Draggable from './draggable';
import { parseQuery, capitalize } from '../utils';

const MobileTabs = ({ pathname="/admin/" }) => {
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
            <div className="mobile-tabs" >
                {state.user.tabs.map(({ tab, icon }, i) =>
                    <div 
                        key={i} 
                        className={`mobile-tab tabs-icon section-tab ${tab === state.tab ? 'current-section-tab' : ''}`}
                        onClick={() => setTab(tab)}
                    >
                        <i className={icon} />
                    </div>                
                )}
            </div>
        </div>
    );
};

export default MobileTabs;