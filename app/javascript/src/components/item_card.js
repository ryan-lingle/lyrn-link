import React from 'react';

const ItemCard = ({ title, image, url }) => {

    function go() {
        if (url) window.open(url, '_blank');
    };

    return(
        <div className="card item-card" onClick={go} >
            <div className="card-wrapper">
                <img src={image} width="70px" />
                <div className="b-copy">{title}</div>
            </div>
        </div>
    );
};

export default ItemCard;