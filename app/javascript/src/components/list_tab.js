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
            className={`list-tab flex-between ${current ? 'current-list-tab' : ''}`}
            onClick={onClick}
        >
        	<div className="h h-tab">
	            <div>{type.toUpperCase()}</div>
	        </div>
	        {readOnly ? null : <i className="fas fa-times-circle delete-list" onClick={destroy} />}
        </div>
    );
};

export default ListTab;