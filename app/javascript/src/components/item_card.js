import React from 'react';

const ItemCard = ({ id, index, title, image, url, readOnly, onDestroy }) => {
    function go() {
        if (url) window.open(url, '_blank');
    };

    function destroy(e) {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDestroy();
        };
    };

    return(
        <div className="card item-card" id="drag-item" onClick={go} >
            <div className="card-wrapper">
                <img src={image} width="70px" />   
                <div className="card-wrapper">
                    <div className="b-copy">{title}</div>
                    {readOnly ? null : <i className="fa fa-trash" style={{marginLeft: '10px', color: 'red'}} onClick={destroy} />}
                </div>
            </div>
        </div>
    );
};

export default ItemCard;