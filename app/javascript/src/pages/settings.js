import React, { useEffect } from 'react';

const Settings = () => {
    useEffect(() => {
        (async function() {
            await api.getUser();
        })();
    }, []);

    return (
        <div className="page" style={{marginTop: '100px'}}>
            <h1>Settings</h1>
        </div>
    );
};

export default Settings;
