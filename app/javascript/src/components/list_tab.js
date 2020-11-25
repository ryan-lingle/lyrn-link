import React, { useRef } from 'react';

const ListTab = ({ type, onClick, onDestroy, current }) => {
	const listTab = useRef();

	function destroy(e) {
		e.stopPropagation();
		if (window.confirm('Are you sure you want to delete this list?')) {
			listTab.current.style.display = 'none';
			onDestroy();
		};
	};

    return(
        <div 
            className={`card list-tab ${current ? 'current-list-tab' : ''}`}
            onClick={onClick}
            ref={listTab}
        >
        	<div className="card-wrapper">
	            <div>{type.toUpperCase()}</div>
	            <i className="fa fa-times" onClick={destroy} />
	        </div>
        </div>
    );
};

export default ListTab;