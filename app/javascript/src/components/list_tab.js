import React from 'react';

const ListCard = ({ type }) => {
    return(
        <div className="card list-card" onClick={() => window.location.href = `/admin/lists/${type.toLowerCase()}`} >
            {type.toUpperCase()}
        </div>
    );
};

export default ListCard;