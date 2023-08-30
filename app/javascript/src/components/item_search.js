import React, { useContext } from 'react';
import { Search } from '../components';
import Context from '../context';

const ItemSearch = ({ id, type, item, children }) => {
    const { api } = useContext(Context);

    return(
        <Search 
            id={id}
            type={type}
            placeholder={`Search for a ${item} to add...`}
            search={api.search}
        >
            {(result, clearResults, input) => children(result, clearResults, input)}
        </Search>
    );
};

export default ItemSearch;