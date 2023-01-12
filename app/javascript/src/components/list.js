import React, { useState, useEffect, useContext } from 'react';
import { ItemSearch, Scraper, Draggable, ItemCard, GroupForm, InviteUser } from '../components';
import NoItems from '../assets/noitems.png';
import NoItemsUser from '../assets/noitemsuser.png';
import Context from '../context';
import { capitalize } from '../utils';
import { observer } from '../utils';



const List = ({ type, singular, searchable, icon, items=[], createItem, destroyItem, isList, onFetch }) => {
    const [add, setAdd] = useState(false);
    const [addGroup, setAddGroup] = useState(false);
    const [invite, setInvite] = useState(false);
    const { state, api } = useContext(Context);
    const readOnly = state.readOnly;
    const isDiscover = state.tab === 'discover';
    const isGroups = type === 'groups' && state.tab === 'circle';

    useEffect(() => {
        setAdd(false);
        setAddGroup(false);
        setInvite(false);
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
                        <i className="fa-solid fa-trash" style={{marginRight: '4px'}}/>
                        List
                    </div>
                    <div className="btn-black" onClick={() => setAdd(prev => !prev)} >
                        <i className={`fa-solid fa-${add ? 'xmark' : 'plus'}`} style={{marginRight: '4px'}}/>
                        {capitalize(type)}
                    </div>
                </div>
            );
        }
    }

    function groupBtns() {
        if (state.groupReadOnly) {
            return null;
        } else {
            return(
                <div className="flex todo-btns">
                    <div className="btn-black" onClick={() => setInvite(prev => !prev)} >
                        <i className={`fa-solid fa-${add ? 'xmark' : 'plus'}`} style={{marginRight: '4px'}}/>
                        Invite User
                    </div>
                </div>
            );
        }
    }

    function addItem() {
        if (add) {

            if (searchable) {

                return <ItemSearch type={type} item={singular} >
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
                </ItemSearch>;

            } else {

                return <Scraper onSubmit={(result) => {
                        createItem(type, result);
                        setAdd(false);
                    }} 
                />;

            }
        }
    }

    function groupForm() {
        if (addGroup) {
            return(
                <GroupForm onSubmit={() => setAddGroup(false)} />
            );
        }
    }

    function inviteForm() {
        if (invite) {
            return(
                <InviteUser />
            );
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

        } else if (type === 'members') {

            return(
                <div>
                    {inviteForm()}
                    <div className="todo-card" >
                        <img 
                            className="todo-img"
                            src={NoItems} 
                            alt="Lyrn Link No Items" 
                        />
                        <div className="todo-text">
                            <div className="todo-heading">🎉 Congrats, you've made a new group!</div>
                            <div className="todo-body">Go ahead and start inviting people!</div>
                        </div>
                        <div className="text-center" style={{marginTop: '20px'}}>{groupBtns()}</div>
                    </div>
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
            {
                !readOnly && isGroups

                ?   <div className="list-heading">
                        <div style={{marginLeft: 'auto'}} >
                            <div className="btn-black" onClick={() => setAddGroup(prev => !prev)} >
                                <i className={`fa-solid fa-${addGroup ? 'xmark' : 'plus'}`} style={{marginRight: '4px'}}/>
                                Group
                            </div>
                        </div>
                    </div>

                :   null
            }
            {
                !readOnly && type == "members"

                ?   <div className="list-heading">
                        <div style={{marginLeft: 'auto'}} >
                            {groupBtns()}
                        </div>
                    </div>

                :   null
            }
            {addItem()}
            {groupForm()}
            {inviteForm()}
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
                        readOnly={readOnly || isDiscover || isGroups}
                        rank={isList || isDiscover}
                        onDestroy={() => destroyItem(type, item.id)}
                        followButton={['following', 'followers', 'users', 'members'].includes(type)}
                        bookmarkButton={['bookmarks', 'items'].includes(type)}
                        joinButton={type === 'groups'}
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