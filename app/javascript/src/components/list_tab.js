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
        	<div className="big-heading">
	            <div>{type.toUpperCase()}</div>
	        </div>
	        {/*readOnly ? null : <i className="fa fa-trash" onClick={destroy} />*/}
        </div>
    );
};

export default ListTab;