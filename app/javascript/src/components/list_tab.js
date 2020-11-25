import React from 'react';

const ListTab = ({ type, onClick, onDestroy, current, readOnly }) => {

	function destroy(e) {
		e.stopPropagation();
		if (window.confirm('Are you sure you want to delete this list?')) {
			onDestroy();
		};
	};

    return(
        <div 
            className={`card list-tab ${current ? 'current-list-tab' : ''}`}
            onClick={onClick}
        >
        	<div className="card-wrapper">
	            <div>{type.toUpperCase()}</div>
	            {readOnly ? null : <i className="fa fa-trash" onClick={destroy} />}
	        </div>
        </div>
    );
};

export default ListTab;