import React, { useState, useEffect, useContext } from 'react';
import { Search, Scraper, Draggable, ItemCard } from '../components';
import NoItems from '../assets/noitems.png';
import NoItemsUser from '../assets/noitemsuser.png';
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
                <div className="todo-btns">
                    <div className="btn-red" style={{marginRight: '10px'}} onClick={destroyList}>
                        Delete List
                    </div>
                    <div className="btn-black" onClick={() => setAdd(prev => !prev)} >
                      <i className={`far fa-${add ? 'minus' : 'plus'}-circle`} style={{marginRight: '5px'}}/>
                      Item
                    </div>
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

    if (!type) return <div/>;

    if (items.length === 0) {
        
        if (isList) {

            return(
                <div>
                    {addItem()}
                    {
                        readOnly

                        ?   <div className="todo-card" >
                                <img 
                                    className="todo-img"
                                    src={NoItems} 
                                    alt="Lyrn Link No Items" 
                                />
                                <div className="todo-text">
                                    <div className="big-heading"> Hold tight, please?</div>
                                    <div className="main-heading">{state.user.name} is working hard on this list...</div>
                                </div>
                            </div>

                        :   <div className="todo-card" >
                                <img 
                                    className="todo-img"
                                    src={NoItemsUser} 
                                    alt="Lyrn Link No Items" 
                                />
                                <div className="todo-text">
                                    <div className="big-heading">🎉 Congrats, you've made a new list!</div>
                                    <div className="main-heading">Go ahead and add some of your favorites to it, don't be shy.</div>
                                </div>
                                <div className="text-center" style={{marginTop: '20px'}}>{editBtns()}</div>
                            </div>
                    }
                </div>
            )

        } else {

            return(
                <div>
                    <div className="todo-card" >
                        <img 
                            className="todo-img"
                            src={NoItems} 
                            alt="Lyrn Link No Items" 
                        />
                        <div className="big-heading">Nothing to see hear yet!</div>
                    </div>
                </div>
            )

        }
    };

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
                        <div>{editBtns()}</div>
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