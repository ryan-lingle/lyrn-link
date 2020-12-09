import React from 'react';

const ItemCard = ({ rank=true, id, index, title, subtitle, image, url, url_copy, creator, readOnly, onDestroy }) => {

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    return(
        <div className={`item-card ${readOnly ? '' : 'draggable'}`}>
            {
                rank

                ?   <div className="item-rank">
                        #{index + 1}
                    </div>

                :   null
            }
            <div className="item-box">
                <img src={image} className="item-image" />
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
            <div className="item-delete">
                {readOnly ? null : <i className="fal fa-times icon icon-delete" onClick={destroy} />}
            </div>
        </div>
    );
};

export default ItemCard;