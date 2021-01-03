import React, { useState, useEffect, useContext } from 'react';
import { Search, Scraper, Draggable, ItemCard } from '../components';
import Context from '../context';
import { capitalize } from '../utils';

const List = ({ type, singular, searchable, icon, items=[], createItem, destroyItem, isList }) => {
    const [add, setAdd] = useState(false);
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;

    useEffect(() => {
        setAdd(false);
    }, [type]);

    function addBtn() {
        if (readOnly) {
            return null;
        } else {
            return(
                <div className="btn-black" style={{ color: add ? '#999999' : '' }} onClick={() => setAdd(prev => !prev)} >
                    <i className="far fa-plus-circle" style={{marginRight: '5px'}} />
                    {capitalize(singular)}
                </div>
            );
        }
    }

    if (!type) return(
        <div className="big-heading no-list" style={{marginTop: '40px'}} >
            NO LIST STATE
        </div>
    );

    if (items.length === 0) return(
        <div className="big-heading no-list" style={{marginTop: '40px'}} >
            NO ITEM STATE
        </div>
    );

    function onMove(dragIndex, hoverIndex) {
        api.store.reduce({
            type: 'swap_items',
            dragIndex, hoverIndex,
        });
    };


    return(
        <div id="list" >
            {
                isList

                ?   <div className="flex-between">
                        <div className="main-heading">
                            <i className={icon} style={{fontSize: 'normal', marginRight: '10px'}} />
                            <strong>My Top {items.length} {capitalize(type)}</strong>
                        </div>
                        {addBtn()}
                    </div>

                :   null
            }
            {   
                add

                ?
                    searchable

                    ?   <Search type={type} item={singular} >
                            {(result, clearResults) =>
                                <div onClick={() => {
                                    createItem(type, result);
                                    setAdd(false);
                                    clearResults();
                                }} >
                                    <ItemCard
                                        readOnly={true}
                                        rank={false}
                                        {...result}
                                    />
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
                    disable={readOnly || !isList} 
                    onDrop={() => api.updateItemIndex()} 
                    onMove={onMove}
                >
                    <ItemCard
                        readOnly={readOnly}
                        rank={isList}
                        onDestroy={() => destroyItem(type, item.id)}
                        {...item} 
                    />
                </Draggable>
            )}
        </div>
    );
}

export default List;