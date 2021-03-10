import React, { useRef, useContext, useState, useEffect } from 'react';
import { BookmarkButton, LikeButton, JoinButton } from '../components';
import Icon from '../assets/icon.png';
import Context from '../context';


const ItemCard = ({ rank=true, id, meta_item_id, pending, invite, bookmarkButton, bookmarked, followButton, followed, joinButton, joined, count, index, title, subtitle, image_url, url, url_copy, internal_url=false, creator, readOnly, searchResult, lastItem, onDestroy, onMove }) => {
    const link = useRef();
    const card = useRef();

    const { api } = useContext(Context);

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
        if (url && !searchResult) link.current.click();
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
                        <div className="accept-invite" onClick={acceptGroupInvite}>Accept</div>
                        <div className="accept-invite" onClick={destroyGr}>Deny</div>
                    </div>
        } else if (pending) {
            return <div className="invite-pending">Pending</div>;
        } else if (bookmarkButton) {
            return <BookmarkButton id={meta_item_id || id} bookmarked={bookmarked} count={count} />;
        } else if (followButton) {
            return <LikeButton id={id} liked={followed} count={count} />;
        } else if (joinButton) {
            return <JoinButton id={id} count={count} joined={joined} />;
        } else if (readOnly) {
            return <BookmarkButton id={meta_item_id || id} bookmarked={bookmarked} count={count} />;
        } else {
            return <i className="far fa-times icon icon-delete item-delete" onClick={destroy} />;
        };
    }

    return(
        <div className="item-card-wrapper" ref={card} >
            {
                rank && !readOnly

                ?   <div className="sort-arrows">
                        <i className="fas fa-sort-up sort-arrow item-up" onClick={index === 0 ? null : () => onMove(index, index - 1)} />
                        <i className="fas fa-sort-down sort-arrow item-down" onClick={lastItem ? null : () => onMove(index, index + 1)} />
                    </div>

                :   null
            }
            <div className={`item-card ${readOnly ? '' : 'draggable'}`} onClick={go} style={{marginLeft: rank && !readOnly ? '25px' : ''}} >
                {
                    rank

                    ?   <div className="item-ranking">
                            <div className="item-rank">
                                {index + 1}
                            </div>
                            {readOnly || !rank ? null : <i className="fas fa-ellipsis-v icon"/>}              
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