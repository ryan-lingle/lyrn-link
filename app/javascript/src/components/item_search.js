import React, { useContext } from 'react';
import { Search } from '../components';
import Context from '../context';

const ItemSearch = ({ type, item, children }) => {
    const { api } = useContext(Context);

    return(
        <Search 
            type={type} 
            placeholder={`Search for a ${item} to add...`}
            search={api.search}
        >
            {(result, clearResults) => children(result, clearResults)}
        </Search>
    );
};

export default ItemSearch;