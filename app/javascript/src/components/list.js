import React, { useState, useEffect } from 'react';
import { ErrorBox, Loader, ListTab, NewList, Search, Scraper, ItemCard } from '../components';
import Context from '../context';

const List = ({ type, singular, searchable, items=[], createItem }) => {
    const [add, setAdd] = useState(false);

    useEffect(() => {
        setAdd(false);
    }, [type]);

    if (!type) return(
        <div className="list">
            <h1>No List ¯\_(ツ)_/¯</h1>
        </div>
    );

    return(
        <div className="list" >
            <h1>{type && type.toUpperCase()}</h1>
            <br/>
            {
                add

                ?   <div className="b-copy new-list" style={{ color: 'gray' }} onClick={() => setAdd(false)} >
                        <i className="fas fa-plus-circle"></i>
                        &nbsp;
                        New Item
                    </div>

                :   <div className="b-copy new-list" onClick={() => setAdd(true)} >
                        <i className="fas fa-plus-circle"></i>
                        &nbsp;
                        New Item
                    </div>
            }
            {   
                add

                ?
                    searchable

                    ?   <Search type={type} item={singular} >
                            {(result, clearResults) =>
                                <div className="search-result" onClick={() => {
                                    createItem(type, result);
                                    setAdd(false);
                                    clearResults();
                                }} >
                                    <img src={result.image} width="70px" />
                                    <div>{result.title}</div>
                                </div>
                            }
                        </Search>

                    :   <Scraper onSubmit={(result) => {
                                createItem(type, result);
                                setAdd(false);
                            }} 
                        />

                :   null
            }
            {items.map((item, i) => <ItemCard key={i} {...item} />)}
        </div>
    );
}

export default List;