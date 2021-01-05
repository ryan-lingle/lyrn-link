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

    function destroyList() {
        if (window.confirm('Are you sure you want to delete this list?')) {
            api.destroyList(type);
        };
    };

    function editBtns() {
        if (readOnly) {
            return null;
        } else {
            return(
                <div className="flex-between">
                    <div className="icon" style={{ color: add ? '#999999' : '' }} onClick={() => setAdd(prev => !prev)} >
                      <i className="far fa-plus-circle icon-black"/>
                    </div>
                    <i className="far fa-trash icon-delete" onClick={destroyList} style={{marginLeft: '10px'}} />
                </div>
            );
        }
    }

    function addItem() {
        if (add) {

            if (searchable) {

                return <Search type={type} item={singular} >
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
                </Search>;

            } else {

                return <Scraper onSubmit={(result) => {
                        createItem(type, result);
                        setAdd(false);
                    }} 
                />;

            }
        }
    }

    // NO LIST STATE
    if (!type) return(
        <div className="todo-card" style={{marginTop: '40px'}} >
            <div className="main-heading">
                You haven't created any lists, yet. Click the add button to get started! 
            </div>
        </div>
    );

    // NO ITEM STATE
    if (items.length === 0) return(
        <div>
            {addItem()}
            <div className="todo-card" style={{marginTop: '40px'}} >
                <div className="main-heading">
                    You haven't added any items to your list. Click the add button to get started! 
                </div>
                {editBtns()}
            </div>
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

                ?   <div className="flex-between" style={{marginBottom: '20px'}}>
                        <div className="main-heading">
                            <i className={icon} style={{fontSize: 'normal', marginRight: '10px'}} />
                            <strong>My Top {items.length} {capitalize(type)}</strong>
                        </div>
                        {editBtns()}
                    </div>

                :   null
            }
            {addItem()}
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
                        followButton={['following', 'followers'].includes(type)}
                        bookmarkButton={type === 'bookmarks'}
                        {...item} 
                    />
                </Draggable>
            )}
        </div>
    );
}

export default List;