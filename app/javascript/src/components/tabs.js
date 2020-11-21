import React, { useState, useEffect } from 'react';
import { capitalize, parseQuery } from '../utils';

const Tabs = ({ tabs, defaultTab, ...props }) => {
    const keys = Object.keys(tabs);
    if (!keys.includes(defaultTab)) defaultTab = keys[0];

    const [current, setCurrent] = useState(defaultTab);

    const Current = tabs[current];
    
    useEffect(() => {

        const changeTab = () => {

            const query = parseQuery(location.search);
            if (query.tab) setCurrent(query.tab);
            window.removeEventListener('popstate', changeTab);

        }

        window.addEventListener('popstate', changeTab);

        () => window.removeEventListener('popstate', changeTab);

    }, [current]);

    return(
        <div>
            <div id="tabs">
                {keys.map(((key, i) =>
                    <div 
                        key={i} 
                        className={`tab ${key === current ? 'current-tab' : null}`} 
                        onClick={() => {
                            history.pushState({}, key, props.prospectId + '?tab=' + key);
                            setCurrent(key);
                        }}
                    >
                        {capitalize(key)}
                    </div>
                ))}
            </div>
             <Current {...props} />
        </div>
    );
}

export default Tabs;