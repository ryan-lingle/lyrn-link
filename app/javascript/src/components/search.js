import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';
import { observer } from '../utils';

const Search = ({ type, item, children }) => {
    const { api, state } = useContext(Context);
    const [firstLoad, setFirstLoad] = useState(true);
    const [term, setTerm] = useState('');
    const [timeout, saveTimeout] = useState(null);

    const results = state.searchResults[type] || {};

    function clearResults() {
        setTerm('');
        api.store.reduce({
            type: 'search_results',
            searchType: type,
            results: {},
        });
    }
    
    useEffect(() => {
        if (!firstLoad && term != '') {
            if (timeout) clearTimeout(timeout);

            saveTimeout(
                setTimeout(() => api.search(type, term), 500)
            );
        };
    }, [term]);

    useEffect(() => {
            const streamObserver = observer(() => {
                if (term != '') {
                    api.search(type, term, results.length);
                    streamObserver.unobserve(sb);
                }

            });

            const sb = document.getElementById("search-bottom");

            if (sb) streamObserver.observe(sb);

            return () => streamObserver.unobserve(sb);

        }, [ results.length ]);

    return(
        <div className="search" >
            <div className="input-primary">
                <input 
                    value={term} 
                    placeholder={`search for a ${item}`}
                    onChange={({ target }) => {
                        setFirstLoad(false);
                        setTerm(target.value);
                    }}
                />

            </div>
            <div className="search-results" >
                {Object.keys(results).map((key, i) =>
                    <div key={key} >
                        {children(results[key], clearResults)}
                    </div>
                )}
                <div id="search-bottom"></div>
            </div>
        </div>
    );
};

export default Search;