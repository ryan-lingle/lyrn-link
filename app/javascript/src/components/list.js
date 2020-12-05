import React, { useState, useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTab, Search, Scraper, Draggable, ItemCard } from '../components';
import Context from '../context';

const List = ({ type, singular, searchable, icon, items=[], createItem, destroyItem, readOnly }) => {
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
                <div className="big-heading new-item" style={{ color: add ? '#999999' : '' }} onClick={() => setAdd(prev => !prev)} >
                    <i className="fas fa-plus-circle" style={{marginRight: '5px'}} />
                    New Item
                </div>
            );
        }
    }

    if (!type) return(
        <div className="big-heading no-list" style={{marginTop: '40px'}} >No Lists Yet ¯\_(ツ)_/¯</div>
    );

    function onMove(dragIndex, hoverIndex) {
        api.store.reduce({
            type: 'swap_items',
            dragIndex, hoverIndex,
        });
    };


    return(
        <div className="list" >
            <div className="flex">
                <i className={icon} style={{fontSize: '14px', marginRight: '10px'}} />
                <div className="little-heading list-desc">
                    The top {items.length} {type.toLowerCase()} I am learning from.
                </div>
            </div>
            {addBtn()}
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
            <div style={{marginTop: '20px'}}></div>
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