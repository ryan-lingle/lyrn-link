import React, { useState, useEffect, useContext } from 'react';
import { Search, Scraper, Draggable, ItemCard } from '../components';
import NoLists from '../assets/nolists.png';
import NoItems from '../assets/noitemsonlist.png';
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
                <div className="todo-text">
                    <div className="btn-red" style={{marginRight: '10px'}} onClick={destroyList}>
                        Delete
                    </div>
                    <div className="btn-black" style={{ color: add ? '#999999' : '' }} onClick={() => setAdd(prev => !prev)} >
                      <i className="far fa-plus-circle" style={{marginRight: '5px'}}/>
                      Item
                    </div>
                </div>
            );
        }
    }

    function editItems() {
        if (readOnly) {
            return null;
        } else {
            return(
                <div className="flex-between">
                    <div className="btn-black" onClick={() => setAdd(prev => !prev)} >
                      <i className="far fa-plus-circle" style={{marginRight: '5px'}}/>
                      Item
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

    if (!type) return(
        <div className="todo-card" style={{marginTop: '40px'}} >
            <img 
                className="todo-img"
                src={NoLists} 
                alt="Lyrn Link No Lists" 
            />
            <div className="big-heading" style={{marginBottom: '20px'}} >
                {
                    readOnly

                    ?   "They don't have any lists yet... stay tuned!"

                    :   "Welcome to Lyrnlink, It's time to create your first list!"
                }
            </div>
        </div>
    );

    if (items.length === 0) return(
        <div>
            {addItem()}
            <div className="todo-card" style={{marginTop: '40px'}} >
                <img 
                    className="todo-img"
                    src={NoItems} 
                    alt="Lyrn Link No Items" 
                />
                <div className="big-heading">
                    {
                        readOnly

                        ?   "Don't worry, they're working on their list."

                        :   "Congrats, you added a list! Let's add your favorite items."
                    }
                    <div className="text-center" style={{marginTop: '20px'}}>{editBtns()}</div>
                </div>
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

                ?   <div className="list-heading">
                        <div className="main-heading">
                            <i className={icon} style={{fontSize: 'normal', marginRight: '10px'}} />
                            <strong>My Top {items.length} {capitalize(type)}</strong>
                        </div>
                        <div>{editItems()}</div>
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