import React, { useState, useEffect, useContext } from 'react';
import { Search, Scraper, Draggable, ItemCard } from '../components';
import NoItems from '../assets/noitems.png';
import NoItemsUser from '../assets/noitemsuser.png';
import Context from '../context';
import { capitalize } from '../utils';
import { observer } from '../utils';

const List = ({ type, singular, searchable, icon, items=[], createItem, destroyItem, isList, onFetch }) => {
    const [add, setAdd] = useState(false);
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;
    const isDiscover = ['users', 'items'].includes(type);

    useEffect(() => {
        setAdd(false);
    }, [type]);

    useEffect(() => {
        const streamObserver = observer(() => {
            onFetch(items.length, state.tabIndex);
            streamObserver.unobserve(sb);
        });

        const sb = document.getElementById("list-bottom");

        if (sb && onFetch) streamObserver.observe(sb);

        return () => sb ? streamObserver.unobserve(sb) : null;

    }, [ items.length, state.tabIndex ]);

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
                <div className="flex todo-btns">
                    <div className="btn-red" style={{marginRight: '5px'}} onClick={destroyList}>
                        <i className="far fa-trash" style={{marginRight: '4px'}}/>
                        List
                    </div>
                    <div className="btn-black" onClick={() => setAdd(prev => !prev)} >
                        <i className={`far fa-${add ? 'times' : 'plus'}`} style={{marginRight: '4px'}}/>
                        {capitalize(type)}
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
                                searchResult={true}
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
                                    <div className="todo-heading">Hold tight, please?</div>
                                    <div className="todo-body">{state.user.name} is working hard on this list...</div>
                                </div>
                            </div>

                        :   <div className="todo-card" >
                                <img 
                                    className="todo-img"
                                    src={NoItemsUser} 
                                    alt="Lyrn Link No Items" 
                                />
                                <div className="todo-text">
                                    <div className="todo-heading">🎉 Congrats, you've made a new list!</div>
                                    <div className="todo-body">Go ahead and add some of your favorites to it... don't be shy.</div>
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
                            <strong>My Favorite {capitalize(type)}</strong>
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
                        onMove={(d, h) => { onMove(d, h); api.updateItemIndex(); }}
                        readOnly={readOnly || isDiscover}
                        rank={isList || isDiscover}
                        onDestroy={() => destroyItem(type, item.id)}
                        followButton={['following', 'followers', 'users'].includes(type)}
                        bookmarkButton={['bookmarks', 'items'].includes(type)}
                        lastItem={items.length === i + 1}
                        {...item} 
                    />
                </Draggable>
            )}
            <div id="list-bottom"></div>
        </div>
    );
}

export default List;