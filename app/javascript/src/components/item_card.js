import React from 'react';

const ItemCard = ({ rank=true, id, index, title, subtitle, image, url, url_copy, creator, readOnly, onDestroy }) => {

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    return(
        <div className={`item-card flex-between ${readOnly ? '' : 'draggable'}`}>
            {
                rank

                ?   <div className="h h-rank">
                        {index + 1}
                    </div>

                :   null
            }
            <div className="item-box">
                <img src={image} className="item-image" />
            </div>
            <div className="flex-grow">
                <div className="h h-itemtitle">
                    {title}
                    {subtitle ? ' - ' : ''}
                    {subtitle}
                </div>
                <a 
                    className={`b b-creator ${!creator ? '' : 'no-decoration'}`}
                    href={url} 
                    target="_blank" 
                >
                    {creator || url_copy || url}
                </a>
            </div>
            {readOnly ? null : <i className="fal fa-times-circle delete-item" onClick={destroy} />}
        </div>
    );
};

export default ItemCard;