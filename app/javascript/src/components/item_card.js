import React, { useRef } from 'react';
import { BookmarkButton, LikeButton } from '../components';
import Icon from '../assets/icon.png';

const ItemCard = ({ rank=true, id, bookmarkButton, bookmarked, followButton, followed, index, title, subtitle, image_url, url, url_copy, internal_url=false, creator, readOnly, searchResult, onDestroy }) => {
    const link = useRef();

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    function go() {
        if (url && !searchResult) link.current.click();
    }

    function button() {
        if (searchResult) {
            return;
        } else if (bookmarkButton) {
            return <BookmarkButton id={id} bookmarked={bookmarked} />;
        } else if (followButton) {
            return <LikeButton id={id} liked={followed} />;
        } else if (readOnly) {
            return <BookmarkButton id={id} bookmarked={bookmarked} />;
        } else {
            return <i className="far fa-times icon icon-delete item-delete" onClick={destroy} />;
        };
    }

    return(
        <div className={`item-card ${readOnly ? '' : 'draggable'}`} onClick={go} >
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
    );
};

export default ItemCard;