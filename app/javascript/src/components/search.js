import React, { useContext, useState, useEffect, useRef } from 'react';
import Context from '../context';
import { observer } from '../utils';

const ItemSearch = ({ id, search, type, children, placeholder, onChange, bottom, fetchMore=true }) => {
    const input = useRef();
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
                setTimeout(() => {
                    onChange && onChange(term);
                    search({ id, type, term });
                }, 500)
            );
        };
    }, [term]);

    useEffect(() => {
            const streamObserver = observer(() => {
                if (term != '') {
                    search({ id, type, term, length: results.length });
                    streamObserver.unobserve(sb);
                }
            });

            const sb = document.getElementById("search-bottom");

            if (sb && fetchMore) streamObserver.observe(sb);

            return () => streamObserver.unobserve(sb);

        }, [ results.length ]);

    return(
        <div className="search" >
            <div className="input-primary">
                <input
                    ref={input}
                    value={term} 
                    placeholder={placeholder}
                    onChange={({ target }) => {
                        setFirstLoad(false);
                        setTerm(target.value);
                    }}
                />

            </div>
            <div className="search-results" >
                {Object.keys(results).map((key, i) =>
                    <div key={key} >
                        {children(results[key], clearResults, input)}
                    </div>
                )}
                {bottom && bottom(clearResults)}
                <div id="search-bottom"></div>
            </div>
        </div>
    );
};

export default ItemSearch;