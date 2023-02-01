import React, { useContext, useState, useEffect, useRef } from 'react';
import Context from '../context';
import { observer } from '../utils';

// function sort(a) {
//     console.log(a); 
//     if (a.length <= 1)
//         return a;

//     const p = a[0];

//     const left = [];
//     const right = [];

//     for (let i=1; i < a.length; i++) {
//         a[i] < p ? left.push(a[i]) : right.push(a[i]);
//     };

//     console.log(left);
//     console.log(right);

//     return(sort(left).concat(p, sort(right)));
// };

// let array = [12, 11, 15, 10, 9, 1, 2, 3, 13, 14, 4, 5, 6, 7, 8]
// let array2 = [1, 2, 45, 2, 6,2,46,7,2,4,246,2];
// let array3 = [3,56,33,63,42,6,4,2,6,2,47,7]
// console.log(mergeArrays([array, array2, array3]))

// function mergeArrays(arrays) {
//     const first = arrays.shift() || [];

//     return arrays.reduce((mem, arr) => {
//         return mergeSort(mem, arr);
//     }, first);
// };

// function mergeSort(array, array2) {
//     if (array.length <= 1) return array;

//     let a, b;

//     if (array2) {
//         a = mergeSort(array);
//         b = mergeSort(array2)
//     } else {
//         let mid = Math.floor(array.length / 2);
//         a = mergeSort(array.slice(0, mid));
//         b = mergeSort(array.slice(mid));
//     }

//     return merge(a, b);
// };

// function merge(a, b) {
//     const merged = [];
 
//     while (a.length && b.length) {
//         merged.push(a[0] < b[0] ? a.shift() : b.shift());
//     };

//     return [...merged, ...a, ...b];
// };

const ItemSearch = ({ search, type, children, placeholder, onChange, bottom, fetchMore=true }) => {
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
                    search(type, term);
                }, 500)
            );
        };
    }, [term]);

    useEffect(() => {
            const streamObserver = observer(() => {
                if (term != '') {
                    search(type, term, results.length);
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
                {bottom(clearResults)}
                <div id="search-bottom"></div>
            </div>
        </div>
    );
};

export default ItemSearch;