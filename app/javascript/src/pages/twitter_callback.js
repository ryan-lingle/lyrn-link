import React, { useContext, useEffect } from 'react';
import { parseQuery } from '../utils';
import { Loader } from '../components'; 
import Context from '../context';

const TwitterCallback = ({ location }) => {
    const { api } = useContext(Context);

    useEffect(() => {
        const query = parseQuery(location.search);
        api.accessToken(query);
    }, []);

    return(
        <div className="text-center">
            <Loader />
        </div>
    );
};

export default TwitterCallback;