import React, { useState, useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTab, NewList, Search, Scraper, Draggable, ItemCard } from '../components';
import Context from '../context';

const List = ({ type, singular, searchable, items=[], createItem, destroyItem, readOnly }) => {
    const [add, setAdd] = useState(false);
    const { api } = useContext(Context);

    useEffect(() => {
        setAdd(false);
    }, [type]);

    function addBtn() {
        if (readOnly) {
            return null;
        } else {
            return(
                <div className="b-copy new-list" style={{ color: add ? 'gray' : '' }} onClick={() => setAdd(prev => !prev)} >
                    <i className="fas fa-plus-circle"></i>
                    &nbsp;
                    New Item
                </div>
            );
        }
    }

    if (!type) return(
        <div className="list">
            <h1>No List ¯\_(ツ)_/¯</h1>
        </div>
    );

    function onMove(dragIndex, hoverIndex) {
        api.store.reduce({
            type: 'swap_items',
            dragIndex, hoverIndex,
        });
    };


    return(
        <div className="list" >
            <h1>{type && type.toUpperCase()}</h1>
            <br/>
            {addBtn()}
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
            {items.map((item, i) => 
                <Draggable 
                    key={i} 
                    type="item"
                    id={item.id}
                    index={item.index}
                    disable={readOnly} 
                    onDrop={() => api.updateItemIndex()} 
                    onMove={onMove}
                >
                    <ItemCard
                        readOnly={readOnly}
                        onDestroy={() => destroyItem(type, item.id)}
                        {...item} 
                    />
                </Draggable>
            )}
        </div>
    );
}

export default List;