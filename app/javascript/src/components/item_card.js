import React from 'react';

const ItemCard = ({ id, index, title, subtitle, image, url, url_copy, creator, readOnly, onDestroy }) => {

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    return(
        <div className="item-card flex-between draggable" >
            <div className="item-rank">
                {index + 1}
            </div>
            <div style={{minWidth: '60px'}} >
                <img src={image} className="item-image" /> 
            </div>  
            <div className="flex-grow">
                <div className="item-title">
                    {title}
                    {subtitle ? ' - ' : ''}
                    {subtitle}
                </div>
                <a className="little-heading item-creator" href={url} target="_blank" >{creator || url_copy || url}</a>
            </div>
            {readOnly ? null : <i className="fal fa-times" style={{marginLeft: '10px'}} onClick={destroy} />}
        </div>
    );
};

export default ItemCard;