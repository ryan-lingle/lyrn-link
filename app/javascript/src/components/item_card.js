import React, { useRef, useContext, useState, useEffect } from 'react';
import { BookmarkButton, LikeButton, JoinButton } from '../components';
import Icon from '../assets/icon.png';
import Context from '../context';


const ItemCard = ({ rank=true, id, meta_item_id, trueItem=false, pending, invite, bookmarkButton, bookmarked, followButton, followed, joinButton, joined, count, private_group, index, title, subtitle, image_url, url, url_copy, internal_url=false, creator, readOnly, searchResult, lastItem, onDestroy, onMove }) => {
    const link = useRef();
    const card = useRef();

    const { api, state } = useContext(Context);

    const [inviteState, setInviteState] = useState(invite);
    useEffect(() => {
        setInviteState(invite);
    }, [ invite ]);

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    function go() {
        // if item
        if (trueItem) {
            window.location.href = `/${state.user.handle}/i/${id}`;
        } else if (!searchResult) {
            window.location.href = url;
        };
    }

    async function acceptGroupInvite(e) {
        e.stopPropagation();
        const res = await api.updateGroupRelationship(id, { accepted: true });
        if (res) setInviteState(false);
    }

    async function destroyGr(e) {
        e.stopPropagation();
        const res = await api.destroyGroupRelationship(id); 
        if (res) card.current.style.display = 'none';
    }

    function button() {
        if (searchResult) {
            return;
        } else if (inviteState) {
            return <div className="flex">
                        <div className="btn-invite" onClick={acceptGroupInvite}>Accept</div>
                        <div className="btn-invite" onClick={destroyGr}>Deny</div>
                    </div>
        } else if (pending) {
            return <div className="invite-pending">Pending</div>;
        } else if (bookmarkButton) {
            return <BookmarkButton id={meta_item_id || id} bookmarked={bookmarked} count={count} />;
        } else if (followButton) {
            return <LikeButton id={id} liked={followed} count={count} />;
        } else if (joinButton) {
            return <JoinButton id={id} count={count} joined={joined} show={!private_group} />;
        } else if (readOnly) {
            return <BookmarkButton id={meta_item_id || id} bookmarked={bookmarked} count={count} />;
        } else {
            return <i className="fa-solid fa-circle-xmark icon icon-delete item-delete" onClick={destroy} />;
        };
    }

    return(
        <div className="item-card-wrapper" ref={card} >
            {
                rank && !readOnly

                ?   <div className="sort-arrows">
                        <i className="fa-solid fa-sort-up sort-arrow item-up" onClick={index === 0 ? null : () => onMove(index, index - 1)} />
                        <i className="fa-solid fa-sort-down sort-arrow item-down" onClick={lastItem ? null : () => onMove(index, index + 1)} />
                    </div>

                :   null
            }
            <div className={`item-card ${searchResult ? 'search-item' : ''} ${readOnly ? '' : 'draggable'}`} onClick={go} style={{marginLeft: rank && !readOnly ? '25px' : ''}} >
                {
                    rank

                    ?   <div className="item-ranking">
                            <div className="item-rank">
                                {index + 1}
                            </div>
                            {readOnly || !rank ? null : <i className="fa-solid fa-ellipsis-v icon"/>}              
                        </div>

                    :   null
                }
                
                <div className="item-box">
                    <img src={image_url || Icon} className="item-image" />
                </div>
                <div className="item-details truncate">
                    <div className="huge-body truncate">
                        {title}
                        {subtitle ? '   ' : ''}
                        <span className="main-body">
                            {subtitle}
                        </span>
                    </div>
                    <a 
                        className={`big-body ${!creator ? '' : 'no-decoration'}`}
                        href={url} 
                        ref={link}
                        target={internal_url ? "" : "_blank"}
                    >
                        {creator || url_copy || url}
                    </a>
                </div>
                {button()}
            </div>
        </div>
    );
};

export default ItemCard;