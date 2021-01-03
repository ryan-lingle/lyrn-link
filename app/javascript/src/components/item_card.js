import React from 'react';
import { BookmarkButton, LikeButton } from '../components';
import Icon from '../assets/icon.png';

const ItemCard = ({ rank=true, id, bookmarkButton, bookmarked, followButton, followed, index, title, subtitle, image_url, url, url_copy, creator, readOnly, onDestroy }) => {

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    function button() {
        if (bookmarkButton) {
            return <BookmarkButton id={id} bookmarked={bookmarked} />;
        } else if (followButton) {
            return <LikeButton id={id} liked={followed} />;
        } else if (readOnly) {
            return <BookmarkButton id={id} bookmarked={bookmarked} />;
        } else {
            return <i className="fal fa-times icon icon-delete item-delete" onClick={destroy} />;
        }
    }

    return(
        <div className={`item-card ${readOnly ? '' : 'draggable'}`}>
            <div className="item-ranking">
                {
                    rank

                    ?   <div className="item-rank">
                            {index + 1}
                        </div>

                    :   null
                }       
                {readOnly || !rank ? null : <i className="fas fa-ellipsis-v icon"/>} 
            </div>
            
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
                    target="_blank" 
                >
                    {creator || url_copy || url}
                </a>
            </div>
            {button()}
        </div>
    );
};

export default ItemCard;